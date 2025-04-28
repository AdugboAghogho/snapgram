import { Models } from "appwrite";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { checkIsLiked } from "../../lib/utils";
import {
  useLikePost,
  useSavePost,
  useDeleteSavedPost,
  useGetCurrentUser,
  useRepostPost, // Assuming you'll create this hook
  useIncrementView, // Assuming you'll create this hook
} from "../../lib/react-query/queries";
import Loader from "./Loader";

type PostStatsProps = {
  post: Models.Document;
  userId: string;
};

const PostStats = ({ post, userId }: PostStatsProps) => {
  const location = useLocation();
  const likesList = post.likes.map((user: Models.Document) => user.$id);

  const [likes, setLikes] = useState<string[]>(likesList);
  const [isSaved, setIsSaved] = useState(false);
  const [reposts, setReposts] = useState<number>(post.reposts || 0); // Initialize with existing repost count
  const [views, setViews] = useState<number>(post.views || 0); // Initialize with existing view count

  const { mutate: likePost } = useLikePost();
  const { mutate: savePost, isPending: isSavingPost } = useSavePost();
  const { mutate: deleteSavePost, isPending: isDeletingSaved } =
    useDeleteSavedPost();
  const { mutate: repostPost, isPending: isReposting } = useRepostPost(); // Assuming this hook handles the API call
  const { mutate: incrementView } = useIncrementView(); // Assuming this hook handles incrementing views

  const { data: currentUser } = useGetCurrentUser();

  const savedPostRecord = currentUser?.save.find(
    (record: Models.Document) => record.post.$id === post.$id
  );

  useEffect(() => {
    setIsSaved(!!savedPostRecord);
  }, [currentUser]);

  // Increment view count when the component mounts (you might want more sophisticated logic)
  useEffect(() => {
    incrementView.mutate({ postId: post.$id });
    setViews((prevViews) => prevViews + 1);
  }, [incrementView, post.$id]);

  const handleLikePost = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation();

    let likesArray = [...likes];

    if (likesArray.includes(userId)) {
      likesArray = likesArray.filter((Id) => Id !== userId);
    } else {
      likesArray.push(userId);
    }

    setLikes(likesArray);
    likePost({ postId: post.$id, likesArray });
  };

  const handleSavePost = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation();

    if (savedPostRecord) {
      setIsSaved(false);
      return deleteSavePost(savedPostRecord.$id);
    }

    savePost({ userId: userId, postId: post.$id });
    setIsSaved(true);
  };

  const handleRepostPost = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation();
    repostPost(post.$id); // Assuming your hook takes postId as argument
    setReposts((prevReposts) => prevReposts + 1); // Optimistically update the local state
  };

  const handleSharePost = async (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation();

    const shareData = {
      title: "Check out this post!", // You can customize this
      text: "Interesting content shared via my app.", // You can customize this
      url: window.location.href, // Or a specific URL for the post if you have one
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        console.log("Post shared successfully");
        // Optionally, you can show a success message to the user
      } catch (error) {
        console.error("Error sharing post:", error);
        // Optionally, you can show an error message to the user
      }
    } else {
      alert(
        "Web Share API is not supported on this browser. You can manually copy the link."
      );
    }
  };

  const containerStyles = location.pathname.startsWith("/profile")
    ? "w-full"
    : "";

  return (
    <div
      className={`flex justify-between items-center z-20 ${containerStyles}`}
    >
      <div className="flex gap-2 mr-5">
        <img
          src={`${
            checkIsLiked(likes, userId)
              ? "/assets/icons/liked.svg"
              : "/assets/icons/like.svg"
          }`}
          alt="like"
          width={20}
          height={20}
          onClick={(e) => handleLikePost(e)}
          className="cursor-pointer"
        />
        <p className="small-medium lg:base-medium">{likes.length}</p>
      </div>

      <div className="flex gap-2">
        {isSavingPost || isDeletingSaved ? (
          <Loader />
        ) : (
          <img
            src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
            alt="save"
            width={20}
            height={20}
            className="cursor-pointer"
            onClick={(e) => handleSavePost(e)}
          />
        )}
        {/* Repost Icon and Count */}
        <img
          src="/assets/icons/repost.svg" // Replace with your repost icon path
          alt="repost"
          width={20}
          height={20}
          className="cursor-pointer"
          onClick={handleRepostPost}
          disabled={isReposting} // Disable while reposting
        />
        <p className="small-medium lg:base-medium">{reposts}</p>
        {/* Share Icon */}
        <img
          src="/assets/icons/share.svg" // Replace with your share icon path
          alt="share"
          width={20}
          height={20}
          className="cursor-pointer"
          onClick={handleSharePost}
        />
        {/* View Count */}
        <img
          src="/assets/icons/view.svg" // Replace with your view icon path
          alt="views"
          width={20}
          height={20}
          className="ml-2"
        />
        <p className="small-medium lg:base-medium">{views}</p>
      </div>
    </div>
  );
};

export default PostStats;
