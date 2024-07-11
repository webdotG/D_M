import style from './Search.module.scss'; 

interface SearchResultProps {
  searchResults: {
    id: number;
    category: string;
    associations: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
  }[];
  onResultClick: (id: number) => void; 
}

function SearchResult({ searchResults, onResultClick }: SearchResultProps) {
 
  return (
    <ul className={style.searchResults}>
      {searchResults.map((result) => (
        <li 
            key={result.id} 
            className={style.searchResult} 
            onClick={() => onResultClick(result.id)}
        >
            <p>{result.title}</p>
            <p>{result.content}</p>
            <p>Category: {result.category}</p>
            <p>Created At: {result.createdAt}</p>
        </li>
      ))}
    </ul>
  );
}

export default SearchResult;
