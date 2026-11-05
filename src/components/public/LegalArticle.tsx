import { notFound } from 'next/navigation';
import { LegalProse } from '@/components/public/LegalProse';
import { emails } from '@/content/site';
import { withLegalContact } from '@/lib/legal-content';
import type { LegalPage } from '@/lib/types/database';
import type { Result } from '@/lib/types/result';

export function LegalArticle({
  result,
  loadError,
}: {
  result: Result<LegalPage | null>;
  loadError: string;
}) {
  if (!result.success) {
    return (
      <main id="content" className="mx-auto max-w-3xl px-5 py-8 sm:px-8 sm:py-12">
        <p className="rounded-3xl border border-line bg-paper px-5 py-8 text-muted">{loadError}</p>
      </main>
    );
  }

  if (!result.data) notFound();

  return (
    <main id="content" className="mx-auto max-w-3xl px-5 py-8 sm:px-8 sm:py-12">
      <h1 className="font-serif text-4xl leading-tight break-words text-ink sm:text-5xl">{result.data.title}</h1>
      <LegalProse content={withLegalContact(result.data.content, emails.billing)} />
    </main>
  );
}
