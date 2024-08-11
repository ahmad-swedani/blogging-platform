'use client';

import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// utils
import { fDate } from 'src/utils/format-time';
import { fShortenNumber } from 'src/utils/format-number';
// components
import Label from 'src/components/label';
import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import TextMaxLine from 'src/components/text-max-line';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import axios, { endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export default function PostItemHorizontal({ post, isMyPosts }) {
  const popover = usePopover();


  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const {
    _id,
    title,
    author,
    coverUrl,
    createdAt,
    numLikes,
    numComments,
    content,
  } = post;
  const publish = 'published';

  return (
    <>
      <Stack component={Card} direction="row">
        <Stack
          sx={{
            p: (theme) => theme.spacing(3, 3, 2, 3),
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
            <Label variant="soft" color={(publish === 'published' && 'info') || 'default'}>
              {/* {publish} */}
              published
            </Label>

            <Box component="span" sx={{ typography: 'caption', color: 'text.disabled' }}>
              {fDate(createdAt)}
            </Box>
          </Stack>

          <Stack spacing={1} flexGrow={1}>
            <Link color="inherit" component={RouterLink} href={paths.blog.post.details(_id)}>
              <TextMaxLine variant="subtitle2" line={2}>
                {title}
              </TextMaxLine>
            </Link>

            <TextMaxLine variant="body2" sx={{ color: 'text.secondary' }}>
              {content}
            </TextMaxLine>
          </Stack>

          <Stack direction="row" alignItems="center">
            <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
              <Iconify icon="eva:more-horizontal-fill" />
            </IconButton>

            <Stack
              spacing={1.5}
              flexGrow={1}
              direction="row"
              justifyContent="flex-end"
              sx={{
                typography: 'caption',
                color: 'text.disabled',
              }}
            >
              <Stack direction="row" alignItems="center">
                <Iconify icon="eva:message-circle-fill" width={16} sx={{ mr: 0.5 }} />
                {fShortenNumber(numComments) || 0}
              </Stack>

              <Stack direction="row" alignItems="center">
                <Iconify icon="solar:like-bold" width={16} sx={{ mr: 0.5 }} />
                {fShortenNumber(numLikes) || 0}
              </Stack>

            </Stack>
          </Stack>
        </Stack>

        {mdUp && (
          <Box
            sx={{
              width: 180,
              height: 240,
              position: 'relative',
              flexShrink: 0,
              p: 1,
            }}
          >
            <Avatar
              alt={author.name}
              src={author.avatarUrl}
              sx={{ position: 'absolute', top: 16, right: 16, zIndex: 9 }}
            />
            <Image alt={title} src={coverUrl} sx={{ height: 1, borderRadius: 1.5 }} />
          </Box>
        )}
      </Stack>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="bottom-center"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            popover.onClose();
            router.push(paths.blog.post.details(_id));
          }}
        >
          <Iconify icon="solar:eye-bold" />
          View
        </MenuItem>


        {isMyPosts && <>< MenuItem
          onClick={() => {
            popover.onClose();
            router.push(paths.blog.post.edit(_id));
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>

          <MenuItem
            onClick={async () => {
              popover.onClose();
              const accessToken = sessionStorage.getItem('accessToken');
              await axios.delete(`${endpoints.post.list}/${_id}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
              });

              router.push(paths.blog.post.my);
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem> </>}

      </CustomPopover >
    </>
  );
}

PostItemHorizontal.propTypes = {
  post: PropTypes.shape({
    _id: PropTypes.string,
    author: PropTypes.object,
    coverUrl: PropTypes.string,
    createdAt: PropTypes.instanceOf(Date),
    content: PropTypes.string,
    publish: PropTypes.string,
    title: PropTypes.string,
    numComments: PropTypes.number,
    numLikes: PropTypes.number,
  }),
  isMyPosts: PropTypes.bool,
};
