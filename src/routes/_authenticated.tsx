import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { authStore } from '../store/authStore'
import { authClient } from '../lib/auth-client'

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
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Outlet />
    </div>
  )
}
