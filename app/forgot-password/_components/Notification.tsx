import React from "react";

interface NotificationProps {
  message: string | null;
  type: "success" | "error";
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({
  message,
  type,
  onClose,
}) => {
  if (!message) return null;

  return (
    <div
      className={`p-4 mb-4 text-sm text-${
        type === "success" ? "green-700" : "red-700"
      } bg-${type === "success" ? "green-100" : "red-100"} rounded-lg`}
    >
      <span className="font-medium">
        {type === "success" ? "Success!" : "Error!"}{" "}
      </span>
      {message}
      <button onClick={onClose} className="ml-4 underline">
        Close
      </button>
    </div>
  );
};

export default Notification;
