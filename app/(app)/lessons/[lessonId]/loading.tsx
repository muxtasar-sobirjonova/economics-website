export default function Loading() {
  return (
    <div className="min-h-screen bg-read-bg p-8 flex flex-col items-center justify-center space-y-4">
      <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      <div className="text-accent font-bold tracking-widest text-sm uppercase animate-pulse">
        Loading Content...
      </div>
    </div>
  );
}
