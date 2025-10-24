import React, { useState, useEffect } from "react";
import api from "../api"; // Use configured api instance instead of axios
import LoadingStatus from "./LoadingStatus";
import StoryLoader from "./StoryLoader";

const StoryGenerator = ({ theme }) => {
  const [jobId, setJobId] = useState(null);
  const [status, setStatus] = useState(null);
  const [storyId, setStoryId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const createStory = async () => {
      try {
        const res = await api.post("/stories/create", {
          theme,
        });
        setJobId(res.data.job_id);
        setStatus(res.data.status);
      } catch (err) {
        console.error("Story creation error:", err);
        setError(err.response?.data?.detail || "Failed to create story");
        setStatus("failed");
      }
    };
    createStory();
  }, [theme]);

  // Poll job status every 2 seconds
  useEffect(() => {
    if (!jobId) return;
    const interval = setInterval(async () => {
      try {
        const res = await api.get(`/jobs/${jobId}`);
        setStatus(res.data.status);
        if (res.data.status === "completed") {
          setStoryId(res.data.story_id);
          clearInterval(interval);
        } else if (res.data.status === "failed") {
          clearInterval(interval);
        }
      } catch (err) {
        console.error("Job polling error:", err);
        clearInterval(interval);
        setStatus("failed");
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [jobId]);

  return (
    <div className="mt-6">
      {error && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <LoadingStatus status={status} />
      {storyId && <StoryLoader storyId={storyId} />}
    </div>
  );
};

export default StoryGenerator;