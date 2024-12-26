import { useEffect } from "react";
import PropTypes from "prop-types";

export default function Snackbar({ message, variant, onClose }) {
  // Auto-hide the snackbar after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  // Variant-specific styles
  const variantStyles = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
    warning: "bg-yellow-500 text-black",
    info: "bg-blue-500 text-white",
  };

  return (
    <div
      className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg flex items-center space-x-3 ${variantStyles[variant]} animate-fadeIn`}
    >
      {/* Icon */}
      <div>
        {variant === "success" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )}
        {variant === "error" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        )}
        {variant === "warning" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 16h-1v-4h-1m1-4h.01M12 9v4m0 0h.01M10.933 20.148L10.56 21H13.44l-.373-.852m-1.93-15.296c.646-.383 1.33-.586 2.033-.586 1.613 0 2.846 1.3 2.846 2.914 0 1.128-.54 2.189-1.59 2.906"
            />
          </svg>
        )}
        {variant === "info" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01M12 5a7 7 0 100 14 7 7 0 000-14z"
            />
          </svg>
        )}
      </div>
      {/* Message */}
      <span>{message}</span>
    </div>
  );
}

Snackbar.propTypes = {
  message: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(["success", "error", "warning", "info"]).isRequired,
  onClose: PropTypes.func.isRequired,
};
