import React, { useCallback } from "react";
import { json } from "@remix-run/cloudflare";
import { Account } from "~/components/setting/future/Account";

// hooks
import {
  isRouteErrorResponse,
  useFetcher,
  useRouteError,
} from "@remix-run/react";

// types
import type { ActionArgs, V2_MetaFunction } from "@remix-run/cloudflare";

export const meta: V2_MetaFunction = ({ matches }) => {
  const Seo = {
    title: "Account Settings — Hashnode",
  };
  const rootMeta =
    // @ts-ignore
    matches.filter((match) => match.id === "root")?.at(0)?.meta ?? [];
  const rootMetas = rootMeta.filter(
    // @ts-ignore
    (meta) =>
      meta.name !== "description" &&
      meta.name !== "og:title" &&
      meta.name !== "og:description" &&
      meta.name !== "twitter:title" &&
      meta.name !== "twitter:description" &&
      !("title" in meta)
  );
  return [
    ...rootMetas,
    {
      title: Seo.title,
    },
    {
      name: "og:title",
      content: Seo.title,
    },
    {
      name: "twitter:title",
      content: Seo.title,
    },
  ];
};

export const action = async ({ context, request }: ActionArgs) => {
  const response = await context.api.user.deleteByUser(request);
  if (response instanceof Response) return response;
  return json(response);
};

export type Action = typeof action;

export default function Routes() {
  const fetcher = useFetcher<Action>();

  const onDeleteAccount = useCallback(() => {
    const confirmDelete = confirm(
      "Are you sure you want to delete your account?"
    );

    if (!confirmDelete) return;

    fetcher.submit(null, {
      method: "DELETE",
      replace: true,
    });
  }, [fetcher]);

  return <Account onDeleteAccount={onDeleteAccount} />;
}

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return <Routes />;
  } else if (error instanceof Error) {
    return <Routes />;
  } else {
    return <Routes />;
  }
}
