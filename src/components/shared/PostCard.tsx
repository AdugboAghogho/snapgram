import { Models } from "appwrite";
import { Link } from "react-router-dom";

import { PostStats } from "../../components/shared";
import { multiFormatDateString } from "../../lib/utils";
import { useUserContext } from "../../context/AuthContext";

type PostCardProps = {
  post: Models.Document;
};

const PostCard = ({ post }: PostCardProps) => {
  const { user } = useUserContext();

  if (!post.creator) return;
  return (
    <div className="post-card">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.creator.$id}`}>
            <img
              src={
                post.creator?.imageUrl ||
                "/assets/icons/profile-placeholder.svg"
              }
              alt="creator"
              className="w-12 lg:h-12 rounded-full"
            />
          </Link>

          <div className="flex flex-col">
            <p className="base-medium lg:body-bold text-[#FFFFFF]">
              {post.creator.name}
            </p>
            <div className="flex-center gap-2 text-[#7878A3]">
              <p className="subtle-semibold lg:small-regular ">
                {multiFormatDateString(post.$createdAt)}
              </p>
              •
              <p className="subtle-semibold lg:small-regular">
                {post.location}
              </p>
            </div>
          </div>
        </div>

        <Link
          to={`/update-post/${post.$id}`}
          className={`${user.id !== post.creator.$id && "hidden"}`}
        >
          <img
            src={"/assets/icons/edit.svg"}
            alt="edit"
            width={20}
            height={20}
          />
        </Link>
      </div>

      <Link to={`/posts/${post.$id}`}>
        <div className="small-medium lg:base-medium py-5">
          <p>{post.caption}</p>
          <ul className="flex gap-1 mt-2">
            {post.tags.map((tag: string, index: string) => (
              <li
                key={`${tag}${index}`}
                className="text-[#7878A3] small-regular"
              >
                #{tag}
              </li>
            ))}
          </ul>
        </div>

        {post.videoUrl ? (
          <video controls className="post-card_img object-cover">
            <source src={post.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : post.imageUrl ? (
          <img
            src={post.imageUrl}
            alt="post media"
            className="post-card_img object-cover"
          />
        ) : (
          <img
            src="/assets/icons/profile-placeholder.svg"
            alt="placeholder"
            className="post-card_img object-cover"
          />
        )}
      </Link>

      <PostStats post={post} userId={user.id} />
    </div>
  );
};

export default PostCard;
