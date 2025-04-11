import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import LoadingState from "../Loading/LoadingState";
import { Character } from "../../types/characters";
import { LocationDetails } from "../../types/location";



export default function LocationDetailsComponent() {
  const { id } = useParams();

  // Fetch location info
  const fetchLocation = async (): Promise<LocationDetails> => {
    const response = await axios.get(`https://rickandmortyapi.com/api/location/${id}`);
    return response.data;
  };

  // Fetch characters by ID list
  const fetchCharacters = async (urls: string[]): Promise<Character[]> => {
    const ids = urls.map((url) => url.split("/").pop()).join(",");
    const response = await axios.get(`https://rickandmortyapi.com/api/character/${ids}`);
    return Array.isArray(response.data) ? response.data : [response.data];
  };

  const {
    data: location,
    isLoading: isLocationLoading,
    isError: isLocationError,
  } = useQuery<LocationDetails, Error>({
    queryKey: ["location", id],
    queryFn: fetchLocation,
    enabled: !!id,
  });

  const {
    data: residents,
    isLoading: isCharactersLoading,
    isError: isCharactersError,
  } = useQuery<Character[], Error>({
    queryKey: ["location-characters", id],
    queryFn: () => fetchCharacters(location?.residents || []),
    enabled: !!location?.residents?.length,
  });

  if (isLocationLoading || isCharactersLoading) return <LoadingState />;
  if (isLocationError || isCharactersError || !location)
    return <p className="text-center text-red-500">Error loading location data.</p>;

  return (
    <section className="min-h-screen w-full bg-black py-8 px-6 md:px-12 lg:px-20 text-white">
      <div className="max-w-4xl mx-auto rounded-xl bg-gray-900 shadow-lg p-6 mb-10">
        <h1 className="text-3xl font-bold text-green-400 mb-4">{location.name}</h1>
        <p><strong>Type:</strong> {location.type}</p>
        <p><strong>Dimension:</strong> {location.dimension}</p>
        <p><strong>Residents:</strong> {location.residents.length}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {residents?.length === 0 && (
      <p className="text-center text-gray-300 col-span-full">No residents found.</p>
      )}

        {(residents ?? []).map((character: Character) => (
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
    </section>
  );
}
