import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../config/axiosInstance";

function SearchResultsPage() {
  const { query } = useParams();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) return;

    const fetchSearchResults = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axiosInstance.get(
          `/menuitem/search?query=${query}&searchBy=name,restaurant,description`
        );
        setSearchResults(response.data.data);
      } catch (err) {
        console.error("Error fetching search results:", err);
        setError(err.response?.data?.message || "Error fetching results");
      }

      setLoading(false);
    };

    fetchSearchResults();
  }, [query]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (searchResults.length === 0)
    return <p>No results found for &quot;{query}&quot;</p>;

  return (
    <div className="search-results p-4">
      <h2 className="text-2xl font-bold">
        Search Results for &quot;{query}&quot;
      </h2>
      {searchResults.map((item) => (
        <div key={item._id} className="bg-gray-100 p-4 rounded-md mb-2">
          <p>
            <strong>{item.name}</strong> - {item.restaurant} <br />
            <span className="text-sm text-gray-600">
              {item.description.slice(0, 60)}...
            </span>
          </p>
        </div>
      ))}
    </div>
  );
}

export default SearchResultsPage;
