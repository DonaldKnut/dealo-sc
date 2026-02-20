import React from "react";

interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, setIsOpen }) => {
  return (
    <div className="md:hidden">
      <button onClick={() => setIsOpen(!isOpen)} className="hamburger-button">
        <span className={`hamburger-line ${isOpen ? "hidden" : ""}`} />
        <span className={`hamburger-line ${isOpen ? "hidden" : ""}`} />
        <span className={`hamburger-line ${isOpen ? "hidden" : ""}`} />
      </button>

      {isOpen && (
        <div className="bg-gray-800 text-white space-y-4 py-4">
          {/* Mobile Links */}
          <button
            className="block text-white hover:text-green-400"
            onClick={() => setIsOpen(false)}
          >
            Education
          </button>
          <button
            className="block text-white hover:text-green-400"
            onClick={() => setIsOpen(false)}
          >
            Network
          </button>
          <button
            className="block text-white hover:text-green-400"
            onClick={() => setIsOpen(false)}
          >
            Dealo Travels
          </button>
          <button
            className="block text-white hover:text-green-400"
            onClick={() => setIsOpen(false)}
          >
            Crypto
          </button>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;
