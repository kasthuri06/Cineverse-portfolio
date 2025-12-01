import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/axios";

function getVideoEmbed(url) {
  if (!url) return null;
  // YouTube
  const ytMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/
  );
  if (ytMatch) {
    return (
      <iframe
        title="YouTube Video"
        className="w-full aspect-video rounded border mb-5"
        src={`https://www.youtube.com/embed/${ytMatch[1]}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    );
  }
  // Vimeo
  const viMatch = url.match(/vimeo\.com\/(\d+)/);
  if (viMatch) {
    return (
      <iframe
        title="Vimeo Video"
        className="w-full aspect-video rounded border mb-5"
        src={`https://player.vimeo.com/video/${viMatch[1]}`}
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      ></iframe>
    );
  }
  return null;
}

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    API.get(`/projects/${id}`)
      .then((res) => {
        setProject(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Project not found.");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-8 text-lg">Loading...</div>;
  if (error || !project)
    return (
      <div className="p-8 text-lg text-red-600">
        {error}
        <div className="mt-4">
          <Link to="/projects" className="text-blue-700 hover:underline">&larr; Back to Projects</Link>
        </div>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto py-10">
      <Link to="/projects" className="text-blue-700 hover:underline">&larr; Back to Projects</Link>
      <div className="mt-6 bg-white rounded-xl shadow p-6 flex flex-col md:flex-row gap-8">
        {project.posterUrl && (
          <img
            src={project.posterUrl}
            alt={project.title}
            className="w-full max-w-xs object-cover rounded-lg border mb-5 md:mb-0 md:mr-8"
          />
        )}
        <div className="flex-1">
          <div className="flex flex-wrap gap-x-4 gap-y-2 items-baseline mb-1">
            <h1 className="text-2xl font-bold ">{project.title}</h1>
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold uppercase tracking-wider">
              {project.category}
            </span>
            <span className="pl-2 text-gray-400 text-sm">{project.releaseYear}</span>
          </div>
          <div className="mt-2 text-gray-700 leading-relaxed whitespace-pre-line mb-5">
            {project.description}
          </div>

          {/* Video (YouTube/Vimeo embedded) */}
          {project.videoUrl && getVideoEmbed(project.videoUrl)}

          {project.videoUrl && !getVideoEmbed(project.videoUrl) && (
            <a
              href={project.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-blue-600 underline"
            >
              View Video
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
