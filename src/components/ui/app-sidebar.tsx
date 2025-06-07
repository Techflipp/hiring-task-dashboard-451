"use client";
import { Search, RotateCcw, Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function AppSidebar({}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pageSize, setPageSize] = useState(searchParams.get("size") || "");
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("search", searchTerm.toString());
    router.push(`?${params.toString()}`);
  };

  const handleSearchReset = () => {
    const params = new URLSearchParams(searchParams.toString());
    setSearchTerm("");
    params.set("search", "");
    router.push(`?${params.toString()}`);
  };

  const handleSize = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("size", pageSize.toString());
    router.push(`?${params.toString()}`);
  };

  const handleSizeReset = () => {
    const params = new URLSearchParams(searchParams.toString());
    setPageSize("20");
    params.set("size", "20");
    router.push(`?${params.toString()}`);
  };

  return (
    <Sidebar>
      <SidebarContent className="py-10 ">
        <SidebarGroup>
          <SidebarGroupLabel className="text-2xl font-bold mb-10">
            Dashboard
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-5 p-4">
              <SidebarMenuItem>
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="w-full flex flex-col lg:flex-row gap-2 mt-4">
                  <Button className="flex-5" onClick={handleSearch}>
                    <Search />
                    Search
                  </Button>
                  <Button className="flex-1" onClick={handleSearchReset}>
                    <RotateCcw />
                  </Button>
                </div>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Input
                  type="text"
                  placeholder="Items size"
                  value={pageSize}
                  onChange={(e) => setPageSize(e.target.value)}
                />
                <div className="w-full flex flex-col md:flex-row gap-2 mt-4 ">
                  <Button className="flex-5" onClick={handleSize}>
                    <Pencil />
                    Apply
                  </Button>
                  <Button className="flex-1" onClick={handleSizeReset}>
                    <RotateCcw />
                  </Button>
                </div>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
