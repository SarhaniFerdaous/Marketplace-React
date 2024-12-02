import React, { useState } from "react";
import ProductList from "./ProductList";

const Categories = () => {
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  return (
    <div>
      {/* ProductList for different categories */}
      <ProductList productType={selectedCategory} searchText={searchText} />
    </div>
  );
};

export default Categories;
