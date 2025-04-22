import { useCallback, useEffect, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";

import { Button } from "../../components/ui";
import { convertFileToUrl } from "../../lib/utils";

type FileUploaderProps = {
  fieldChange: (files: File[]) => void;
  mediaUrl: string[]; // Initial media URLs (optional)
};

const FileUploader = ({ fieldChange, mediaUrl = [] }: FileUploaderProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [fileUrls, setFileUrls] = useState<string[]>(mediaUrl);
  const [isDragActive, setIsDragActive] = useState(false);

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      fileUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [fileUrls]);

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      setFiles((prevFiles) => {
        const updatedFiles = [...prevFiles, ...acceptedFiles];
        fieldChange(updatedFiles);
        setFileUrls((prevUrls) => [
          ...prevUrls,
          ...acceptedFiles.map((file) => convertFileToUrl(file)),
        ]);
        return updatedFiles;
      });
    },
    [fieldChange]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpeg", ".jpg"],
      "video/*": [".mp4", ".mov", ".avi", ".mkv"],
    },
    multiple: true,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  });

  const handleRemoveFile = (indexToRemove: number) => {
    URL.revokeObjectURL(fileUrls[indexToRemove]);
    const newFiles = files.filter((_, index) => index !== indexToRemove);
    const newUrls = fileUrls.filter((_, index) => index !== indexToRemove);
    setFiles(newFiles);
    setFileUrls(newUrls);
    fieldChange(newFiles);
  };

  return (
    <div
      {...getRootProps()}
      className={`flex flex-col bg-[#101012] rounded-xl cursor-pointer p-4 border-2 transition-all ${
        isDragActive ? "border-blue-500" : "border-transparent"
      }`}
      tabIndex={0}
      role="button"
      aria-label="Upload files"
    >
      <input {...getInputProps()} className="cursor-pointer" multiple />

      {files.length > 0 ? (
        <div className="p-4 flex flex-wrap gap-4">
          {files.map((file, index) => (
            <div
              key={index}
              className="relative w-32 h-32 rounded-md overflow-hidden group"
            >
              {file.type.startsWith("image/") ? (
                <img
                  src={fileUrls[index]}
                  alt={`media-${index}`}
                  className="object-cover w-full h-full"
                />
              ) : file.type.startsWith("video/") ? (
                <video
                  src={fileUrls[index]}
                  controls
                  className="object-cover w-full h-full"
                />
              ) : (
                <p className="text-white text-xs flex items-center justify-center h-full">
                  Unsupported
                </p>
              )}
              <button
                type="button"
                onClick={() => handleRemoveFile(index)}
                className="absolute top-1 right-1 bg-gray-800 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="file_uploader-box text-center py-10">
          <img
            src="/assets/icons/file-upload.svg"
            width={96}
            height={77}
            alt="file upload"
            className="mx-auto"
          />
          <h3 className="base-medium text-[#EFEFEF] mt-6 mb-2">
            Drag photos or videos here
          </h3>
          <p className="text-[#5C5C7B] small-regular mb-6">
            SVG, PNG, JPG, MP4, MOV, AVI, MKV
          </p>
          <Button type="button" className="shad-button_dark_4">
            Select from computer
          </Button>
        </div>
      )}

      {files.length > 0 && (
        <p className="text-center text-sm text-white mt-2">
          Click or drag to add more
        </p>
      )}
    </div>
  );
};

export default FileUploader;
