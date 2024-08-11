// sections
import { PostListView } from 'src/sections/blog/view';


export const metadata = {
  title: 'Dashboard: My Post List',
};

export default function PostListPage() {
  return <PostListView myPosts />;
}
