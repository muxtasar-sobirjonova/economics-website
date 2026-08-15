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
        <h1 className="text-4xl font-extrabold text-brand-primary tracking-tight mb-4">
          Explore by Topic
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl">
          Find stories grouped by the core economic principles they illustrate.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic) => (
          <Link
            key={topic._id}
            href={`/articles?topic=${topic.slug.current}`}
            className="group block bg-white border border-gray-200 rounded-2xl p-8 hover:border-brand-primary hover:shadow-md transition-all"
          >
            <h2 className="text-2xl font-bold text-brand-primary group-hover:text-[#5A4FBD] mb-3 transition-colors">
              {topic.title}
            </h2>
            <p className="text-gray-600">
              {topic.description ||
                "Learn about this economic concept through real-world examples."}
            </p>
            <div className="mt-6 flex items-center text-brand-primary font-medium">
              Explore topic{" "}
              <span className="ml-2 group-hover:translate-x-1 transition-transform">
                →
              </span>
            </div>
          </Link>
        ))}

        {/* Coming soon placeholder */}
        <div className="block bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-start justify-center opacity-60">
          <h2 className="text-2xl font-bold text-gray-400 mb-3">More coming soon</h2>
          <p className="text-gray-400 text-sm">
            New topic areas are being added as new lessons launch.
          </p>
        </div>
      </div>
    </div>
  );
}
