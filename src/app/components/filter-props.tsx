"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import SearchInput from "@/components/ui/searchInput";
import { Suspense } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function FilterProps() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { replace } = useRouter();

  // add user input value to url qury params
  const handleChange = (term: string, key: "size" | "search") => {
    const params = new URLSearchParams(searchParams.toString());
    if (term) {
      params.set(key, encodeURIComponent(term));
      if (key === "size") {
        params.set("page", "1");
      }
    } else {
      params.delete(key);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  // add debouncer for search input
  const searchDebounce = useDebouncedCallback(
    (term, param) => handleChange(term, param),
    500
  );
  const searchValue = searchParams.get("search")?.toString() ?? "";
  const sizeValue = searchParams.get("size")?.toString() ?? "5";
  return (
    <Suspense fallback={<div></div>}>
      <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
        <SearchInput
          defaultValue={searchValue}
          onChange={(e) =>
            searchDebounce((e.target as HTMLInputElement).value, "search")
          }
        />

        <select
          className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          defaultValue={sizeValue}
          onChange={(e) => handleChange(e.target.value, "size")}
        >
          <option value="5">5 per page</option>
          <option value="10">10 per page</option>
          <option value="20">20 per page</option>
          <option value="50">50 per page</option>
        </select>
      </div>
    </Suspense>
  );
}
