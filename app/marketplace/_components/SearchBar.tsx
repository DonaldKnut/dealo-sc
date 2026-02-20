import { IoSearchCircle } from "react-icons/io5";

type SearchBarProps = {
  query: string;
  setQuery: (query: string) => void;
  searchWork: () => void;
};

const SearchBar = ({ query, setQuery, searchWork }: SearchBarProps) => (
  <div className="relative hidden lg:block w-full max-w-2xl">
    <input
      type="text"
      placeholder="What specific services?"
      onChange={(e) => setQuery(e.target.value)}
      className="px-6 py-3 rounded-full w-full bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-[#3b634b]"
    />
    <button
      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#78ac76] hover:bg-[#386f37] text-white hover:text-[#4fec5c] px-4 py-2 rounded-full flex items-center gap-2"
      onClick={searchWork}
      disabled={query === ""}
    >
      Search <IoSearchCircle size={24} color="white" />
    </button>
  </div>
);

export default SearchBar;
