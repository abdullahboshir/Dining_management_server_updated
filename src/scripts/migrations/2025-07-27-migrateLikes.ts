import { Post } from "../../app/modules/Post/post.model";



export const name = '2024-07-26-migrate-likes-array';

export const up = async () => {
  const result = await Post.updateMany(
    { likes: { $type: 'number' } },
    { $set: { likes: [] } }
  );
  console.log(`✅ ${name}: Updated ${result.modifiedCount} posts`);
};
