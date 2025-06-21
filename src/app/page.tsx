import Link from "next/link";

export default function Home() {
  return (
    <div className=" flex flex-col h-[500px] justify-center items-center">
      <div>
        <Link href={`/cameras`} className="cursor-pointer underline">
          Go to cameras
        </Link>
      </div>
      <p className="mt-2 text-sm text-gray-600">You'll be redirected to the list of cameras.</p>
    </div>
  );
}
