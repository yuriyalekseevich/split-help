import { legalBlocks, legalInline, type InlinePart } from '@/lib/legal-content';

function Inline({ text }: { text: string }) {
  return legalInline(text).map((part: InlinePart, index) =>
    part.type === 'strong' ? <strong key={index}>{part.value}</strong> : <span key={index}>{part.value}</span>,
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
