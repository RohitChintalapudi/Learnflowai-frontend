import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { authStore } from '../store/authStore'
import { authClient } from '../lib/auth-client'
import { ProductTour } from '../components/Tour/ProductTour'
import { TourPrompt } from '../components/Tour/TourPrompt'
import { useProductTour } from '../contexts/ProductTourContext'
import { FeedbackWidget } from '../components/FeedbackWidget'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ location }) => {
    let isAuthenticated = authStore.isAuthenticated

    if (!isAuthenticated) {
      try {
        const { data } = await authClient.getSession();
        if (data && data.session) {
          authStore.setAuthenticated(true);
          if (data.user) {
            localStorage.setItem("lf_user_name", data.user.name || "");
            localStorage.setItem("lf_user_image", data.user.image || "");
          }
          isAuthenticated = true;
        }
      } catch (e) {
        console.error("Failed to fetch active session:", e);
      }
    }

    if (!isAuthenticated) {
      throw redirect({
        to: '/login',
        // Preserve the attempted URL path so we can redirect back after login.
        search: { redirect: location.pathname },
      } as any)
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
      <FeedbackWidget />
    </div>
  )
}
