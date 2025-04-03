import React from "react";

type NavigationModalProps = {
  isOpen: boolean;
  onQuiz: () => void;
  onHome: () => void;
};

const NavigationModal: React.FC<NavigationModalProps> = ({
  isOpen,
  onQuiz,
  onHome,
}) => {
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 z-20 flex items-center justify-center bg-black opacity-50" />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-alt-bg-color rounded-lg shadow-lg p-6 w-80 h-auto z-30">
        <h2 className="text-xl font-bold mb-4 text-primary-text-color">
          Congratulations!
        </h2>
        <p className="mb-4 text-secondary-text-color">
          You have completed all lessons. Where would you like to go?
        </p>
        <div className="flex justify-between">
          <button
            onClick={onHome}
            className="px-4 py-2 bg-primary text-secondary-text-color rounded-lg hover:cursor-pointer"
          >
            Home
          </button>
          <button
            onClick={onQuiz}
            className="px-4 py-2 bg-gradient-to-b from-gradient-start to-gradient-end text-white rounded-lg hover:cursor-pointer"
          >
            Quiz
          </button>
        </div>
      </div>
    </>
  );
};

export default NavigationModal;
