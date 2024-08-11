'use client';

import PropTypes from 'prop-types';
import orderBy from 'lodash/orderBy';
import { useCallback, useState } from 'react';
// @mui
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
// hooks
// _mock
import { POST_SORT_OPTIONS } from 'src/_mock';
// api
import { useGetPosts } from 'src/api/blog';
// components
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import PostSort from '../post-sort';
import PostListHorizontal from '../post-list-horizontal';


export default function PostListView({ myPosts }) {
  const settings = useSettingsContext();

  const [sortBy, setSortBy] = useState('latest');

  const { posts, postsLoading } = useGetPosts(myPosts);

  const dataFiltered = applyFilter({
    inputData: posts,
    sortBy,
  });

  const handleSortBy = useCallback((newValue) => {
    setSortBy(newValue);
  }, []);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={myPosts ? "My Posts" : "All Posts"}
        links={[
          {
            name: 'Dashboard',
            href: paths.blog.root,
          },
          {
            name: 'Blog',
            href: paths.blog.post.root,
          },
          {
            name: 'List',
          },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.blog.post.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New Post
          </Button>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Stack
        spacing={3}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-end', sm: 'center' }}
        direction={{ xs: 'column', sm: 'row' }}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        <PostSort sort={sortBy} onSort={handleSortBy} sortOptions={POST_SORT_OPTIONS} />
      </Stack>

      <PostListHorizontal posts={dataFiltered} loading={postsLoading} isMyPosts={myPosts} />
    </Container>
  );
}

// ----------------------------------------------------------------------

const applyFilter = ({ inputData, sortBy }) => {

  if (sortBy === 'latest') {
    inputData = orderBy(inputData, ['createdAt'], ['desc']);
  }

  if (sortBy === 'oldest') {
    inputData = orderBy(inputData, ['createdAt'], ['asc']);
  }

  return inputData;
};

PostListView.propTypes = {
  myPosts: PropTypes.bool,
};
