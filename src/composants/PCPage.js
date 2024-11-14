import React from 'react';
import ProductList from '../composants/ProductList';

const PcPage = () => {
  return (
    <div>
      <h1>PC Products</h1>
      <ProductList productType="PC" />
    </div>
  );
};

export default PcPage;
