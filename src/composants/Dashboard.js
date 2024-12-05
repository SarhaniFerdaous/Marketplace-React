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
  const [weeklySalesChartData, setWeeklySalesChartData] = useState({
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Weekly Sales (Products Sold)',
        data: [0, 0, 0, 0],
        backgroundColor: '#36A2EB',
      },
    ],
  });

  const [userProductData, setUserProductData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Products Added by Users',
        data: [],
        backgroundColor: '#FF6384',
      },
    ],
  });

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
      const weeklySalesData = { 1: 0, 2: 0, 3: 0, 4: 0 };
      const productTypeCounts = {};

      ventesSnapshot.forEach((doc) => {
        const data = doc.data();
        const saleDate = data.date ? new Date(data.date.seconds * 1000) : null; // Firestore timestamps
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
          const weekNumber = Math.ceil((saleDate.getDate() - 1) / 7); // Calculate week of the month
          weeklySalesData[weekNumber] += data.quantity || 0;
          if (getWeek(saleDate) === currentWeek) {
            weeklySalesAmount += data.total || 0;
          }
        }
      });

      setSalesTotal(totalSales);
      setProductsBought(totalQuantity);
      setPaymentMethods({ delivery: deliveryCount, online: onlineCount });
      setWeeklySales(weeklySalesAmount);

      setWeeklySalesChartData({
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
          {
            label: 'Weekly Sales (Products Sold)',
            data: Object.values(weeklySalesData),
            backgroundColor: '#36A2EB',
          },
        ],
      });

      // Fetch products data
      const productsSnapshot = await getDocs(collection(db, 'products'));
      let chairGamerCount = 0,
        pcCount = 0,
        accessoriesCount = 0;

      const userProductCounts = {};
      const labels = [];
      const data = [];

      productsSnapshot.forEach((doc) => {
        const { productType, brand, name } = doc.data();
        if (productType === 'Chair Gamer') chairGamerCount++;
        if (productType === 'PC') pcCount++;
        if (productType === 'accessories') accessoriesCount++;

        // Count products added by users
        const key = `${name} - ${brand}`;
        userProductCounts[key] = (userProductCounts[key] || 0) + 1;
      });

      Object.entries(userProductCounts).forEach(([key, count]) => {
        labels.push(key);
        data.push(count);
      });

      setUserProductData({
        labels,
        datasets: [
          {
            label: 'Products Added by Users',
            data,
            backgroundColor: '#FF6384',
          },
        ],
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
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Visualise numbers</h1>

      {/* Cards Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
        <div style={cardStyle}>
          <h3>Total Sales</h3>
          <p style={cardDataStyle}>{salesTotal.toFixed(2)}TND</p>
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
          <p style={cardDataStyle}>{weeklySales.toFixed(2)}TND</p>
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
          <h3>Weekly Sales</h3>
          <Bar data={weeklySalesChartData} />
        </div>
        <div style={cardStyle}>
          <h3>Products Added by Users</h3>
          <Bar
            data={userProductData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

const cardStyle = {
  background: '#ffffff',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  padding: '20px',
  textAlign: 'center',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
};

const cardDataStyle = {
  fontSize: '28px',
  fontWeight: 'bold',
  color: '#2C3E50',
  marginTop: '10px',
};

const dashboardContainerStyle = {
  padding: '40px',
  fontFamily: 'Arial, sans-serif',
  backgroundColor: '#f5f7fa',
  minHeight: '100vh',
};

const cardsContainerStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '30px',
  marginBottom: '40px',
};

const chartsContainerStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
  gap: '40px',
};

const cardHoverStyle = {
  ':hover': {
    transform: 'scale(1.03)',
    boxShadow: '0 6px 10px rgba(0, 0, 0, 0.15)',
  },
};


export default Dashboard;
