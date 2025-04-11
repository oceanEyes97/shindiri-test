export interface Character {
  id: number;
  name: string;
  image: string;
  status: string;
  species: string;
  gender: string;
}
export interface CharactersAPIResponse {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: Character[];
}

export interface CharacterDetails {
  id: number;
  name: string;
  status: string;
  species: string;
  gender: string;
  image: string;
  location: {
    name: string;
    url: string;
  };
  episode: string[];
}
