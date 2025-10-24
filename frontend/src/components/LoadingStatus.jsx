import React from "react";

const LoadingStatus = ({ status }) => {
  let message = "";
  if (!status) message = "";
  else if (status === "pending") message = "⏳ Pending...";
  else if (status === "in_progress") message = "⚡ Generating story...";
  else if (status === "completed") message = "✅ Story ready!";
  else if (status === "failed") message = "❌ Failed to generate story";

  return message ? (
    <p className="mt-4 text-center font-semibold text-lg">{message}</p>
  ) : null;
};

export default LoadingStatus;
