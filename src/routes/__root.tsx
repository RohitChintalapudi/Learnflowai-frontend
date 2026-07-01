import { createRootRoute, Outlet, Link } from "@tanstack/react-router";
import { Toaster } from "react-hot-toast";
import { ProductTourProvider } from "../contexts/ProductTourContext";
// import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
  component: () => (
    <ProductTourProvider>
      <Outlet />
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={12}
        containerClassName=""
        toastOptions={{
          duration: 3000,
          className:
            "!rounded-2xl !border !border-orange-500/30 !bg-white dark:!bg-[#111] !shadow-xl !shadow-orange-500/10 !text-[13px] !font-medium !px-5 !py-3 !text-[#111827] dark:!text-white toast-slide-in-left",
          success: {
            iconTheme: {
              primary: "#ff7a18",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
      {/* {import.meta.env.DEV && <TanStackRouterDevtools />} */}
    </ProductTourProvider>
  ),
  notFoundComponent: () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-gray-50 dark:bg-zinc-950 font-sans">
      <h1 className="text-6xl font-extrabold text-orange-500 mb-2">404</h1>
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Page Not Found</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link
        to="/dashboard"
        className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-colors shadow-lg shadow-orange-500/25 active:scale-95"
      >
        Go to Dashboard
      </Link>
    </div>
  )
});

