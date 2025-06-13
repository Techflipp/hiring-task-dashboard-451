"use client";

import { ReactNode } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";

import { DialogTitle } from "@radix-ui/react-dialog";
import CameraForm from "./camera/CameraForm";
import DemoGraphicsForm from "./camera/DemoGraphicsForm";

// main modal for forms
export default function Details({
  children,
  camId,
  form,
}: {
  children: ReactNode;
  camId: string;
  form: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[50vh] w-full min-w-[50vw] overflow-y-auto p-8 sm:max-h-[85vh]">
        <DialogHeader className="text-2xl">
          <DialogTitle className="text-2xl capitalize">
            {form} Settings
          </DialogTitle>
        </DialogHeader>

        {form === "camera" ? (
          <CameraForm id={camId} />
        ) : (
          <DemoGraphicsForm id={camId} />
        )}
      </DialogContent>
    </Dialog>
  );
}
