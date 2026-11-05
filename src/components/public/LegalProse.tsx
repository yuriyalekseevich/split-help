import { legalBlocks, legalInline, type InlinePart } from '@/lib/legal-content';

const EMAIL = /([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/gi;

function LinkedText({ text }: { text: string }) {
  return text
    .split(EMAIL)
    .filter((part) => part.length > 0)
    .map((part, index) =>
      part.includes('@') ? (
        <a
          key={index}
          href={`mailto:${part}`}
          className="underline decoration-mint decoration-2 underline-offset-4"
        >
          {part}
        </a>
      ) : (
        <span key={index}>{part}</span>
      ),
    );
}

function Inline({ text }: { text: string }) {
  return legalInline(text).map((part: InlinePart, index) =>
    part.type === 'strong' ? (
      <strong key={index}>
        <LinkedText text={part.value} />
      </strong>
    ) : (
      <LinkedText key={index} text={part.value} />
    ),
  );
}

export function LegalProse({ content }: { content: string }) {
  const blocks = legalBlocks(content);

  return (
    <div className="prose">
      {blocks.map((block, index) => {
        if (block.type === 'heading') {
          return <h2 key={index}>{block.text}</h2>;
        }
        if (block.type === 'list') {
          return (
            <ul key={index}>
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>
                  <Inline text={item} />
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={index} className="whitespace-pre-line">
            <Inline text={block.text} />
          </p>
        );
      })}
    </div>
  );
}
