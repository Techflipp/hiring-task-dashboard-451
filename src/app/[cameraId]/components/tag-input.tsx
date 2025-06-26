"use client";
import { getAllTags } from "@/lib/api";
import { useEffect, useMemo, useState } from "react";

type Tag = {
  id: string;
  name: string;
  color: string;
};

export function TagInput({
  selectedTagIds,
  onTagSelect,
  onTagRemove,
}: {
  selectedTagIds: string[];
  onTagSelect: (tag: Tag) => void;
  onTagRemove: (tagId: string) => void;
}) {
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch tags from API
  useEffect(() => {
    const fetchTags = async () => {
      setIsLoading(true);
      try {
        const data = await getAllTags();
        setAvailableTags(data);
      } catch (error) {
        console.error("Failed to fetch tags:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTags();
  }, []);

  const selectedTags = useMemo(() => {
    if (availableTags.length === 0) return [];
    return availableTags?.filter((tag) => selectedTagIds.includes(tag.id));
  }, [availableTags, selectedTagIds]);
  // Filter tags based on search term
  const filteredTags = availableTags?.filter(
    (tag) =>
      tag.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selectedTagIds.some((selected) => selected === tag.id)
  );

  const handleTagSelect = (tag: Tag) => {
    onTagSelect(tag);
    setSearchTerm("");
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Tags
      </label>

      {/* Search input */}
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search tags..."
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 mb-2"
      />

      {/* Selected tags */}
      <div className="flex flex-wrap gap-2 mb-3">
        {selectedTags?.map((tag) => (
          <div
            key={tag.id}
            className="px-3 py-1 rounded-full flex items-center"
            style={{
              backgroundColor: tag.color,
              color: getContrastColor(tag.color),
            }}
          >
            <span>{tag.name}</span>
            <button
              type="button"
              onClick={() => onTagRemove(tag.id)}
              className="ml-2 hover:text-white"
            >
              &times;
            </button>
          </div>
        ))}
      </div>

      {/* Available tags dropdown */}
      {searchTerm && (
        <div className="border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="p-2 text-center text-gray-500">Loading...</div>
          ) : filteredTags.length > 0 ? (
            filteredTags.map((tag) => (
              <div
                key={tag.id}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                onClick={() => handleTagSelect(tag)}
              >
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: tag.color }}
                />
                {tag.name}
              </div>
            ))
          ) : (
            <div className="p-2 text-center text-gray-500">
              No matching tags found
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Helper function to determine text color based on background
function getContrastColor(hexColor: string) {
  // Convert hex to RGB
  const r = parseInt(hexColor.substr(1, 2), 16);
  const g = parseInt(hexColor.substr(3, 2), 16);
  const b = parseInt(hexColor.substr(5, 2), 16);

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return black or white depending on luminance
  return luminance > 0.5 ? "#000000" : "#FFFFFF";
}
