"use client";
import { ResetIcon } from "@/components/icons/icons";
import Button from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { dateDecoder, dateParser, decodeUri } from "@/lib/utils";
import {
  AgeRange,
  Emotion,
  Ethnicity,
  FilterOptions,
  Gender,
} from "@/types/camera";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const Filters = ({ isDataEmpty }: { isDataEmpty: boolean }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const handleFilterChange = (
    name: keyof FilterOptions,
    value: string | Date
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(
        name,
        value instanceof Date ? value.toISOString() : encodeURIComponent(value)
      );
    } else {
      params.delete(name);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const resetQuery = () => {
    replace(pathname);
  };
  return (
    <>
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex justify-between">
          <h2 className="text-xl font-semibold mb-4">Filters</h2>
          <button
            onClick={resetQuery}
            className="px-3 h-[40px]  rounded hover:bg-gray-100 text-gray-600 hover:text-blue-600 transition-colors"
            aria-label="Edit"
          >
            <ResetIcon />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              value={searchParams.get("gender") || ""}
              onChange={(e) => handleFilterChange("gender", e.target.value)}
            >
              <option value="">All Genders</option>
              {Object.entries(Gender).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Age
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              value={decodeUri(searchParams.get("age") || "")}
              onChange={(e) => handleFilterChange("age", e.target.value)}
            >
              <option value="">All Ages</option>
              {Object.entries(AgeRange).map(([key, value]) => (
                <option key={key} value={value}>
                  {key}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Emotion
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              value={searchParams.get("emotion") || ""}
              onChange={(e) => handleFilterChange("emotion", e.target.value)}
            >
              <option value="">All Emotions</option>
              {Object.entries(Emotion).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ethnicity
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              value={searchParams.get("ethnicity") || ""}
              onChange={(e) => handleFilterChange("ethnicity", e.target.value)}
            >
              <option value="">All Ethnicities</option>
              {Object.entries(Ethnicity).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              className="w-full px-2 py-1.5 border border-gray-300 rounded-md"
              value={dateDecoder(searchParams.get("start_date") || "")}
              onChange={(e) =>
                handleFilterChange("start_date", dateParser(e.target.value))
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              className="w-full px-2 py-1.5 border border-gray-300 rounded-md"
              value={dateDecoder(searchParams.get("end_date") || "")}
              onChange={(e) =>
                handleFilterChange("end_date", dateParser(e.target.value))
              }
            />
          </div>
        </div>
      </div>
      <Modal isOpen={isDataEmpty} onClose={resetQuery} title="" size="sm">
        <div className="flex flex-col gap-4 items-center">
          <h3 className="text-sm lg:text-lg">Items not found</h3>
          <Button onClick={resetQuery}>Reset Filter</Button>
        </div>
      </Modal>
    </>
  );
};

export default Filters;
