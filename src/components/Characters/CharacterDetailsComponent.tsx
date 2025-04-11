import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import LoadingState from "../Loading/LoadingState";
import { CharacterDetails } from "../../types/characters";

export default function CharacterDetailsComponent() {
  const { id } = useParams();

  const fetchCharacter = async (): Promise<CharacterDetails> => {
    const response = await axios.get(`https://rickandmortyapi.com/api/character/${id}`);
    return response.data;
  };

  const { data, isLoading, isError } = useQuery<CharacterDetails, Error>({
    queryKey: ["character", id],
    queryFn: fetchCharacter,
    enabled: !!id,
  });

  if (isLoading) return <LoadingState />;
  if (isError || !data)
    return <p className="text-center text-red-500">Error fetching character details.</p>;

  const { image, name, status, species, gender, location, episode } = data;

  return (
    <section className="min-h-screen w-full bg-black py-8 px-6 md:px-12 lg:px-20 text-white">
      <div className="max-w-4xl mx-auto rounded-xl bg-gray-900 shadow-lg overflow-hidden">
        {/* Character Header */}
        <div className="md:flex">
          {/* Image */}
          <div className="h-80 rounded-xl md:h-auto md:w-1/3 overflow-hidden">
            <img
              src={image}
              alt={`Portrait of ${name}`}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Info */}
          <div className="p-6 md:w-2/3">
            <h1 className="text-3xl font-bold text-green-400 mb-4">{name}</h1>
            <div className="space-y-2">
              <p><strong>Status:</strong> {status}</p>
              <p><strong>Species:</strong> {species}</p>
              <p><strong>Gender:</strong> {gender}</p>
              <p>
                <strong>Location:</strong>{" "}
                {location.url ? (
                  <Link
                    to={`/location/${location.url.split("/").pop()}`}
                    className="text-green-400 underline"
                  >
                    {location.name}
                  </Link>
                ) : (
                  <span>{location.name}</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Episodes */}
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-green-400 mb-4">Episodes</h2>
          {episode.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {episode.map((epUrl) => {
                const epId = epUrl.split("/").pop();
                return (
                  <Link
                    key={epId}
                    to={`/episode/${epId}`}
                    className="block w-full bg-green-500 text-black text-center px-4 py-2 rounded hover:bg-green-600 transition"
                  >
                    Episode {epId}
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-300">No episodes found.</p>
          )}
        </div>
      </div>
    </section>
  );
}
