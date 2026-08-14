import React from "react";

export default function MagazineArticle({
  title,
  contentHtml,
  lessonId,
}: {
  title: string;
  contentHtml: string;
  lessonId?: number;
}) {
  return (
    <>
      <header className="mb-s6 md:mb-s7">
        <div className="text-label uppercase text-muted mb-s3">Article</div>
        <h1 className="text-h1-sm md:text-display font-semibold tracking-[-.03em] text-read-text text-balance">
          {title}
        </h1>
        <p className="font-mono text-meta text-faint mt-s4">
          5&ndash;20 min read · Day {lessonId || 1}
        </p>
      </header>

      <div
        className="prose prose-article mx-auto"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </>
  );
}
