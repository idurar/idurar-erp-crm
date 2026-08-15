"use client";

import { type PropsWithChildren, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function Providers({ children }: PropsWithChildren) {
  const [client] = useState(() => new QueryClient({ defaultOptions: { queries: { staleTime: 15000 } } }));
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
