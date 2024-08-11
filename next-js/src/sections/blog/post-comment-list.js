import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
//
import PostCommentItem from './post-comment-item';

// ----------------------------------------------------------------------

export default function PostCommentList({ comments }) {
  return (
    <>
      {comments.map((comment) => {
        const { id, author, createdAt, content
        } = comment;

        return (
          <Box key={id}>
            <PostCommentItem
              name={author.name}
              message={content}
              postedAt={createdAt}
              avatarUrl={author.avatarUrl}
            />
          </Box>
        );
      })}
    </>
  );
}

PostCommentList.propTypes = {
  comments: PropTypes.array,
};
