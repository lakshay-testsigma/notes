import katex from "katex";

export function Formula({ tex, caption }: { tex: string; caption?: string }) {
  const html = katex.renderToString(tex, { displayMode: true, throwOnError: false });
  return (
    <figure className="my-6 flex flex-col items-center gap-2">
      <div className="max-w-full overflow-x-auto" dangerouslySetInnerHTML={{ __html: html }} />
      {caption && (
        <figcaption className="text-center text-sm text-muted-foreground">{caption}</figcaption>
      )}
    </figure>
  );
}
