import React from 'react';
import { NavLink, Routes, Route, Outlet, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";
import ProjectList from "./projects/ProjectList";
import ProjectForm from "./projects/ProjectForm";
import ServiceList from "./services/ServiceList";
import ServiceForm from "./services/ServiceForm";
import AboutEdit from "./about/AboutEdit";
import MessageList from "./messages/MessageList";

function Sidebar() {
  const links = [
    { to: "/admin/dashboard/projects", label: "Projects" },
    { to: "/admin/dashboard/services", label: "Services" },
    { to: "/admin/dashboard/about", label: "About" },
    { to: "/admin/dashboard/messages", label: "Messages" },
  ];
  const activeClass = "bg-blue-100 text-blue-900 font-bold";
  return (
    <nav className="flex flex-col gap-1 py-6 px-2 border-r min-w-[160px]">
      {links.map((link) => (
        <NavLink
          to={link.to}
          key={link.to}
          className={({ isActive }) =>
            `rounded px-4 py-2 hover:bg-blue-50 transition ${isActive ? activeClass : "text-blue-700"}`
          }
          end={link.to === "/admin/dashboard"}
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}

export default function AdminDashboard() {
  const { logout } = useAdminAuth();
  const navigate = useNavigate();
  function handleLogout() {
    logout();
    navigate("/admin/login", { replace: true });
  }
  return (
    <div className="flex flex-col md:flex-row min-h-[60vh] bg-white rounded shadow max-w-5xl mx-auto">
      <div className="md:w-56 border-b md:border-b-0 md:border-r bg-gray-50 rounded-tl rounded-bl">
        <Sidebar />
        <button
          onClick={handleLogout}
          className="w-full mt-8 mb-2 px-4 py-2 rounded text-sm font-semibold bg-red-50 text-red-600 hover:bg-red-100"
        >
          Logout
        </button>
      </div>
      <div className="flex-1 p-6">
        <Routes>
          <Route index element={<div className="text-xl font-semibold text-blue-900">Welcome, Admin!</div>} />
          <Route path="projects" element={<ProjectList />} />
          <Route path="projects/new" element={<ProjectForm isEdit={false}/>} />
          <Route path="projects/:id/edit" element={<ProjectForm isEdit={true}/>} />
          <Route path="services" element={<ServiceList />} />
          <Route path="services/new" element={<ServiceForm isEdit={false}/>} />
          <Route path="services/:id/edit" element={<ServiceForm isEdit={true}/>} />
          <Route path="about" element={<AboutEdit />} />
          <Route path="messages" element={<MessageList />} />
        </Routes>
        <Outlet />
      </div>
    </div>
  );
}
