import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { affileAnalyticsRoute, affileDetailsRoute, secretKey } from '../../utils/APIRoutes';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Line,
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const COMMISSION_RATE = 0.6; // 60% commission

function AffiliatorLanding() {
  const navigate = useNavigate();
  const bookShopCurrentUser = JSON.parse(localStorage.getItem("bookShopCurrentUser"));
  const affileMail = bookShopCurrentUser?.email;

  const [loading, setLoading] = useState(true);
  const [affileDetails, setAffileDetails] = useState(null);
  const [timeRange, setTimeRange] = useState('month');
  const [salesData, setSalesData] = useState({ labels: [], datasets: [] });
  const [orders, setOrders] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalCommission: 0,
  });

  // Redirect unauthenticated users
  useEffect(() => {
    if (!bookShopCurrentUser) {
      navigate("/");
    }
  }, [navigate, bookShopCurrentUser]);

  // Fetch affiliate data
  useEffect(() => {
    const fetchAffiliateData = async () => {
      setLoading(true);
      try {
        const [detailsRes, analyticsRes] = await Promise.all([
          axios.post(affileDetailsRoute, { email: affileMail }, {
            headers: {
              "api-key": secretKey
            }
          }),
          axios.get(affileAnalyticsRoute, {
            params: { email: affileMail, timeRange },
            headers: {
              "api-key": secretKey
            }
          }),
        ]);

        if (detailsRes.data.status) setAffileDetails(detailsRes.data.details);
        if (analyticsRes.data.status) {
          setSalesData(analyticsRes.data.data);
          setOrders(analyticsRes.data.orders);
          setMonthlyStats(analyticsRes.data.monthlyStats);
        }
      } catch (error) {
        console.error("Error fetching affiliate data:", error);
      }
      setLoading(false);
    };

    if (affileMail) fetchAffiliateData();
  }, [affileMail, timeRange]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f4f6f8">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
      <Typography variant="h4" fontWeight={600} color="#333" mb={3}>
        Affiliate Dashboard
      </Typography>

      {/* Welcome Card */}
      <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 2 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={500} color="primary" gutterBottom>
            Welcome, {affileDetails?.username}
          </Typography>
          <Typography color="textSecondary">
            Your Referral Code: <strong>{affileDetails?.shortKey}</strong>
          </Typography>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Time Range Selector */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Time Range</InputLabel>
            <Select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} label="Time Range">
              <MenuItem value="week">Last Week</MenuItem>
              <MenuItem value="month">Last Month</MenuItem>
              <MenuItem value="year">Last Year</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Stat Cards */}
        {[
          { label: 'Total Sales', value: `₹${monthlyStats.totalSales.toLocaleString()}`, color: '#2e7d32' },
          { label: 'Total Orders', value: monthlyStats.totalOrders, color: '#0288d1' },
          { label: 'Commission Earned', value: `₹${monthlyStats.totalCommission.toLocaleString()}`, color: '#6a1b9a' }
        ].map((stat, idx) => (
          <Grid item xs={12} md={4} key={idx}>
            <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>{stat.label}</Typography>
                <Typography variant="h5" fontWeight={600} sx={{ color: stat.color }}>
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Sales Chart */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" color="#37474f" fontWeight={600} mb={2}>
                Sales Trend
              </Typography>
              <Line
                data={salesData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'top' },
                    title: {
                      display: true,
                      text: 'Sales Over Time',
                      color: '#333',
                      font: { size: 18 }
                    }
                  },
                  scales: {
                    x: { ticks: { color: '#666' } },
                    y: { ticks: { color: '#666' } },
                  }
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Orders Table */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" color="#37474f" fontWeight={600} gutterBottom>
                Recent Orders
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Order ID</TableCell>
                      <TableCell>Product</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell align="right">Commission</TableCell>
                      <TableCell>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders.map(order => (
                      <TableRow key={order._id}>
                        <TableCell>{order.orderId}</TableCell>
                        <TableCell>{order.product.bookName}</TableCell>
                        <TableCell align="right">₹{order.product.price.toLocaleString()}</TableCell>
                        <TableCell align="right">₹{(order.product.price * COMMISSION_RATE).toLocaleString()}</TableCell>
                        <TableCell>{format(new Date(order.paidAt), 'dd/MM/yyyy')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AffiliatorLanding;
