import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "flowbite-react";
import { Link } from "react-router-dom";
import LoadingState from "../Loading/LoadingState";
import { Character, CharactersAPIResponse } from "../../types/characters";

export default function CharactersComponent() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [query, setQuery] = useState(""); // Used for submitting the actual API request


  const fetchCharacters = async (): Promise<CharactersAPIResponse> => {
    const searchParam = query ? `&name=${query}` : "";
    try {
      const response = await axios.get(`https://rickandmortyapi.com/api/character?page=${page}${searchParam}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        // Rick and Morty API returns 404 for "not found"
        return {
          info: { count: 0, pages: 0, next: null, prev: null },
          results: [],
        };
      }
      throw error; // throw other errors normally
    }
  };
  

  const {
    data,
    isLoading,
    isError,
    isFetching,
  } = useQuery<CharactersAPIResponse, Error>({
    queryKey: ["characters", page, query],
    queryFn: fetchCharacters,
  });

  // Reset to page 1 when a new search is submitted
  useEffect(() => {
    setPage(1);
  }, [query]);

  // Ellipsis pagination logic
  const getPaginationRange = (
    current: number,
    total: number,
    delta: number = 2
  ): (number | "...")[] => {
    const range: (number | "...")[] = [];
  
    const left = Math.max(2, current - delta);
    const right = Math.min(total - 1, current + delta);
  
    // Always include first page
    range.push(1);
  
    // Show leading ellipsis if needed
    if (left > 2) {
      range.push("...");
    }
  
    // Main range
    for (let i = left; i <= right; i++) {
      range.push(i);
    }
  
    // Show trailing ellipsis if needed
    if (right < total - 1) {
      range.push("...");
    }
  
    // Always include last page
    if (total > 1) {
      range.push(total);
    }
  
    return range;
  };
  

  if (isLoading || !data) return <LoadingState />;
  if (isError) return <p className="text-center text-red-500">Error fetching characters.</p>;

  const { results, info } = data;
  const totalPages = info.pages;

  return (
    <section className="min-h-screen w-full bg-black py-8 px-6 md:px-12 lg:px-20">
      <h1 className="text-center text-4xl font-bold text-green-400 mb-8">
        Rick & Morty Characters
      </h1>

      {/* Search Input */}
      <form
        className="mb-8 flex max-w-xl mx-auto items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          setQuery(searchTerm.trim());
        }}
      >
        <input
          type="text"
          placeholder="Search characters..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <Button type="submit" className="bg-green-500 text-black hover:bg-green-400">
          Search
        </Button>
      </form>

      {/* Characters Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {results.length === 0 && (
        <p className="text-center text-green-600 col-span-full">
          No characters found.
        </p>
      )}

      {results.map((character: Character) => (
        <Link key={character.id} to={`/characters/${character.id}`} className="block">
        <div className="rounded-xl bg-gray-900 shadow-lg cursor-pointer hover:scale-105 hover:shadow-green-400/50 transition-transform duration-200 overflow-hidden flex flex-col h-96">

            <div className="h-60 w-full overflow-hidden">
              <img
                src={character.image}
                alt={`Portrait of ${character.name}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h2 className="mb-2 text-xl font-bold text-green-500">{character.name}</h2>
              <p className="text-white">Species: {character.species}</p>
              <p className="text-white">Status: {character.status}</p>
            </div>
          </div>
        </Link>
      ))}
      </div>



      {/* Pagination */}
      <div className="mt-10 flex flex-wrap justify-center items-center gap-2">
        <Button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-50"
        >
          Previous
        </Button>

        {getPaginationRange(page, totalPages).map((pageNum, idx) =>
        pageNum === "..." ? (
          <span
            key={`ellipsis-${idx}`}
            className="px-3 py-2 text-white bg-transparent border border-gray-600 rounded-md"
          >
            ...
          </span>
        ) : (
          <Button
            key={`page-${pageNum}`}
            onClick={() => setPage(pageNum)} // ✅ This is safe now
            className={`${
              pageNum === page
                ? "bg-green-500 text-black font-bold"
                : "bg-gray-700 text-white"
            } hover:bg-green-400`}
          >
            {pageNum}
          </Button>
        )
      )}


        <Button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-50"
        >
          Next
        </Button>
      </div>

      {isFetching && <p className="text-center text-gray-400 mt-4">Loading more...</p>}

    </section>
  );
}
