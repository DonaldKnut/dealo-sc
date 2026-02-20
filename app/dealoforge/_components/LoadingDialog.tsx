import React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"; // Import VisuallyHidden for accessibility
import Image from "next/image";

interface LoadingDialogProps {
  loading: boolean;
}

const LoadingDialog: React.FC<LoadingDialogProps> = ({ loading }) => {
  return (
    <AlertDialog open={loading}>
      <AlertDialogContent className="bg-[#F4F4F4]">
        <AlertDialogHeader>
          {/* Add the required AlertDialogTitle */}
          <VisuallyHidden>
            <AlertDialogTitle>Loading</AlertDialogTitle>
          </VisuallyHidden>
          <AlertDialogDescription>
            <div className="flex flex-col items-center py-10">
              <Image
                src="/Loader.gif"
                alt="loading image"
                width="300"
                height="150"
                unoptimized
              />
              <h4>Please wait...Forge is working on course</h4>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LoadingDialog;
