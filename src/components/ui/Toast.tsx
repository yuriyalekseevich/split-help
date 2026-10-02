export function Toast({ message }: { message: string | null }) {
  if (!message) return null;

  return (
    <div
      role="status"
      className="fixed bottom-24 left-1/2 z-50 w-[min(100%-2rem,24rem)] -translate-x-1/2 rounded-2xl bg-ink px-4 py-3 text-center text-sm leading-5 text-paper shadow-lg md:bottom-6"
    >
      {message}
    </div>
  );
}
