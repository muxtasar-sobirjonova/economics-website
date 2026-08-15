import Link from "next/link";
import { seedArticle } from "@/sanity/seed";

export const metadata = {
  title: "Topics | EconBlog",
  description: "Explore economic topics through entrepreneurship.",
};

export default function TopicsPage() {
  // In a real app, fetch from Sanity using ALL_TOPICS_QUERY
  const topics = [seedArticle.topic];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-[60vh]">
      <div className="mb-12">
        <h1 className="text-h1 font-semibold text-ink mb-s3">
          Explore by Topic
        </h1>
        <p className="text-xl text-muted max-w-3xl">
          Find stories grouped by the core economic principles they illustrate.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic) => (
          <Link
            key={topic._id}
            href={`/articles?topic=${topic.slug.current}`}
            className="group block bg-surface border border-line rounded-2xl p-8 hover:border-accent hover:shadow-md transition-all"
          >
            <h2 className="text-h3 font-semibold text-ink group-hover:text-accent mb-s2 transition-colors">
              {topic.title}
            </h2>
            <p className="text-muted">
              {topic.description ||
                "Learn about this economic concept through real-world examples."}
            </p>
            <div className="mt-6 flex items-center text-accent font-medium">
              Explore topic{" "}
              <span className="ml-2 group-hover:translate-x-1 transition-transform">
                →
              </span>
            </div>
          </Link>
        ))}

        {/* Coming soon placeholder */}
        <div className="block bg-bg border border-dashed border-line rounded-2xl p-8 flex flex-col items-start justify-center opacity-60">
          <h2 className="text-h3 font-semibold text-faint mb-s2">More coming soon</h2>
          <p className="text-faint text-sm">
            New topic areas are being added as new lessons launch.
          </p>
        </div>
      </div>
    </div>
  );
}
