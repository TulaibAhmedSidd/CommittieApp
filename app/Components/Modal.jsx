'use client'
export default function Modal({ children, onClose }) {
    const handleBackgroundClick = (e) => {
      // Close modal only if the background is clicked, not the modal content
      if (e.target === e.currentTarget) {
        onClose();
      }
    };
  
    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
        onClick={handleBackgroundClick}
      >
        <div className="bg-white p-6 rounded-lg shadow-lg relative">
          <button
            className="absolute top-2 right-2 text-gray-500"
            onClick={onClose}
          >
            ×
          </button>
          {children}
        </div>
      </div>
    );
  }
  