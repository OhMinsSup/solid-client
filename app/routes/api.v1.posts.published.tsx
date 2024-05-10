import type { LoaderFunctionArgs } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';

import type { SearchParams } from '~/.server/utils/request.server';
import { getCookie } from '~/.server/utils/request.server';
import {
  defaultPaginationResponse,
  errorJsonDataResponse,
  successJsonResponse,
} from '~/.server/utils/response.server';
import { isFetchError } from '~/services/api/error';
import { getInfinityQueryPath, parseUrlParams } from '~/services/libs';
import { createError, ErrorDisplayType, isError } from '~/services/libs/error';
import { HttpStatus } from '~/services/libs/http-status.enum';
import { getInfinityQueryFn } from '~/services/react-query/function';

type Data = SerializeSchema.SerializePost<false>;

type DataList = FetchRespSchema.ListResp<SerializeSchema.SerializePost<false>>;

type DataSchema = FetchRespSchema.Success<DataList>;

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  try {
    const { cookies } = getCookie(request);
    if (!cookies) {
      throw createError({
        statusMessage: 'Unauthorized',
        statusCode: HttpStatus.UNAUTHORIZED,
        displayType: ErrorDisplayType.NONE,
        data: defaultPaginationResponse<Data>(),
      });
    }

    const post = context.agent.api.app.post;
    const response = await post.getPublishedHandler<DataSchema>({
      headers: {
        Cookie: cookies,
      },
      query: parseUrlParams(request.url),
    });

    const data = response._data;
    return json(
      successJsonResponse(
        data ? data.result : defaultPaginationResponse<Data>(),
      ),
    );
  } catch (error) {
    if (isError<DataSchema>(error)) {
      return json(errorJsonDataResponse(error.data, error.message));
    }

    if (isFetchError<DataSchema>(error)) {
      return json(
        errorJsonDataResponse(defaultPaginationResponse<Data>(), error.message),
      );
    }

    throw error;
  }
};

export type RoutesLoaderData = typeof loader;

export const getBasePath = '/api/v1/posts/published';

export const getPath = (searchParams?: SearchParams, pageNo?: number) => {
  return getInfinityQueryPath(getBasePath, searchParams, pageNo);
};

type QueryKey = [string, SearchParams];

interface UsePostPublishedInfiniteQueryParams {
  initialData?: DataSchema;
  originUrl?: string;
  searchParams?: SearchParams;
}

export function usePostPublishedInfiniteQuery(
  opts?: UsePostPublishedInfiniteQueryParams,
) {
  const queryKey: QueryKey = [getBasePath, opts?.searchParams];

  return useSuspenseInfiniteQuery({
    queryKey,
    queryFn: getInfinityQueryFn(getPath, opts),
    initialPageParam: 1,
    refetchOnMount: 'always',
    // @ts-expect-error - This is a bug in react-query types
    initialData: opts?.initialData
      ? () => ({ pageParams: [undefined], pages: [opts.initialData] })
      : undefined,
    getNextPageParam: (lastPage) => {
      const pageInfo = lastPage?.result?.pageInfo;
      if (pageInfo?.hasNextPage) {
        return pageInfo.nextPage;
      }
      return undefined;
    },
  });
}
