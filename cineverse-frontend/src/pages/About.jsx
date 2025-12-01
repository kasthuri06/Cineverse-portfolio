import { useEffect, useState } from "react";
import API from "../api/axios";

export default function About() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    API.get("/about")
      .then((res) => {
        // Always set data, even if empty
        setData(res.data || { mission: '', vision: '', story: '', team: [] });
        setLoading(false);
      })
      .catch((err) => {
        console.error('About fetch error:', err);
        // Set empty data on error instead of showing error message
        setData({ mission: '', vision: '', story: '', team: [] });
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-lg">Loading...</div>;
  
  // Show friendly message if no content
  if (!data || (!data.mission && !data.vision)) {
    return (
      <div className="max-w-3xl mx-auto py-10 px-2 text-center">
        <h1 className="text-4xl font-bold mb-6 text-blue-900">About CineVerse</h1>
        <p className="text-gray-600">About content is being prepared. Please check back soon.</p>
      </div>
    );
  }
  
  if (error) return <div className="p-8 text-lg text-red-600">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto py-10 px-2">
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-900">About CineVerse</h1>

      <section className="mb-5">
        <h2 className="font-semibold text-xl mb-2 text-blue-800">Mission</h2>
        <p className="text-gray-700 mb-2 whitespace-pre-line leading-relaxed">{data.mission}</p>
      </section>
      <section className="mb-5">
        <h2 className="font-semibold text-xl mb-2 text-blue-800">Vision</h2>
        <p className="text-gray-700 mb-2 whitespace-pre-line leading-relaxed">{data.vision}</p>
      </section>
      {data.story && (
        <section className="mb-5">
          <h2 className="font-semibold text-xl mb-2 text-blue-800">Story</h2>
          <p className="text-gray-700 mb-2 whitespace-pre-line leading-relaxed">{data.story}</p>
        </section>
      )}
      {data.team && data.team.length > 0 && (
        <section className="mt-10">
          <h2 className="font-semibold text-xl mb-4 text-blue-800">Our Team</h2>
          <div className="flex flex-wrap gap-5 justify-center">
            {data.team.map((member, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center bg-white border rounded-lg shadow px-4 py-5 min-w-[160px] max-w-[200px]"
              >
                {member.photo ? (
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="h-20 w-20 mb-3 rounded-full object-cover border-2 border-blue-500"
                  />
                ) : (
                  <div className="h-20 w-20 mb-3 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 font-bold text-3xl">
                    {member.name ? member.name.charAt(0) : "?"}
                  </div>
                )}
                <div className="font-semibold">{member.name}</div>
                <div className="text-blue-600 text-sm">{member.title}</div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
