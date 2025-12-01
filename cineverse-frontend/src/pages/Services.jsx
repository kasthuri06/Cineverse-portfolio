import React,{ useEffect, useState } from "react";
import API from "../api/axios";

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    API.get("/services")
      .then((res) => {
        setServices(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load services.");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-lg">Loading...</div>;
  if (error)
    return <div className="p-8 text-lg text-red-600">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto py-12 px-2">
      <h1 className="text-4xl font-bold mb-8 text-blue-900 text-center">Our Services</h1>
      {services.length === 0 ? (
        <div className="text-gray-400 text-center">No services found.</div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service) => (
            <div key={service._id} className="bg-white shadow rounded-lg p-6 flex flex-col items-center hover:shadow-xl border hover:border-blue-300 transition text-center min-h-[230px]">
              {service.iconUrl ? (
                <img src={service.iconUrl} alt="icon" className="h-14 w-14 object-contain mb-3" />
              ) : (
                <div className="h-14 w-14 mb-3 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 font-bold text-2xl">S</div>
              )}
              <div className="font-semibold text-lg mb-2 text-blue-800">{service.title}</div>
              <div className="text-gray-700 text-sm line-clamp-3">{service.description}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
