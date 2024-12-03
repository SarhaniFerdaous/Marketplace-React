import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, BarController, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';  // Importing Bar chart from react-chartjs-2
import ReactECharts from 'echarts-for-react';  // For ECharts component
import echarts from 'echarts';

// Registering required components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [userCount, setUserCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [userSex, setUserSex] = useState({ male: 0, female: 0, other: 0 });
  const [userProductData, setUserProductData] = useState([]); // Store user product count data

  const db = getFirestore();

  // Fetch data once on component mount
  useEffect(() => {
    const fetchData = async () => {
      // Fetch users and calculate user count and sex distribution
      const usersSnapshot = await getDocs(collection(db, 'users'));
      setUserCount(usersSnapshot.size);

      let maleCount = 0;
      let femaleCount = 0;
      let otherCount = 0;

      usersSnapshot.forEach((user) => {
        const userGender = user.data().gender; // Assuming gender data exists
        if (userGender === 'male') maleCount++;
        else if (userGender === 'female') femaleCount++;
        else otherCount++;
      });

      setUserSex({ male: maleCount, female: femaleCount, other: otherCount });

      // Fetch product data and calculate product usage by user
      const usersProductData = [];
      usersSnapshot.forEach((user) => {
        const userId = user.id;
        const products = user.data().products; // Assuming products field is an array of product IDs
        if (products) {
          usersProductData.push({ userId, productCount: products.length });
        }
      });

      setUserProductData(usersProductData);

      // Fetch products and orders data
      const productsSnapshot = await getDocs(collection(db, 'products'));
      setProductCount(productsSnapshot.size);

      const ordersSnapshot = await getDocs(collection(db, 'orders'));
      setOrderCount(ordersSnapshot.size);
    };

    fetchData();
  }, [db]);

  // Chart.js data for the user product count
  const chartData = {
    labels: userProductData.map((data) => data.userId),  // User IDs as the labels
    datasets: [
      {
        label: 'Number of Products Added',
        data: userProductData.map((data) => data.productCount), // Product count for each user
        backgroundColor: '#36A2EB',
      },
    ],
  };

  // ECharts pie chart for user sex distribution
  const sexDistributionOptions = {
    title: {
      text: 'User Sex Distribution',
      subtext: 'Based on User Data',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
    },
    series: [
      {
        name: 'Sex Distribution',
        type: 'pie',
        radius: '50%',
        data: [
          { value: userSex.male, name: 'Male' },
          { value: userSex.female, name: 'Female' },
          { value: userSex.other, name: 'Other' },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };

  return (
    <div className="dashboard" style={{ padding: '20px', backgroundColor: '#f9f9f9' }}>
      <h1 style={{ textAlign: 'center' }}>Admin Dashboard</h1>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        {/* Statistics Cards */}
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', width: '30%' }}>
          <h3>User Count</h3>
          <p>{userCount}</p>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', width: '30%' }}>
          <h3>Product Count</h3>
          <p>{productCount}</p>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', width: '30%' }}>
          <h3>Order Count</h3>
          <p>{orderCount}</p>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: '48%' }}>
          <h2>Number of Products Added by Each User</h2>
          <Bar data={chartData} options={{ responsive: true }} />
        </div>

        <div style={{ width: '48%' }}>
          <h2>Gender Distribution</h2>
          <ReactECharts option={sexDistributionOptions} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
