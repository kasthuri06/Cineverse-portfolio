import React, { useEffect, useState } from "react";
import API from "../../../api/axios";

export default function MessageList() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // Optionally, add delete later

  useEffect(() => {
    API.get("/messages")
      .then(res => {
        setMessages(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load messages");
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold text-blue-900 mb-6">Contact Messages</h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : messages.length === 0 ? (
        <div className="text-gray-400">No messages found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border rounded">
            <thead className="bg-blue-50">
              <tr>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Message</th>
                <th className="p-2 border">Date</th>
              </tr>
            </thead>
            <tbody>
              {messages.map(msg => (
                <tr key={msg._id} className="even:bg-gray-50">
                  <td className="border p-2 whitespace-nowrap">{msg.name}</td>
                  <td className="border p-2 whitespace-nowrap">{msg.email}</td>
                  <td className="border p-2 max-w-md">{msg.message}</td>
                  <td className="border p-2 whitespace-nowrap text-xs text-gray-500">{new Date(msg.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
