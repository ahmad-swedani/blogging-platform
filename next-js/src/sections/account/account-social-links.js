import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import InputAdornment from '@mui/material/InputAdornment';
import axios, { endpoints } from 'src/utils/axios';
// components
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
// routes
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export default function AccountSocialLinks({ socialLinks, user }) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = {
    facebook: 'www.facebook.com',
    instagram: 'www.instagram.com',
    linkedin: 'www.linkedin.com',
    twitter: 'www.twitter.com',
  };

  const methods = useForm({
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (user && socialLinks) {
      reset({
        facebook: socialLinks.facebook || 'www.facebook.com',
        instagram: socialLinks.instagram || 'www.instagram.com',
        linkedin: socialLinks.linkedin || 'www.linkedin.com',
        twitter: socialLinks.twitter || 'www.twitter.com',
      });
    }
  }, [reset, socialLinks, user]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const accessToken = sessionStorage.getItem('accessToken');
      await axios.patch(`${endpoints.user.update}`, { socialLinks: { ...data } }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      router.push(paths.blog.user.root);
      enqueueSnackbar('Update success!');
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack component={Card} spacing={3} sx={{ p: 3 }}>
        {Object.keys(defaultValues).map((link) => (
          <RHFTextField
            key={link}
            name={link}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify
                    width={24}
                    icon={
                      (link === 'facebook' && 'eva:facebook-fill') ||
                      (link === 'instagram' && 'ant-design:instagram-filled') ||
                      (link === 'linkedin' && 'eva:linkedin-fill') ||
                      (link === 'twitter' && 'eva:twitter-fill') ||
                      ''
                    }
                    color={
                      (link === 'facebook' && '#1877F2') ||
                      (link === 'instagram' && '#DF3E30') ||
                      (link === 'linkedin' && '#006097') ||
                      (link === 'twitter' && '#1C9CEA') ||
                      ''
                    }
                  />
                </InputAdornment>
              ),
            }}
          />
        ))}

        <LoadingButton type="submit" variant="contained" loading={isSubmitting} sx={{ ml: 'auto' }}>
          Save Changes
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}

AccountSocialLinks.propTypes = {
  socialLinks: PropTypes.object,
  user: PropTypes.object,
};
