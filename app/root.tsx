import {
  json,
  type LinksFunction,
  type LoaderFunction,
  type MetaFunction,
} from "@remix-run/cloudflare";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { globalClient } from "./api/client";

import {
  dehydrate,
  Hydrate,
  QueryClient,
  QueryClientProvider,
  type DehydratedState,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// api
import { getUserInfoSsrApi } from "./api/user";
import { QUERIES_KEY } from "./constants/constant";
import { applyAuth } from "./libs/server/applyAuth";

// styles
import tailwindStylesheetUrl from "./styles/tailwind.css";
import customStylesheetUrl from "./styles/custom.css";
import rcDrawerStylesheetUrl from "rc-drawer/assets/index.css";

export const loader: LoaderFunction = async ({ request }) => {
  const client = new QueryClient();
  const token = applyAuth(request);

  const resp = {
    dehydratedState: dehydrate(client),
  };

  try {
    if (token) {
      await client.fetchQuery(QUERIES_KEY.ME, () => getUserInfoSsrApi(token));
    }

    return json(resp);
  } catch (error) {
    return json(resp);
  }
};

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: tailwindStylesheetUrl },
    { rel: "stylesheet", href: customStylesheetUrl },
    { rel: "stylesheet", href: rcDrawerStylesheetUrl },
  ];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  const loadData = useLoaderData<{ dehydratedState: DehydratedState }>();

  return (
    <QueryClientProvider client={globalClient}>
      <Hydrate state={loadData.dehydratedState}>
        <html lang="kr">
          <head>
            <Meta />
            <Links />
          </head>
          <body className="bg-white leading-6">
            <Outlet />
            <ScrollRestoration />
            <Scripts />
            <LiveReload port={8002} />
            <ReactQueryDevtools initialIsOpen={false} />
          </body>
        </html>
      </Hydrate>
    </QueryClientProvider>
  );
}
