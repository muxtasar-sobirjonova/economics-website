import Link from "next/link";
import { Article } from "@/lib/types";

export default function ArticleCard({ article }: { article: Article }) {
  const readingTime = Math.ceil((article.body?.length || 1000) / 250); // Mock word count logic

  return (
    <Link
      href={`/articles/${article.slug.current}`}
      className="group block bg-white rounded-xl border border-gray-200 p-6 hover:shadow-sm transition-shadow h-full flex flex-col"
    >
      <div className="mb-4">
        <span className="inline-block bg-[rgba(200,217,230,0.4)] text-[#4ebdd5] text-xs font-bold px-2 py-1 rounded-full">
          {article.topic?.title || "Economics"}
        </span>
      </div>

      <h2 className="font-semibold text-[#0096a5] text-lg leading-snug mb-2 group-hover:text-[#4ebdd5] transition-colors">
        {article.title}
      </h2>

      <p className="text-[#4ebdd5] text-sm mt-2 line-clamp-3 mb-6 flex-1">
        {article.excerpt ||
          "Learn about this economic concept through a real-world story."}
      </p>

      <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
        <span className="text-gray-400 text-xs font-medium">
          {article.author || "Editorial Team"} • {readingTime} min read
        </span>
        <span className="text-[#4ebdd5] text-sm font-semibold flex items-center group-hover:translate-x-1 transition-transform">
          Read more <span className="ml-1">→</span>
        </span>
      </div>
    </Link>
  );
}
