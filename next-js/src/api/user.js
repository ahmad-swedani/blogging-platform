import useSWR from 'swr';
import { useMemo } from 'react';
// utils
import { fetcher, endpoints } from 'src/utils/axios';

const STORAGE_KEY = 'accessToken';

export function useGetMyProfile() {
  const URL = endpoints.auth.me;
  const accessToken = sessionStorage.getItem(STORAGE_KEY);

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : null,
  });

  const memoizedValue = useMemo(
    () => ({
      user: data?.data?.user || {},
      profileLoading: isLoading,
      profileError: error,
      profileValidating: isValidating,
      postsEmpty: !isLoading && !data?.data?.results,
    }),
    [data?.data?.results, data?.data?.user, error, isLoading, isValidating]
  );

  return memoizedValue;
}
