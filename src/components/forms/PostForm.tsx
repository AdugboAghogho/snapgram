import * as z from "zod";
import { Models } from "appwrite";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Button,
  Input,
  Textarea,
} from "../../components/ui";
import { PostValidation } from "../../lib/validation";
import { useToast } from "../../components/ui/use-toast";
import { useUserContext } from "../../context/AuthContext";
import { FileUploader, Loader } from "../../components/shared";
import { useCreatePost, useUpdatePost } from "../../lib/react-query/queries";

type PostFormProps = {
  post?: Models.Document;
  action: "Create" | "Update";
};

const PostForm = ({ post, action }: PostFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUserContext();
  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: post ? post?.caption : "",
      file: [],
      location: post ? post.location : "",
      tags: post ? post.tags.join(",") : "",
    },
  });

  const { mutateAsync: createPost, isPending: isLoadingCreate } =
    useCreatePost();
  const { mutateAsync: updatePost, isPending: isLoadingUpdate } =
    useUpdatePost();

  const handleSubmit = async (value: z.infer<typeof PostValidation>) => {
    if (post && action === "Update") {
      const updatedPost = await updatePost({
        ...value,
        postId: post.$id,
        imageId: post.imageId,
        imageUrl: post.imageUrl,
      });

      if (!updatedPost) {
        toast({ title: `${action} post failed. Please try again.` });
      }
      return navigate(`/posts/${post.$id}`);
    }

    const newPost = await createPost({
      ...value,
      userId: user.id,
    });

    if (!newPost) {
      toast({ title: `${action} post failed. Please try again.` });
    }
    navigate("/");
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="w-full max-w-2xl mx-auto px-4 py-6 bg-dark-2 rounded-2xl shadow-md flex flex-col gap-6"
      >
        <div className="flex gap-4">
          <img
            src={user.imageUrl || "/assets/avatar.png"}
            alt="User avatar"
            className="w-12 h-12 rounded-full object-cover"
          />
          <FormField
            control={form.control}
            name="caption"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Textarea
                    className="bg-transparent text-lg placeholder:text-gray border-none focus:ring-0 resize-none custom-scrollbar"
                    {...field}
                    placeholder="What’s happening...?"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <FileUploader
                  fieldChange={field.onChange}
                  mediaUrl={post?.imageUrl}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col md:flex-row gap-4">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Location"
                    className="bg-dark-3 rounded-full"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Tags (e.g. tech, art)"
                    className="bg-dark-3 rounded-full"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center justify-between border-t border-dark-4 pt-4">
          {/* You could add icon buttons here for emoji, gif, poll, etc. */}
          <div className="flex gap-3 items-center">
            <img src="/assets/icons/view.png" alt="media" className="w-5 h-5" />
            <img
              src="/assets/icons/people.svg"
              alt="emoji"
              className="w-5 h-5"
            />
          </div>
          <Button
            type="submit"
            className="bg-primary-500 text-white rounded-full px-6 py-2 font-semibold"
            disabled={isLoadingCreate || isLoadingUpdate}
          >
            {(isLoadingCreate || isLoadingUpdate) && <Loader />}
            {action}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
