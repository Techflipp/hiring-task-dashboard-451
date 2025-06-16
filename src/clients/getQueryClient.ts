import { QueryClient, isServer } from "@tanstack/react-query";
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // to overwrite react query's default stale time to make it easier for ssr
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

// this is to make sure there is one instance of the query client
export function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}
