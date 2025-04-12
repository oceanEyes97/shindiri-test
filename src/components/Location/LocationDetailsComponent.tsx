import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import LoadingState from '../Loading/LoadingState';
import { Character } from '../../types/characters';
import { LocationDetails } from '../../types/location';

export default function LocationDetailsComponent() {
  const { id } = useParams();

  // Fetch location info
  const fetchLocation = async (): Promise<LocationDetails> => {
    const response = await axios.get(`https://rickandmortyapi.com/api/location/${id}`);
    return response.data;
  };

  // Fetch characters by ID list
  const fetchCharacters = async (urls: string[]): Promise<Character[]> => {
    const ids = urls.map((url) => url.split('/').pop()).join(',');
    const response = await axios.get(`https://rickandmortyapi.com/api/character/${ids}`);
    return Array.isArray(response.data) ? response.data : [response.data];
  };
  /*
Destructiring data and setting up React Queries for location and residents relatied to it.
We first get the location which has a residents array with urls related to the location.
After that the second quiery 'location-characters' runs by calling the query funcion and passing the location resident data. 
The character fetch then maps over all the URLs and splits them accordingly to get the last part of the url in the iteration (/:id) then adds it to the new returned array. So that we get an array with all the id's of the residents to be mapped over in the UI. The enabled option makes sure that the queries only run if the id exists and the location residents exist.
*/
  const {
    data: location,
    isLoading: isLocationLoading,
    isError: isLocationError,
  } = useQuery<LocationDetails, Error>({
    queryKey: ['location', id],
    queryFn: fetchLocation,
    enabled: !!id,
  });

  const {
    data: residents,
    isLoading: isCharactersLoading,
    isError: isCharactersError,
  } = useQuery<Character[], Error>({
    queryKey: ['location-characters', id],
    queryFn: () => fetchCharacters(location?.residents || []),
    enabled: !!location?.residents?.length,
  });

  if (isLocationLoading || isCharactersLoading) return <LoadingState />;
  if (isLocationError || isCharactersError || !location)
    return <p className="text-center text-red-500">Error loading location data.</p>;

  return (
    <section className="min-h-screen w-full bg-black px-6 py-8 text-white md:px-12 lg:px-20">
      <div className="mx-auto mb-10 max-w-4xl rounded-xl bg-gray-900 p-6 shadow-lg">
        <h1 className="mb-4 text-3xl font-bold text-green-400">{location.name}</h1>
        <p>
          <strong>Type:</strong> {location.type}
        </p>
        <p>
          <strong>Dimension:</strong> {location.dimension}
        </p>
        <p>
          <strong>Residents:</strong> {location.residents.length}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {residents?.length === 0 && (
          <p className="col-span-full text-center text-gray-300">No residents found.</p>
        )}
        {/*If residents is null or undefined, use an empty array ([]) instead.  */}
        {(residents ?? []).map((character: Character) => (
          <Link key={character.id} to={`/characters/${character.id}`} className="block">
            <div className="flex h-96 cursor-pointer flex-col overflow-hidden rounded-xl bg-gray-900 shadow-lg transition-transform duration-200 hover:scale-105 hover:shadow-green-400/50">
              <div className="h-60 w-full overflow-hidden">
                <img
                  src={character.image}
                  alt={`Portrait of ${character.name}`}
                  className="h-full w-full object-cover"
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
