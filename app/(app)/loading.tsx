export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] w-full px-4">
      <div className="w-12 h-12 border-4 border-slate-200 border-t-brand-primary rounded-full animate-spin mb-4"></div>
      <p className="text-slate-500 font-medium animate-pulse">Loading dashboard...</p>
    </div>
  );
}
