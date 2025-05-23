import { Models } from "appwrite";

import { Loader, PostCard, UserCard } from "../../components/shared";
import { useGetRecentPosts, useGetUsers } from "../../lib/react-query/queries";

const Home = () => {
  const {
    data: posts,
    isPending: isPostLoading,
    isError: isErrorPosts,
  } = useGetRecentPosts();
  const {
    data: creators,
    isLoading: isUserLoading,
    isError: isErrorCreators,
  } = useGetUsers(10);

  if (isErrorPosts || isErrorCreators) {
    return (
      <div className="flex flex-1">
        <div className="home-container custom-scrollbar">
          <p className="body-medium text-[#FFFFFF]">Something bad happened</p>
        </div>
        <div className="home-creators  custom-scrollbar">
          <p className="body-medium text-[#FFFFFF]">Something bad happened</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1">
      <div className="home-container custom-scrollbar">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
          {isPostLoading && !posts ? (
            <Loader />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full ">
              {posts?.documents.map((post: Models.Document) => (
                <>
                  <li key={post.$id} className="flex justify-center w-full">
                    <PostCard post={post} />
                  </li>
                  <div className="ml-[-7rem] ">
                    <hr className="border w-[103%] border-dark-4/80" />
                  </div>
                </>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="home-creators">
        <h3 className="h3-bold text-[#FFFFFF]">Top Creators</h3>
        {isUserLoading && !creators ? (
          <Loader />
        ) : (
          <ul className="grid 2xl:grid-cols-2 gap-6">
            {creators?.documents.map((creator) => (
              <li key={creator?.$id}>
                <UserCard user={creator} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Home;
