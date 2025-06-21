export default function AppSpinner() {
  return (
    <div className="flex justify-center inset-0 absolute items-center p-4">
      <div className="w-6 h-6 border-1 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
