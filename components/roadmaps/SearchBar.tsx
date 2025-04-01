import { Search } from "lucide-react";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export default function SearchBar({
  searchTerm,
  setSearchTerm,
}: SearchBarProps) {
  return (
    <div className="relative max-w-md mx-auto">
      <input
        type="text"
        placeholder="Search roadmaps..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 pl-10 text-primaryDark bg-primaryWhite border  rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500 focus:ring-opacity-50 focus:outline-none"
      />
      <Search
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        size={20}
      />
    </div>
  );
}
