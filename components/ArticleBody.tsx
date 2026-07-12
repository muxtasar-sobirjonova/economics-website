import Image from "next/image";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import React from "react";

interface ArticleBodyProps {
  body: PortableTextBlock[];
  twoColumns?: boolean;
  magazineStyle?: boolean;
}

export default function ArticleBody({
  body,
  twoColumns,
  magazineStyle,
}: ArticleBodyProps) {
  if (!body || body.length === 0) return null;

  const baseComponents: PortableTextComponents = {
    block: {
      h1: ({ children }) => (
        <h1 className="text-3xl font-bold mt-10 mb-4 text-[#0096a5]">
          {children}
        </h1>
      ),
      h2: ({ children }) => (
        <h2 className="text-2xl font-bold mt-8 mb-4 text-[#0096a5]">
          {children}
        </h2>
      ),
      h3: ({ children }) => (
        <h3 className="text-xl font-bold mt-6 mb-3 text-[#0096a5]">
          {children}
        </h3>
      ),
      normal: ({ children }) => (
        <p className="mb-6 text-gray-700 leading-relaxed">{children}</p>
      ),
      blockquote: ({ children }) => (
        <blockquote className="border-l-4 border-[#0096a5] pl-4 italic my-6 text-gray-600 bg-gray-50 py-2 pr-4 rounded-r-lg">
          {children}
        </blockquote>
      ),
    },
    list: {
      bullet: ({ children }) => (
        <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
          {children}
        </ul>
      ),
      number: ({ children }) => (
        <ol className="list-decimal pl-6 mb-6 space-y-2 text-gray-700">
          {children}
        </ol>
      ),
    },
    marks: {
      strong: ({ children }) => (
        <strong className="font-bold text-[#0096a5]">{children}</strong>
      ),
      em: ({ children }) => <em className="italic">{children}</em>,
      link: ({ children, value }) => {
        const href = (value as { href?: string })?.href;
        return (
          <a
            href={href}
          target="_blank"
          rel="noreferrer noopener"
            className="text-[#4ebdd5] hover:text-[#4ebdd5] underline underline-offset-2 decoration-[#A898D4] hover:decoration-[#0096a5] transition-colors"
          >
            {children}
          </a>
        );
      },
    },
  };

  const magazineComponents: any = {
    ...baseComponents,
    block: {
      ...(baseComponents.block as any),
      h3: ({ children }: any) => (
        <h3 className="text-sm md:text-lg font-[800] mt-10 mb-4 text-[#0096a5] uppercase border-b-2 border-tropic inline-block tracking-wide">
          {children}
        </h3>
      ),
      normal: ({ children }: any) => (
        <p className="mb-6 text-[#0096a5] leading-[1.8] font-sans text-base md:text-[17px]">
          {children}
        </p>
      ),
    },
  };

  const portableTextComponents = magazineStyle
    ? magazineComponents
    : baseComponents;

  if (twoColumns) {
    const half = Math.ceil(body.length / 2);
    const splitIndex = half % 2 !== 0 ? half + 1 : half;
    const leftBody = body.slice(0, splitIndex);
    const rightBody = body.slice(splitIndex);

    return (
      <div className="grid md:grid-cols-2 gap-12">
        <div className="prose prose-indigo max-w-none prose-lg">
          <PortableText value={leftBody} components={portableTextComponents} />
        </div>
        <div className="prose prose-indigo max-w-none prose-lg">
          <PortableText value={rightBody} components={portableTextComponents} />
        </div>
      </div>
    );
  }

  if (magazineStyle) {
    return (
      <div className="prose max-w-none clear-both">
        <div className="float-right w-full md:w-[45%] ml-0 md:ml-8 mb-6 mt-4 relative h-[300px]">
          <Image
            src="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop"
            alt="Pizza Delivery Illustration"
            fill
            sizes="(max-width: 768px) 100vw, 45vw"
            className="rounded-xl shadow-sm border border-sky-blue filter sepia-[0.3] object-cover"
          />
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg border border-sky-blue shadow-sm font-bold text-[#4ebdd5] text-sm">
            30 MINUTE DELIVERY
          </div>
        </div>
        <PortableText value={body} components={portableTextComponents} />

      </div>
    );
  }

  return (
    <div className="prose prose-indigo max-w-none prose-lg">
      <PortableText value={body} components={portableTextComponents} />
    </div>
  );
}
