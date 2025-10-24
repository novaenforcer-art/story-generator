import React, { useEffect, useState } from "react";
import axios from "axios";

const StoryLoader = ({ storyId }) => {
  const [story, setStory] = useState(null);
  const [currentNode, setCurrentNode] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!storyId) return;

    const fetchStory = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/stories/${storyId}/complete`);
        setStory(res.data);
        setCurrentNode(res.data.root_node); // start at root
      } catch (err) {
        console.error(err);
        setError("Failed to fetch story");
      }
    };

    fetchStory();
  }, [storyId]);

  const handleOptionClick = (option) => {
    if (!story || !option.node_id) return;
    const nextNode = story.all_nodes[option.node_id];
    setCurrentNode(nextNode);
  };

  if (error) return <p className="text-red-500 mt-4">{error}</p>;
  if (!story || !currentNode) return <p className="mt-4">Loading story...</p>;

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-4">{story.title}</h2>
      <div className="p-4 border rounded-md bg-white shadow">
        <p className="mb-4">{currentNode.content}</p>

        {!currentNode.is_ending && currentNode.options && currentNode.options.length > 0 ? (
          <div className="flex flex-col gap-2">
            {currentNode.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleOptionClick(opt)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                {opt.text}
              </button>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-green-600 font-semibold">🎉 The End!</p>
        )}
      </div>
    </div>
  );
};

export default StoryLoader;
