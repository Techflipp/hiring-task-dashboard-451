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
      params.set("page", "1");
      if (query === "size" && term > 100) {
        params.set(query, "100");
      } else {
        params.set(query, term);
      }
    } else {
      params.delete(query);
    }
    replace(`${pathname}?${params.toString()}`);
  }, 500);

  return (
    <div className="my-4 flex w-full flex-col items-start gap-4">
      <h2>Search and items per page</h2>
      <div className="flex-center flex w-full flex-col gap-4 md:flex-row">
        <div className="relative w-full flex-2">
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
        <div className="relative w-full flex-1">
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
    </div>
  );
}
