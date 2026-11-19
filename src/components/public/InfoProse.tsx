import { infoBlocks, type InfoInline } from '@/lib/info-content';

function Inlines({ parts }: { parts: InfoInline[] }) {
  return parts.map((part, index) => {
    if (part.type === 'link') {
      return (
        <a
          key={index}
          href={part.href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-sea underline decoration-mint decoration-2 underline-offset-4"
        >
          <Inlines parts={part.children} />
        </a>
      );
    }
    if (part.type === 'strong') return <strong key={index}>{part.value}</strong>;
    return <span key={index}>{part.value}</span>;
  });
}

export function InfoProse({ content }: { content: string }) {
  const blocks = infoBlocks(content);
  if (blocks.length === 0) return null;

  return (
    <div className="prose">
      {blocks.map((block, index) =>
        block.type === 'heading' ? (
          <h2 key={index}>
            <Inlines parts={block.inlines} />
          </h2>
        ) : (
          <p key={index} className="whitespace-pre-line">
            <Inlines parts={block.inlines} />
          </p>
        ),
      )}
    </div>
  );
}
