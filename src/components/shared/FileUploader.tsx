import { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";

import { Button } from "../../components/ui";
import { convertFileToUrl } from "../../lib/utils";

type FileUploaderProps = {
  fieldChange: (files: File[]) => void;
  mediaUrl: string;
};

const FileUploader = ({ fieldChange, mediaUrl }: FileUploaderProps) => {
  const [file, setFile] = useState<File[]>([]);
  const [fileUrl, setFileUrl] = useState<string>(mediaUrl);

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      setFile(acceptedFiles);
      fieldChange(acceptedFiles);
      setFileUrl(convertFileToUrl(acceptedFiles[0]));
    },
    [file, fieldChange] // Added fieldChange to the dependency array
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpeg", ".jpg"],
      "video/*": [".mp4", ".mov", ".avi", ".mkv"], // Added video file types
    },
    maxFiles: 1, // You might want to adjust this if you allow multiple files
  });

  return (
    <div
      {...getRootProps()}
      className="flex flex-center flex-col bg-[#101012] rounded-xl cursor-pointer"
    >
      <input {...getInputProps()} className="cursor-pointer" />

      {fileUrl ? (
        <>
          <div className="flex flex-1 justify-center w-full p-5 lg:p-10">
            {file[0]?.type.startsWith("image/") ? (
              <img src={fileUrl} alt="media" className="file_uploader-img" />
            ) : file[0]?.type.startsWith("video/") ? (
              <video src={fileUrl} controls className="file_uploader-img" />
            ) : (
              <p className="text-white">Unsupported file type</p>
            )}
          </div>
          <p className="file_uploader-label">Click or drag to replace</p>
        </>
      ) : (
        <div className="file_uploader-box ">
          <img
            src="/assets/icons/file-upload.svg"
            width={96}
            height={77}
            alt="file upload"
          />

          <h3 className="base-medium text-[#EFEFEF] mb-2 mt-6">
            Drag photo or video here
          </h3>
          <p className="text-[#5C5C7B] small-regular mb-6">
            SVG, PNG, JPG, MP4, MOV, AVI, MKV
          </p>

          <Button type="button" className="shad-button_dark_4">
            Select from computer
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
