// import React from "react";
// import Link from "next/link";

// interface HamburgerMenuProps {
//   isOpen: boolean;
//   toggleNavbar: () => void;
// }

// const HamburgerMenu: React.FC<HamburgerMenuProps> = ({
//   isOpen,
//   toggleNavbar,
// }) => {
//   return (
//     <>
//       <button className="text-white" onClick={toggleNavbar}>
//         <span className={`${isOpen ? "hidden" : "block"} hamburger-line`} />
//         <span className={`${isOpen ? "hidden" : "block"} hamburger-line`} />
//         <span className={`${isOpen ? "hidden" : "block"} hamburger-line`} />
//       </button>

//       {isOpen && (
//         <div className="bg-gray-800 text-white md:hidden z-40">
//           <div className="flex flex-col items-center py-4 space-y-4">
//             <Link href="/education" className="hover:text-green-400">
//               Education
//             </Link>
//             <Link href="/network" className="hover:text-green-400">
//               Network
//             </Link>
//             <Link href="/explore" className="hover:text-green-400">
//               Dealo Travels
//             </Link>
//             <Link href="/dealopay" className="hover:text-green-400">
//               Crypto
//             </Link>
//             <Link href="/register" className="hover:text-green-400">
//               Become a seller
//             </Link>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default HamburgerMenu;
interface HamburgerMenuProps {
  isOpen: boolean;
  toggleNavbar: () => void;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({
  isOpen,
  toggleNavbar,
}) => {
  return (
    <button className="text-white relative" onClick={toggleNavbar}>
      <div className="space-y-1.5">
        <span
          className={`block w-8 h-0.5 bg-white transition-transform duration-300 ease-in-out ${
            isOpen ? "rotate-45 translate-y-2" : ""
          }`}
        />
        <span
          className={`block w-8 h-0.5 bg-white transition-opacity duration-300 ease-in-out ${
            isOpen ? "opacity-0" : ""
          }`}
        />
        <span
          className={`block w-8 h-0.5 bg-white transition-transform duration-300 ease-in-out ${
            isOpen ? "-rotate-45 -translate-y-2" : ""
          }`}
        />
      </div>
    </button>
  );
};

export default HamburgerMenu;
