import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { useToast } from "../../components/ui/use-toast";
import { Textarea, Input, Button } from "../../components/ui";
import { ProfileUploader, Loader } from "../../components/shared";

import { ProfileValidation } from "../../lib/validation";
import { useUserContext } from "../../context/AuthContext";
import { useGetUserById, useUpdateUser } from "../../lib/react-query/queries";

const UpdateProfile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, setUser } = useUserContext();
  const form = useForm<z.infer<typeof ProfileValidation>>({
    resolver: zodResolver(ProfileValidation),
    defaultValues: {
      file: [],
      name: user.name,
      username: user.username,
      email: user.email,
      bio: user.bio || "",
    },
  });

  // Queries
  const { data: currentUser } = useGetUserById(id || "");
  const { mutateAsync: updateUser, isPending: isLoadingUpdate } =
    useUpdateUser();

  if (!currentUser)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  // Handler
  const handleUpdate = async (value: z.infer<typeof ProfileValidation>) => {
    const updatedUser = await updateUser({
      userId: currentUser.$id,
      name: value.name,
      bio: value.bio,
      file: value.file,
      imageUrl: currentUser.imageUrl,
      imageId: currentUser.imageId,
    });

    if (!updatedUser) {
      toast({
        title: `Update user failed. Please try again.`,
      });
    }

    setUser({
      ...user,
      name: updatedUser?.name,
      bio: updatedUser?.bio,
      imageUrl: updatedUser?.imageUrl,
    });
    return navigate(`/profile/${id}`);
  };

  return (
    <div className="flex flex-1">
      <div className="common-container custom-scrollbar">
        <div className="flex-start gap-3 justify-start w-full max-w-5xl">
          <img
            src="/assets/icons/edit.svg"
            width={36}
            height={36}
            alt="edit"
            className="invert-white"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Edit Profile</h2>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleUpdate)}
            className="flex flex-col gap-6 w-full max-w-xl mx-auto mt-6 px-4"
          >
            {/* Profile Picture */}
            <div className="flex justify-center">
              <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                  <FormItem>
                    <FormControl className="w-28 h-28 rounded-full border border-gray-700 object-cover">
                      <ProfileUploader
                        fieldChange={field.onChange}
                        mediaUrl={currentUser.imageUrl}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-400">Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="bg-transparent border-b border-gray-600 focus:outline-none focus:ring-0 rounded-full text-white"
                      placeholder="Your name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Username (disabled) */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-400">
                    Username
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      disabled
                      className="bg-transparent border-b border-gray-600 text-gray-400 rounded-full"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Email (disabled) */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-400">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      disabled
                      className="bg-transparent border-b border-gray-600 text-gray-400 rounded-full"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Bio */}
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-400">Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What's something interesting about you?"
                      className="bg-transparent border border-gray-600 rounded-[1rem] p-3 text-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <Button
                type="button"
                className="bg-gray-700 hover:bg-gray-600 text-white rounded-full px-5 py-2"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-primary-500 hover:bg-blue-600 text-white rounded-full px-5 py-2"
                disabled={isLoadingUpdate}
              >
                {isLoadingUpdate && <Loader />}
                Update
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default UpdateProfile;
