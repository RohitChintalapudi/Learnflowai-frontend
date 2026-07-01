import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { authStore } from '../store/authStore'
import { authClient } from '../lib/auth-client'
import { ProductTour } from '../components/Tour/ProductTour'
import { TourPrompt } from '../components/Tour/TourPrompt'
import { useProductTour } from '../contexts/ProductTourContext'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ location }) => {
    let isAuthenticated = authStore.isAuthenticated

    if (!isAuthenticated) {
      try {
        const { data: session } = await authClient.getSession();
        if (session) {
          authStore.setAuthenticated(true);
          isAuthenticated = true;
        }
      } catch (e) {
        console.error("Failed to fetch active session:", e);
      }
    }

    if (!isAuthenticated) {
      throw redirect({
        to: '/login',
        // Preserve the attempted URL so we can redirect back after login.
        search: { redirect: location.href },
      })
    }
  },
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  const { startTour } = useProductTour()
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    const shown = sessionStorage.getItem('lf_tour_prompt_shown')
    if (!shown) {
      sessionStorage.setItem('lf_tour_prompt_shown', 'true')
      const timer = setTimeout(() => setShowPrompt(true), 600)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAcceptTour = () => {
    setShowPrompt(false)
    startTour()
  }

  const handleSkipTour = () => {
    setShowPrompt(false)
    localStorage.setItem('lf_tour_completed', 'true')
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Outlet />
      <ProductTour />
      <TourPrompt
        isOpen={showPrompt}
        onAccept={handleAcceptTour}
        onSkip={handleSkipTour}
      />
    </div>
  )
}
