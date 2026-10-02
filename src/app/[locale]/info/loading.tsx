export default function InfoLoading() {
  return (
    <main id="content" className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14" aria-busy="true">
      <div className="h-4 w-40 animate-pulse rounded bg-line" />
      <div className="mt-6 h-3 w-32 animate-pulse rounded bg-line" />
      <div className="mt-3 h-10 w-2/3 max-w-md animate-pulse rounded bg-line" />
      <div className="mt-4 h-6 w-full max-w-xl animate-pulse rounded bg-line" />
      <ul className="mt-8 grid gap-5 sm:grid-cols-2">
        {[0, 1].map((key) => (
          <li key={key} className="h-64 animate-pulse rounded-3xl border border-line bg-paper" />
        ))}
      </ul>
    </main>
  );
}
