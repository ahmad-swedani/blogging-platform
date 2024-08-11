import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
// components
import { red } from '@mui/material/colors';
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

import axios, { endpoints } from 'src/utils/axios';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';


// ----------------------------------------------------------------------

export default function PostCommentForm({ id }) {
  const CommentSchema = Yup.object().shape({
    comment: Yup.string().required('Comment is required'),
  });

  const router = useRouter();

  const defaultValues = {
    comment: '',
    name: '',
    email: '',
  };

  const methods = useForm({
    resolver: yupResolver(CommentSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await axios.post(`${endpoints.post.comment}/${id}`, {
        comment: data.comment,
      });
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      router.push(paths.blog.post.details(id))
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3}>
        <RHFTextField
          name="comment"
          placeholder="Write some of your comments..."
          multiline
          rows={4}
        />

        <Stack direction="row" alignItems="end">
          <Stack direction="row" alignItems="center" flexGrow={1} />

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Post comment
          </LoadingButton>
        </Stack>
      </Stack>
    </FormProvider >
  );
}

PostCommentForm.propTypes = {
  id: PropTypes.string,
};
