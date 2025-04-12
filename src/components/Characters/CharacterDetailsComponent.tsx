import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import LoadingState from '../Loading/LoadingState';
import { CharacterDetails } from '../../types/characters';

export default function CharacterDetailsComponent() {
  //Getting the id from the URL (character/:id)
  const { id } = useParams();

  //Fetching the data after ataining the id
  const fetchCharacter = async (): Promise<CharacterDetails> => {
    const response = await axios.get(`https://rickandmortyapi.com/api/character/${id}`);
    return response.data;
  };

  /*
    Seting up react query for automatic fetching and refetching and cashing.
    Query key makes sure that we get the data based on the id.
    Query funtion fetches the data.
    Enabled option tells the query to run when  the id exists.
  */
  const { data, isLoading, isError } = useQuery<CharacterDetails, Error>({
    queryKey: ['character', id],
    queryFn: fetchCharacter,
    enabled: !!id, //The query will only run if the id is entered in the url
  });

  if (isLoading) return <LoadingState />;
  if (isError || !data)
    return <p className="text-center text-red-500">Error fetching character details.</p>;

  //Destructiring the data response
  const { image, name, status, species, gender, location, episode } = data;

  return (
    <section className="min-h-screen w-full bg-black px-6 py-8 text-white md:px-12 lg:px-20">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-xl bg-gray-900 shadow-lg">
        {/* Character Header */}
        <div className="md:flex">
          {/* Image */}
          <div className="h-80 overflow-hidden rounded-xl md:h-auto md:w-1/3">
            <img src={image} alt={`Portrait of ${name}`} className="h-full w-full object-cover" />
          </div>

          {/* Info */}
          <div className="p-6 md:w-2/3">
            <h1 className="mb-4 text-3xl font-bold text-green-400">{name}</h1>
            <div className="space-y-2">
              <p>
                <strong>Status:</strong> {status}
              </p>
              <p>
                <strong>Species:</strong> {species}
              </p>
              <p>
                <strong>Gender:</strong> {gender}
              </p>
              <p>
                <strong>Location:</strong>{' '}
                {location.url ? (
                  /*
                  Split up the location url to look like this:
                  ["https:", "", "rickandmortyapi.com", "api", "location", "20"]
                  Then pop() returns the last part of the array which is 20 in this example
                  */
                  <Link
                    to={`/location/${location.url.split('/').pop()}`}
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
          <h2 className="mb-4 text-2xl font-semibold text-green-400">Episodes</h2>
          {episode.length > 0 ? (
            <div className="grid grid-cols-3 gap-3 md:grid-cols-4">
              {episode.map((epUrl) => {
                /*
                  Split up the episode url to look like this:
                  ["https:", "", "rickandmortyapi.com", "api", "episode", "1"]
                  Then pop() returns the last part of the array which is 1 in this example
                  */

                const epId = epUrl.split('/').pop();
                return (
                  <Link
                    key={epId}
                    to={`/episode/${epId}`}
                    className="block w-full rounded bg-green-500 px-4 py-2 text-center text-black transition hover:bg-green-600"
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
