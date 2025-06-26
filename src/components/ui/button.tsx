import { MouseEventHandler } from "react";

function Button({
  onClick,
  children,
}: {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="bg-green-600 hover:bg-green-700 h-[40px] text-white  px-2  rounded-md text-sm font-medium"
    >
      {children}
    </button>
  );
}

export default Button;
