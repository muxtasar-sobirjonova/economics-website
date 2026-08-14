"use client";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="p-8 m-4 bg-red-50 text-red-900 border border-red-200 rounded-2xl">
      <h2 className="text-xl font-bold mb-4">Dashboard Client Error</h2>
      <p className="font-mono text-sm mb-4 break-all">{error.message || "Unknown error"}</p>
      {error.stack && (
        <pre className="text-xs bg-surface p-4 rounded overflow-auto max-h-[300px] mb-4">
          {error.stack}
        </pre>
      )}
      <button onClick={() => reset()} className="px-4 py-2 bg-red-600 text-white rounded font-bold">
        Retry
      </button>
    </div>
  );
}
