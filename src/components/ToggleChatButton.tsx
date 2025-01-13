// components/ToggleChatButton.tsx
import React from 'react';
import { FiX } from 'react-icons/fi'; // Importing an icon from react-icons

type ToggleChatButtonProps = {
  onClick: () => void;
  isOpen: boolean;
  userCount: number;
};

const ToggleChatButton: React.FC<ToggleChatButtonProps> = ({ onClick, isOpen, userCount }) => {
  return (
    <>
      {!isOpen ? (
        <button
          onClick={onClick}
          className="fixed bottom-4 right-4 bg-blue-500 text-white p-2 rounded-full shadow-lg z-50 flex items-center justify-center text-xs"
        >
          Open Chat ({userCount} online)
        </button>
      ) : (
        <button
          onClick={onClick}
          className="fixed top-4 right-4 bg-red-500 text-white p-2 rounded-full shadow-lg z-50 flex items-center justify-center"
        >
          <FiX size={16} />
        </button>
      )}
    </>
  );
};

export default ToggleChatButton;
