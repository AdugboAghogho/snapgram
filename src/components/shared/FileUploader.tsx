import { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { Button } from "../../components/ui";
import { convertFileToUrl } from "../../lib/utils";

type FileUploaderProps = {
  fieldChange: (files: File[]) => void;
};

const FileUploader = ({ fieldChange }: FileUploaderProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [fileUrls, setFileUrls] = useState<string[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      setFiles(acceptedFiles);
      fieldChange(acceptedFiles);

      const urls = acceptedFiles.map((file) => convertFileToUrl(file));
      setFileUrls(urls);
    },
    [fieldChange]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpeg", ".jpg"],
      "video/*": [".mp4", ".mov", ".avi", ".mkv"],
    },
    maxFiles: 10,
  });

  return (
    <div
      {...getRootProps()}
      className="flex flex-center flex-col bg-[#101012] rounded-xl cursor-pointer"
    >
      <input {...getInputProps()} className="cursor-pointer" multiple />
      {fileUrls.length > 0 ? (
        <>
          <div className="flex flex-wrap gap-4 justify-center w-full p-5 lg:p-10">
            {files.map((file, index) =>
              file.type.startsWith("image/") ? (
                <img
                  key={index}
                  src={fileUrls[index]}
                  alt={`media-${index}`}
                  className="file_uploader-img max-w-[150px] max-h-[150px] object-cover"
                />
              ) : file.type.startsWith("video/") ? (
                <video
                  key={index}
                  src={fileUrls[index]}
                  controls
                  className="file_uploader-img max-w-[150px] max-h-[150px] object-cover"
                />
              ) : (
                <p key={index} className="text-white">
                  Unsupported file type
                </p>
              )
            )}
          </div>
          <p className="file_uploader-label">Click or drag to replace files</p>
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
            Select from file
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
