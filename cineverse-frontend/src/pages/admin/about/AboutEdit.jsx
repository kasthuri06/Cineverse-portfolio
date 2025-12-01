import React, { useEffect, useState, useRef } from "react";
import API from "../../../api/axios";
import { useAdminAuth } from "../../../context/AdminAuthContext";

export default function AboutEdit() {
  const [about, setAbout] = useState({ mission: "", vision: "", story: "", team: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    API.get("/about").then(res => {
      setAbout(res.data);
      setLoading(false);
    }).catch(() => {
      setLoading(false); // If first setup, fields will be empty
    });
  }, []);

  function handleInput(e) {
    setAbout(a => ({ ...a, [e.target.name]: e.target.value }));
  }

  function updateTeam(idx, field, value) {
    setAbout(a => ({ ...a, team: a.team.map((m, i) => i === idx ? { ...m, [field]: value } : m) }));
  }

  function removeTeam(idx) {
    setAbout(a => ({ ...a, team: a.team.filter((_, i) => i !== idx) }));
  }

  function addTeam() {
    setAbout(a => ({ ...a, team: [...(a.team || []), { name: "", title: "", photo: "" }] }));
  }

  function handleTeamPhoto(idx, file) {
    setAbout(a => {
      const fileUrl = URL.createObjectURL(file);
      // store file temporarily in _file, and preview url
      const team = a.team.map((m, i) =>
        i === idx ? { ...m, _file: file, photo: fileUrl } : m
      );
      return { ...a, team };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    // Validation
    if (!about.mission || !about.vision) {
      setError("Mission and Vision are required fields.");
      return;
    }
    
    setSaving(true);
    // If any team members have _file (new photo), upload those
    const members = about.team || [];
    // Prepare FormData for team member photos
    const formData = new FormData();
    
    // Append files in order (only files that were newly selected)
    members.forEach((m) => {
      if (m._file) {
        formData.append("teamPhotos", m._file);
      }
    });
    
    formData.append("mission", about.mission);
    formData.append("vision", about.vision);
    formData.append("story", about.story || "");
    
    // Add serialized team (remove _file property, keep photo URLs)
    // Filter out empty team members before sending
    const teamData = members
      .map(({ _file, ...keep }) => keep)
      .filter(m => m.name && m.title); // Only send members with both name and title
    formData.append("team", JSON.stringify(teamData));
    
    try {
      const response = await API.put("/about", formData, { 
        headers: { 
          "Content-Type": "multipart/form-data"
        } 
      });
      setSuccess("About updated successfully!");
      // Update local state with response data (which includes updated photo URLs)
      if (response.data) {
        setAbout(response.data);
      }
    } catch (err) {
      console.error('Save error:', err);
      let errorMsg = "Could not save. Please check fields and try again.";
      if (err?.response?.data?.msg) {
        errorMsg = err.response.data.msg;
      } else if (err?.response?.status === 500) {
        errorMsg = "Server error. Please check your Cloudinary configuration and try again.";
      } else if (err?.message) {
        errorMsg = err.message;
      }
      setError(errorMsg);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <form className="bg-white p-7 rounded-lg shadow max-w-4xl mx-auto" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold text-blue-900 mb-4">Edit About Section</h2>
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block font-medium text-blue-900">Mission</label>
          <textarea className="w-full border rounded px-3 py-2 min-h-[70px]" name="mission" value={about.mission} onChange={handleInput} disabled={saving} required />
        </div>
        <div>
          <label className="block font-medium text-blue-900">Vision</label>
          <textarea className="w-full border rounded px-3 py-2 min-h-[70px]" name="vision" value={about.vision} onChange={handleInput} disabled={saving} required />
        </div>
      </div>
      <div className="mb-5">
        <label className="block font-medium text-blue-900">Story (optional)</label>
        <textarea className="w-full border rounded px-3 py-2 min-h-[80px]" name="story" value={about.story || ""} onChange={handleInput} disabled={saving} />
      </div>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <div className="font-semibold text-blue-900 text-lg">Team Members</div>
          <button type="button" onClick={addTeam} className="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700">+ Add</button>
        </div>
        <div className="flex flex-wrap gap-6">
          {(about.team || []).map((m, idx) => (
            <div key={idx} className="bg-blue-50 rounded-lg p-4 relative w-[210px] flex flex-col items-center gap-3 shadow border">
              {m.photo ? (
                <img src={m.photo} alt="member" className="h-16 w-16 rounded-full object-cover border-2 border-blue-500" />
              ) : (
                <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl font-bold text-blue-700">
                  {m.name?.charAt(0) || '?'}
                </div>
              )}
              <label className="cursor-pointer text-blue-700 hover:underline font-semibold text-xs">
                Change Photo
                <input type="file" accept="image/*" className="hidden" disabled={saving}
                  onChange={e => handleTeamPhoto(idx, e.target.files[0])} />
              </label>
              <input className="block w-full rounded border px-2 py-1 mt-1 text-sm" placeholder="Name" value={m.name} onChange={e => updateTeam(idx, "name", e.target.value)} disabled={saving} />
              <input className="block w-full rounded border px-2 py-1 mt-1 text-sm" placeholder="Title" value={m.title} onChange={e => updateTeam(idx, "title", e.target.value)} disabled={saving} />
              <button type="button" className="text-red-600 text-xs font-bold mt-2" onClick={() => removeTeam(idx)} disabled={saving}>Remove</button>
            </div>
          ))}
        </div>
      </div>
      {error && <div className="text-red-600 text-center font-semibold mt-4">{error}</div>}
      {success && <div className="text-green-600 text-center font-semibold mt-4">{success}</div>}
      <div className="flex gap-4 justify-end mt-5">
        <button type="submit" className="px-5 py-2 font-bold rounded bg-blue-700 text-white hover:bg-blue-900 disabled:opacity-50" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button>
      </div>
    </form>
  );
}
