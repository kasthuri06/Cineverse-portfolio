import React from 'react';
import { Link } from "react-router-dom";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Nav */}
      <nav className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-4 py-3 ">
          <Link to="/" className="font-bold text-2xl text-blue-800 tracking-widest">CineVerse</Link>
          <div className="space-x-4 flex text-base font-medium">
            <Link to="/projects" className="hover:text-blue-600">Projects</Link>
            <Link to="/services" className="hover:text-blue-600">Services</Link>
            <Link to="/about" className="hover:text-blue-600">About</Link>
            <Link to="/contact" className="hover:text-blue-600">Contact</Link>
            <Link to="/admin/login" className="ml-2 px-3 py-1 rounded text-white bg-blue-700 hover:bg-blue-900">Admin</Link>
          </div>
        </div>
      </nav>
      {/* Main content */}
      <main className="flex-1 w-full py-8 px-2 md:px-0">
        {children}
      </main>
      {/* Footer */}
      <footer className="bg-white py-3 text-center shadow-inner text-gray-600 text-sm">
        &copy; {new Date().getFullYear()} CineVerse. All rights reserved.
      </footer>
    </div>
  );
}
