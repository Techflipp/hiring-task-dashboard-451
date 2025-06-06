import Image from "next/image";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useState } from "react";
import { CloudAlert } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Details from "./Details";
import { Camera } from "@/constants/apitypes";

export default function CameraCard({
  id,
  snapshot,
  name,
  tags,
  is_active,
  status_message,
}: Camera) {
  const [imgError, setImgError] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      key={id}
      className="flex flex-col relative text-white p-4 w-full  bg-slate-900 gap-4  shadow hover:shadow-lg rounded-2xl transition-shadow border-1"
    >
      <div className="h-[300px] w-full  relative">
        {!imgError ? (
          <Image
            fill={true}
            src={snapshot}
            alt={name}
            className="w-full object-cover rounded-xl"
            onError={() => setImgError(true)}
            priority
          />
        ) : (
          <div className="w-full flex-col gap-2 z-20 rounded-xl bg-slate-500 h-full flex-center">
            <CloudAlert size={40} />
            NO IMAGE
          </div>
        )}
      </div>
      <h2 className="text-2xl font-bold x ">{name}</h2>
      <div className="flex-col flex gap-1">
        <div
          className={cn(
            "flex items-center  gap-2  font-semibold text-xl",
            is_active ? "text-green-500 " : "text-red-500"
          )}
        >
          <div
            className={cn(
              "rounded-full size-2",
              is_active
                ? "bg-green-500 shadow-[0px_0px_10px_3px_rgba(11,241,176,0.9)]"
                : "bg-red-500 shadow-[0px_0px_10px_3px_rgba(184,80,20,0.9)]"
            )}
          />
          {is_active ? "Active" : "Inactive"}
        </div>
        <p className="text-gray-300">
          {status_message || "No description available"}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag: { id: string; name: string; color: string }) => (
          <Badge key={tag.id} style={{ backgroundColor: tag.color }}>
            {tag.name}
          </Badge>
        ))}
      </div>
      <div className="flex  gap-2 w-full mt-auto ">
        <Details camId={id}>
          <Button className="flex-1">View Details</Button>
        </Details>
        <Button className="flex-1 bg-cyan-500 hover:bg-cyan-600">
          Live Preview
        </Button>
      </div>
    </motion.div>
  );
}
