import React, { useState } from "react";

const ThemeInput = ({ onStart }) => {
  const [theme, setTheme] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!theme) return;
    onStart(theme);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-center mt-6">
      <input
        type="text"
        placeholder="Enter story theme..."
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        className="border rounded-md p-2 w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
      >
        Generate Story
      </button>
    </form>
  );
};

export default ThemeInput;
