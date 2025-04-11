import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import LoadingState from "../Loading/LoadingState";
import { Character } from "../../types/characters";
import { EpisodeDetails } from "../../types/episode";

export default function EpisodeDetailsComponent() {
  const { id } = useParams();

  const fetchEpisode = async (): Promise<EpisodeDetails> => {
    const response = await axios.get(`https://rickandmortyapi.com/api/episode/${id}`);
    return response.data;
  };

  const fetchCharacters = async (urls: string[]): Promise<Character[]> => {
    const ids = urls.map((url) => url.split("/").pop()).join(",");
    const response = await axios.get(`https://rickandmortyapi.com/api/character/${ids}`);
    return Array.isArray(response.data) ? response.data : [response.data];
  };

  const {
    data: episode,
    isLoading: isEpisodeLoading,
    isError: isEpisodeError,
  } = useQuery<EpisodeDetails, Error>({
    queryKey: ["episode", id],
    queryFn: fetchEpisode,
    enabled: !!id,
  });

  const {
    data: characters,
    isLoading: isCharactersLoading,
    isError: isCharactersError,
  } = useQuery<Character[], Error>({
    queryKey: ["episode-characters", id],
    queryFn: () => fetchCharacters(episode?.characters || []),
    enabled: !!episode?.characters?.length,
  });

  if (isEpisodeLoading || isCharactersLoading) return <LoadingState />;
  if (isEpisodeError || isCharactersError || !episode)
    return <p className="text-center text-red-500">Error loading episode data.</p>;

  return (
    <section className="min-h-screen w-full bg-black py-8 px-6 md:px-12 lg:px-20 text-white">
      <div className="max-w-4xl mx-auto rounded-xl bg-gray-900 shadow-lg p-6 mb-10">
        <h1 className="text-3xl font-bold text-green-400 mb-4">{episode.name}</h1>
        <p><strong>Episode Code:</strong> {episode.episode}</p>
        <p><strong>Air Date:</strong> {episode.air_date}</p>
        <p><strong>Characters:</strong> {episode.characters.length}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {(characters ?? []).map((character) => (
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
