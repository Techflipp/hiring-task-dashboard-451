"use server";

//revalidate home page after mutation to make sure the data is always up to date
//and integrate the server functionality to react query

import { updateCameraRequest } from "@/constants/apitypes";
import { updateCamera } from "@/services";
import { revalidatePath } from "next/cache";

export async function updateCameraAction(
  id: string,
  data: updateCameraRequest,
) {
  const res = await updateCamera(id, data);
  revalidatePath("/");
  return res;
}
