import React, { useState } from "react";
import ThemeInput from "./ThemeInput";
import StoryGenerator from "./StoryGenerator";

const StoryGame = () => {
  const [theme, setTheme] = useState(null);

  const startStory = (selectedTheme) => {
    setTheme(selectedTheme);
  };

  return (
    <div className="container mx-auto p-6">
      {!theme ? (
        <ThemeInput onStart={startStory} />
      ) : (
        <StoryGenerator theme={theme} />
      )}
    </div>
  );
};

export default StoryGame;
