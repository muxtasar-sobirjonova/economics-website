export default function RegionInternshipPage({ params }: { params: { regionId: string } }) {
  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4 capitalize">
        {params.regionId.replace(/-/g, ' ')} Internships
      </h1>
      <p className="text-muted">
        This page is currently empty. Future internship listings for this region will appear here.
      </p>
    </div>
  );
}
