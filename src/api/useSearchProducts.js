import { useState, useEffect } from "react";
import { db } from "./firebase.config";
import { collection, query, where, getDocs } from "firebase/firestore";

export const useSearchProducts = (searchText) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setIsError(false);

      try {
        const productsRef = collection(db, "products");

        let q;
        if (searchText) {
         
          q = query(
            productsRef,
            where("searchKeywords", "array-contains", searchText.toLowerCase())
          );
        } else {
        
          q = query(productsRef);
        }

        const querySnapshot = await getDocs(q);
        const fetchedProducts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [searchText]);

  return { products, isLoading, isError };
};
