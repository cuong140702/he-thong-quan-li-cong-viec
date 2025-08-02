import React from "react";

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-6 mt-12">
      <div className="max-w-6xl mx-auto text-center text-sm">
        &copy; {new Date().getFullYear()} TaskTracker. Built with ❤️ using
        Next.js & shadcn/ui.
      </div>
    </footer>
  );
};
