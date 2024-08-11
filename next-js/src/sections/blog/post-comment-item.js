import PropTypes from 'prop-types';
// @mui
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
// utils
import { fDate } from 'src/utils/format-time';
// components

// ----------------------------------------------------------------------

export default function PostCommentItem({ name, avatarUrl, message, postedAt }) {

  return (
    <ListItem
      sx={{
        p: 0,
        pt: 3,
        alignItems: 'flex-start',
      }}
    >
      <Avatar alt={name} src={avatarUrl} sx={{ mr: 2, width: 48, height: 48 }} />

      <Stack
        flexGrow={1}
        sx={{
          pb: 3,
          borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
        }}
      >
        <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
          {name}
        </Typography>

        <Typography variant="caption" sx={{ color: 'text.disabled' }}>
          {fDate(postedAt)}
        </Typography>

        <Typography variant="body2" sx={{ mt: 1 }}>
          {message}
        </Typography>

      </Stack>
    </ListItem>
  );
}

PostCommentItem.propTypes = {
  avatarUrl: PropTypes.string,
  message: PropTypes.string,
  name: PropTypes.string,
  postedAt: PropTypes.string,
};
