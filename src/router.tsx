import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    // Reuse preloaded route data briefly to avoid immediate refetch/reload churn.
    defaultPreloadStaleTime: 30_000,
  });

  return router;
};
