"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-rice px-6 text-center">
      <h2 className="text-xl font-bold text-ink">Algo salió mal</h2>
      <p className="mt-2 text-sm text-ink/50">{error.message}</p>
      <button
        onClick={() => reset()}
        className="mt-6 rounded-xl bg-jade-500 px-6 py-3 text-sm font-semibold text-white"
      >
        Intentar de nuevo
      </button>
    </div>
  );
}
