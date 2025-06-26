import { ChangeEventHandler, HTMLAttributes } from "react";
type Props = HTMLAttributes<HTMLInputElement> & {
  defaultValue?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
};
function SearchInput({ defaultValue, onChange }: Props) {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search cameras..."
        className="pl-10 pr-4 py-2 border rounded-lg w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
        defaultValue={defaultValue}
        onChange={onChange}
      />
      <svg
        className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
  );
}

export default SearchInput;
