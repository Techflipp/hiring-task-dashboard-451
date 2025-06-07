import CamerasList from "@/components/CamerasList";

export default function Home() {
  return (
    <div className="min-h-svh w-full mainPx">
      <div className="max-container w-full">
        <h1 className="text-4xl font-bold text-center mt-10">
          Cameras Overview
        </h1>
        <CamerasList />
      </div>
    </div>
  );
}
