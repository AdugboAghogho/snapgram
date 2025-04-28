import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
  UseMutationResult,
} from "@tanstack/react-query";

import { QUERY_KEYS } from "../../lib/react-query/queryKeys";
import {
  createUserAccount,
  signInAccount,
  getCurrentUser,
  signOutAccount,
  getUsers,
  createPost,
  getPostById,
  updatePost,
  getUserPosts,
  deletePost,
  likePost,
  getUserById,
  updateUser,
  getRecentPosts,
  getInfinitePosts,
  searchPosts,
  savePost,
  deleteSavedPost,
  incrementPostViewCount,
} from "../../lib/appwrite/api";
import { INewPost, INewUser, IUpdatePost, IUpdateUser } from "../../types";
import { databases } from "../appwrite/config";
import { Models } from "appwrite";

// ============================================================
// AUTH QUERIES
// ============================================================

export const useCreateUserAccount = () => {
  return useMutation({
    mutationFn: (user: INewUser) => createUserAccount(user),
  });
};

export const useSignInAccount = () => {
  return useMutation({
    mutationFn: (user: { email: string; password: string }) =>
      signInAccount(user),
  });
};

export const useSignOutAccount = () => {
  return useMutation({
    mutationFn: signOutAccount,
  });
};

// ============================================================
// POST QUERIES
// ============================================================

export const useGetPosts = () => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
    queryFn: getInfinitePosts as any,
    getNextPageParam: (lastPage: any) => {
      // If there's no data, there are no more pages.
      if (lastPage && lastPage.documents.length === 0) {
        return null;
      }

      // Use the $id of the last document as the cursor.
      const lastId = lastPage.documents[lastPage.documents.length - 1].$id;
      return lastId;
    },
  });
};

export const useSearchPosts = (searchTerm: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
    queryFn: () => searchPosts(searchTerm),
    enabled: !!searchTerm,
  });
};

export const useGetRecentPosts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
    queryFn: getRecentPosts,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post: INewPost) => createPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });
};

export const useGetPostById = (postId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
    queryFn: () => getPostById(postId),
    enabled: !!postId,
  });
};

export const useGetUserPosts = (userId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_POSTS, userId],
    queryFn: () => getUserPosts(userId),
    enabled: !!userId,
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post: IUpdatePost) => updatePost(post),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
      });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, imageId }: { postId?: string; imageId: string }) =>
      deletePost(postId, imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });
};

export const useLikePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      postId,
      likesArray,
    }: {
      postId: string;
      likesArray: string[];
    }) => likePost(postId, likesArray),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};

export const useSavePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, postId }: { userId: string; postId: string }) =>
      savePost(userId, postId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};

export const useDeleteSavedPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (savedRecordId: string) => deleteSavedPost(savedRecordId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};

// ============================================================
// USER QUERIES
// ============================================================

export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CURRENT_USER],
    queryFn: getCurrentUser,
  });
};

export const useGetUsers = (limit?: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USERS],
    queryFn: () => getUsers(limit),
  });
};

export const useGetUserById = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user: IUpdateUser) => updateUser(user),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?.$id],
      });
    },
  });
};

// In your "../../lib/react-query/queries.ts" file

// import { useMutation, UseMutationResult } from "@tanstack/react-query";
// import { databases } from "../../appwrite/config"; // Assuming your Appwrite client is configured here
// import { Models } from "appwrite"; // Import the Models type

// Define the asynchronous function that makes the API call
const incrementPostViewCount = async (variables: {
  postId: string;
}): Promise<Models.Document> => {
  const { postId } = variables;
  try {
    const response = await databases.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!, // Replace with your database ID
      process.env.NEXT_PUBLIC_APPWRITE_POSTS_COLLECTION_ID!, // Replace with your posts collection ID
      postId,
      {
        $inc: { views: 1 }, // Increment the 'views' field by 1
      }
    );
    return response;
  } catch (error: any) {
    console.error("Error incrementing view count:", error);
    throw error;
  }
};

// The React Query hook that uses the mutation
export const useIncrementView = (): UseMutationResult<
  Models.Document,
  Error,
  { postId: string },
  unknown
> => {
  return useMutation(incrementPostViewCount, {
    onSuccess: (
      data: Models.Document,
      variables: { postId: string },
      context: any
    ) => {
      console.log("View count updated successfully:", data);
      // You might not need to invalidate any queries here as views are often just displayed.
    },
    onError: (error: Error, variables: { postId: string }, context: any) => {
      console.error("Failed to update view count:", error);
      // Optionally handle the error
    },
  });
};

const incrementRepostCount = async (
  postId: string
): Promise<Models.Document> => {
  try {
    const response = await databases.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!, // Replace with your database ID
      process.env.NEXT_PUBLIC_APPWRITE_POSTS_COLLECTION_ID!, // Replace with your posts collection ID
      postId,
      {
        $inc: { reposts: 1 }, // Increment the 'reposts' field by 1
      }
    );
    return response;
  } catch (error: any) {
    console.error("Error incrementing repost count:", error);
    throw error;
  }
};

export const useRepostPost = (): UseMutationResult<
  Models.Document,
  Error,
  string, // The mutate function in PostStats calls it with just the postId
  unknown
> => {
  const queryClient = useQueryClient();
  return useMutation(incrementRepostCount, {
    onSuccess: (data: any, variables: any, context: any) => {
      // Optionally invalidate the post query to refetch updated data
      queryClient.invalidateQueries(["posts"]); // Or a more specific query key for the post
      console.log("Repost count updated successfully:", data);
    },
    onError: (error: any, variables: any, context: any) => {
      console.error("Failed to update repost count:", error);
      // Optionally handle the error (e.g., show a notification)
    },
  });
};
