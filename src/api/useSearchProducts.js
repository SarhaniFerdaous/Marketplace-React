import { useQuery } from "react-query";
import axios from "axios";

const fetchProducts = async (searchText) => {
  const productTypes = ["pc", "chair gamer", "ecran"];

  // Fetch products for all types
  const productPromises = productTypes.map((type) =>
    axios.get(`/api/products.controller`, { params: { type, search: searchText } })
  );

  // Wait for all requests to resolve
  const responses = await Promise.all(productPromises);

  // Combine all results
  return responses.flatMap((res) => res.data);
};

export const useSearchProducts = (searchText) => {
  return useQuery(["searchProducts", searchText], () => fetchProducts(searchText), {
    enabled: !!searchText, // Only fetch when there is a searchText
  });
};
