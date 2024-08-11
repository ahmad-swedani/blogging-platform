import useSWR from 'swr';
import { useMemo } from 'react';
// utils
import { fetcher, endpoints } from 'src/utils/axios';

const STORAGE_KEY = 'accessToken';

export function useGetPosts(myPosts) {
  const URL = myPosts ? endpoints.post.my : endpoints.post.list;
  const accessToken = sessionStorage.getItem(STORAGE_KEY);

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : null,
  });

  const memoizedValue = useMemo(
    () => ({
      posts: data?.data?.posts || [],
      postsLoading: isLoading,
      postsError: error,
      postsValidating: isValidating,
      postsEmpty: !isLoading && !data?.data?.results,
    }),
    [data?.data?.posts, data?.data?.results, error, isLoading, isValidating]
  );

  return memoizedValue;
}


export function useGetPost(title) {
  const URL = title ? [`${endpoints.post.details}/${title}`] : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      post: data?.data?.post,
      postLoading: isLoading,
      postError: error,
      postValidating: isValidating,
    }),
    [data?.data?.post, error, isLoading, isValidating]
  );

  return memoizedValue;
}


export function useCommentPost(postId, comment) {
  const URL = postId ? [`${endpoints.post.comment}/${postId}`] : null;
  const accessToken = sessionStorage.getItem(STORAGE_KEY);

  const { data, mutate, error, isValidating, isLoading } = useSWR(URL, fetcher, {
    method: 'POST',
    body: { comment },
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : null,
  });

  const memoizedValue = useMemo(
    () => ({
      comment: data?.data?.comment,
      commentMutate: mutate,
      commentError: error,
      commentValidating: isValidating,
      commentLoading: isLoading,
    }),
    [data?.data?.comment, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}
