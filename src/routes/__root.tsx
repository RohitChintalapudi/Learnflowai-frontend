import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Toaster } from "react-hot-toast";
// import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
  component: () => (
    <>
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
    </>
  ),
});
