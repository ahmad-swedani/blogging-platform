import { paramCase } from 'src/utils/change-case';

const ROOTS = {
  AUTH: '/auth',
  BLOG: '/blog',
  USER: '/user',
};

// ----------------------------------------------------------------------

export const paths = {
  // AUTH
  auth: {
    jwt: {
      login: `${ROOTS.AUTH}/login`,
      register: `${ROOTS.AUTH}/register`,
    },
  },
  // DASHBOARD
  blog: {
    post: {
      root: `${ROOTS.BLOG}/post`,
      my: `${ROOTS.BLOG}/post/my-posts`,
      new: `${ROOTS.BLOG}/post/new`,
      details: (_id) => `${ROOTS.BLOG}/post/${paramCase(_id)}`,
      edit: (_id) => `${ROOTS.BLOG}/post/${paramCase(_id)}/edit`,
    },
    root: ROOTS.BLOG,
    one: `${ROOTS.BLOG}/one`,
    user: {
      root: `${ROOTS.BLOG}/user/account`,
    },
  },
  // PROFILE
};
