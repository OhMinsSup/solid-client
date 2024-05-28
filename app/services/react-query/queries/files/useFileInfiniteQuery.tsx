import { useSuspenseInfiniteQuery } from '@tanstack/react-query';

import { API_ENDPOINTS } from '~/constants/constant';
import {
  getInfinityQueryFn,
  getInfinityQueryPath,
} from '~/services/react-query';
import { sharedQueryKey } from '~/services/react-query/shared';
import { useEnvStore } from '~/services/store/useEnvStore';

type Data = SerializeSchema.SerializeFile;

type DataList = FetchRespSchema.ListResp<Data>;

type DataSchema = FetchRespSchema.Success<DataList>;

type Params = {
  initialData?: DataSchema;
  searchParams?: UntilsTypes.SearchParams;
};

export function useFileInfiniteQuery({ initialData, searchParams }: Params) {
  const state = useEnvStore();
  const queryKey: QueriesTypes.BaseQueryKey = [
    sharedQueryKey,
    useFileInfiniteQuery.name,
    searchParams,
  ];

  const getPath = (
    searchParams?: UntilsTypes.SearchParams,
    pageNo?: number,
  ) => {
    return getInfinityQueryPath(API_ENDPOINTS.FILES.ROOT, searchParams, pageNo);
  };

  return useSuspenseInfiniteQuery({
    queryKey,
    queryFn: getInfinityQueryFn(getPath, {
      options: {
        baseURL: state.getApiHost(),
      },
    }),
    initialPageParam: 1,
    // @ts-expect-error - This is a bug in react-query types
    initialData: initialData
      ? () => ({ pageParams: [undefined], pages: [initialData] })
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
