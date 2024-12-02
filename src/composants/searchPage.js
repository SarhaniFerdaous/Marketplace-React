import React from "react";
import { useSearchProducts } from "../composants/useSearchProducts"; 
import { useLocation } from "react-router-dom";
import ProductCard from "../components/ProductCard"; // Assume you have a ProductCard component for display

const SearchPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchText = queryParams.get("search") || ""; // Get the search query from the URL

  const { data: products, isLoading, isError } = useSearchProducts(searchText);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error fetching products.</p>;

  return (
    <div className="search-page">
      <h2>Search Results for: "{searchText}"</h2>
      <div className="product-grid">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p>No products found for your search.</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
