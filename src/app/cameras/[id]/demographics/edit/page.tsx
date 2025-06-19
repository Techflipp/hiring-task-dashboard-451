 



import DemographicsCreateClient from "@/components/DemographicsCreateClient";

export default function CreateDemographicsPage( ) {
  // we can use the camera data to get the demographics_config to update moode .. 
  // const camera = await getCameraData(params.id);
  // but i don't need to use it here
  return (
    <div className="max-w-3xl mx-auto p-6">
      <DemographicsCreateClient moode="edit"  />
    </div>
  );
}
