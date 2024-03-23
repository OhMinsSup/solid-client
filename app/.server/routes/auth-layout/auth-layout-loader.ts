import { json } from "@remix-run/cloudflare";
import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { redirectIfLoggedInLoader } from "~/.server/utils/auth.server";
import { ASSET_URL, PAGE_ENDPOINTS } from "~/constants/constant";

export const authLayoutLoader = async ({
  request,
  context,
}: LoaderFunctionArgs) => {
  redirectIfLoggedInLoader(request, context, PAGE_ENDPOINTS.ROOT);
  const data = {
    image: ASSET_URL.DEFAULT_AVATAR,
    username: "Guillermo Rauch",
    job: "CEO, Vercel",
    description: `It's amazing to see how fast devs go from 0 to Blog under a domain they own on Hashnode 🤯. It reminds me a lot of what Substack did for journalists.`,
  } as FetchSchema.Hashnodeonboard;
  return json(data, {
    headers: {
      "Cache-Control": "public, max-age=3600",
    },
  });
};

export type RoutesLoaderData = Promise<FetchSchema.Hashnodeonboard>;
