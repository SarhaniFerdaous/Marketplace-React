import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { format, isValid, getWeek } from 'date-fns';
import { Bar, Doughnut } from 'react-chartjs-2';

import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [salesTotal, setSalesTotal] = useState(0);
  const [productsBought, setProductsBought] = useState(0);
  const [paymentMethods, setPaymentMethods] = useState({ delivery: 0, online: 0 });
  const [weeklySales, setWeeklySales] = useState(0);
  const [productTypes, setProductTypes] = useState({ chairGamer: 0, pc: 0, accessories: 0 });
  const [userCount, setUserCount] = useState(0);

  const db = getFirestore();
  const currentWeek = getWeek(new Date());

  useEffect(() => {
    const fetchData = async () => {
      // Fetch ventes data
      const ventesSnapshot = await getDocs(collection(db, 'ventes'));
      let totalSales = 0,
        totalQuantity = 0,
        deliveryCount = 0,
        onlineCount = 0,
        weeklySalesAmount = 0;

      const productTypeCounts = {};

      ventesSnapshot.forEach((doc) => {
        const data = doc.data();
        const saleDate = data.date ? new Date(data.date) : null;

        totalSales += data.total || 0;
        totalQuantity += data.quantity || 0;

        // Count payment methods
        if (data.paymentMethod === 'delivery') deliveryCount++;
        if (data.paymentMethod === 'online') onlineCount++;

        // Count product types
        const { productType } = data;
        if (productType) {
          productTypeCounts[productType] = (productTypeCounts[productType] || 0) + 1;
        }

        // Weekly sales calculation
        if (saleDate && isValid(saleDate)) {
          const saleWeek = getWeek(saleDate);
          if (saleWeek === currentWeek) {
            weeklySalesAmount += data.total || 0;
          }
        }
      });

      setSalesTotal(totalSales);
      setProductsBought(totalQuantity);
      setPaymentMethods({ delivery: deliveryCount, online: onlineCount });
      setWeeklySales(weeklySalesAmount);
      setProductTypes(productTypeCounts);

      // Fetch products data
      const productsSnapshot = await getDocs(collection(db, 'products'));
      let chairGamerCount = 0,
        pcCount = 0,
        accessoriesCount = 0;

      productsSnapshot.forEach((doc) => {
        const { productType } = doc.data();
        if (productType === 'Chair Gamer') chairGamerCount++;
        if (productType === 'PC') pcCount++;
        if (productType === 'accessories') accessoriesCount++;
      });

      setProductTypes({
        chairGamer: chairGamerCount,
        pc: pcCount,
        accessories: accessoriesCount,
      });

      // Fetch users data
      const usersSnapshot = await getDocs(collection(db, 'users'));
      setUserCount(usersSnapshot.size);
    };

    fetchData();
  }, [db, currentWeek]);

  // Chart Data for Product Types
  const productData = {
    labels: ['Chair Gamer', 'PC', 'Accessories'],
    datasets: [
      {
        label: 'Products Sold',
        data: [productTypes.chairGamer, productTypes.pc, productTypes.accessories],
        backgroundColor: ['#FFCE56', '#36A2EB', '#FF6384'],
      },
    ],
  };

  // Chart Data for Weekly Sales
  const weeklySalesData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], // Replace with dynamic week labels if needed
    datasets: [
      {
        label: 'Weekly Sales ($)',
        data: [500, 1200, 900, weeklySales], // Example data; replace as needed
        backgroundColor: '#36A2EB',
      },
    ],
  };

  // Chart Data for Payment Methods
  const paymentData = {
    labels: ['Delivery', 'Online'],
    datasets: [
      {
        data: [paymentMethods.delivery, paymentMethods.online],
        backgroundColor: ['#FF6384', '#36A2EB'],
      },
    ],
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f9fafb' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Marketplace Dashboard</h1>

      {/* Cards Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
        <div style={cardStyle}>
          <h3>Total Sales</h3>
          <p style={cardDataStyle}>${salesTotal.toFixed(2)}</p>
        </div>
        <div style={cardStyle}>
          <h3>Total Users</h3>
          <p style={cardDataStyle}>{userCount}</p>
        </div>
        <div style={cardStyle}>
          <h3>Total Products Bought</h3>
          <p style={cardDataStyle}>{productsBought}</p>
        </div>
        <div style={cardStyle}>
          <h3>Sales This Week</h3>
          <p style={cardDataStyle}>${weeklySales.toFixed(2)}</p>
        </div>
        <div style={cardStyle}>
          <h3>Payment by Delivery</h3>
          <p style={cardDataStyle}>{paymentMethods.delivery}</p>
        </div>
        <div style={cardStyle}>
          <h3>Payment by Online</h3>
          <p style={cardDataStyle}>{paymentMethods.online}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        <div style={cardStyle}>
          <h3>Payment Methods</h3>
          <Doughnut data={paymentData} />
        </div>
        <div style={cardStyle}>
          <h3>Product Types</h3>
          <Bar data={productData} />
        </div>
        <div style={cardStyle}>
          <h3>Sales on Every Week</h3>
          <Bar data={weeklySalesData} />
        </div>
      </div>
    </div>
  );
};

const cardStyle = {
  background: '#ffffff',
  borderRadius: '8px',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  padding: '20px',
  textAlign: 'center',
};

const cardDataStyle = {
  fontSize: '24px',
  fontWeight: 'bold',
  marginTop: '10px',
};

export default Dashboard;
