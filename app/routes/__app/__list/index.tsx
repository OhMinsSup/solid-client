import React from "react";
import { type LoaderFunction, json } from "@remix-run/cloudflare";

// api
import { getPostsListApi } from "~/api/posts/posts";

// utils
import { parseUrlParams } from "~/utils/util";
import { RecentList } from "~/components/posts";

export const loader: LoaderFunction = async ({ request }) => {
  const params = parseUrlParams(request.url);

  let cursor = undefined;
  if (params.cursor) {
    cursor = parseInt(params.cursor);
  }

  let limit = 25;
  if (params.limit) {
    limit = parseInt(params.limit);
  }

  const posts = await getPostsListApi({
    cursor,
    limit,
    type: "recent",
  });

  return json({
    posts: posts.result?.result,
  });
};

export default function IndexPage() {
  return <RecentList />;
}
