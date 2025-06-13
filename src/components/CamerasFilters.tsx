"use client";
import { LucideCamera, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function CamerasFilters() {
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // using debounced to reduce the load on the api
  const handleInput = useDebouncedCallback((term, query) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      if (query === "size" && term > 100) {
        params.set(query, "");
      } else {
        params.set(query, term);
      }
    } else {
      params.delete(query);
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="flex-center mx-auto my-4 flex min-h-30 w-full max-w-2xl flex-col gap-4 md:flex-row">
      <div className="relative w-full">
        <Search className="absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-gray-500" />
        <Input
          type="text"
          placeholder="Search..."
          id="searchInput"
          className="w-full bg-white"
          onChange={(e) => handleInput(e.target.value, "search")}
          defaultValue={searchParams.get("search")?.toString()}
        />
      </div>
      <div className="relative w-full max-w-full lg:max-w-[15rem]">
        <LucideCamera className="absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-gray-500" />
        <Input
          type="text"
          placeholder="Size..."
          id="sizeInput"
          className="w-full bg-white"
          defaultValue={searchParams.get("size")?.toString()}
          onChange={(e) => handleInput(e.target.value, "size")}
        />
      </div>
    </div>
  );
}
