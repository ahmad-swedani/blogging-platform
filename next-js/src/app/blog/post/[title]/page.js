import PropTypes from 'prop-types';
// utils
import { paramCase } from 'src/utils/change-case';
import axios, { endpoints } from 'src/utils/axios';
// sections
import { PostDetailsView } from 'src/sections/blog/view';


export const metadata = {
  title: 'Dashboard: Post Details',
};

export default function PostDetailsPage({ params }) {
  const { title } = params;

  return <PostDetailsView title={title} />;
}

export async function generateStaticParams() {
  const res = await axios.get(endpoints.post.list);

  return res.data.data.posts.map((post) => ({
    title: paramCase(post.title),
  }));
}

PostDetailsPage.propTypes = {
  params: PropTypes.shape({
    title: PropTypes.string,
  }),
};
