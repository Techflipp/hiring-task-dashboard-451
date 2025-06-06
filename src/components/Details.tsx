"use client";

import { ReactNode } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Camera, ChartLineIcon } from "lucide-react";
import CameraDetails from "./CameraDetails";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";

export default function Details({
  children,
  camId,
}: {
  children: ReactNode;
  camId: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-full sm:max-w-[90vw] h-[90vh] p-8 overflow-y-auto">
        <DialogHeader className="hidden">
          <DialogTitle>Camera Settings</DialogTitle>
          <DialogDescription>Camera Settings</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="camera" className="w-full h-full">
          <TabsList className="w-full">
            <TabsTrigger value="camera">
              <Camera />
              Camera Details
            </TabsTrigger>
            <TabsTrigger value="demographics">
              <ChartLineIcon />
              Demographics
            </TabsTrigger>
          </TabsList>
          <TabsContent value="camera" className="p-4 h-full">
            <CameraDetails camId={camId} />
          </TabsContent>
          <TabsContent value="demographics">
            Change your password here.
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
