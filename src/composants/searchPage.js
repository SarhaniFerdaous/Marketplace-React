import React from "react";
import { useLocation } from "react-router-dom";
import { useSearchProducts } from "../api/useSearchProducts";
import ProductCard from "../composants/ProductCard";

const SearchPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchText = queryParams.get("search") || "";

  const { products, isLoading, isError } = useSearchProducts(searchText);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error fetching products. Please try again later.</p>;

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
