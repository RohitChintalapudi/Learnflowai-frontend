import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

import { authStore } from '../store/authStore'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ location }) => {
    const isAuthenticated = authStore.isAuthenticated

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
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Outlet />
    </div>
  )
}
