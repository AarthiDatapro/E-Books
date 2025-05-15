import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Tabs,
  Tab,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery
} from '@mui/material';
import {
  Line,
  Bar,
  Pie,
  Doughnut,
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';
import { salesAnalyticsRoute } from '../../utils/APIRoutes';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function AffileProfits() {
  const [timeRange, setTimeRange] = useState('day');
  const [viewType, setViewType] = useState('line');
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState({
    labels: [],
    datasets: [],
  });
  const [referralStats, setReferralStats] = useState([]);
  const [referralCode, setReferralCode] = useState('all');

  const isMobile = useMediaQuery('(max-width:600px)');

  const calculateSummaryStats = () => {
    if (referralCode === 'all') {
      return {
        totalSales: salesData.datasets[0]?.data.reduce((a, b) => a + b, 0) || 0,
        totalOrders: salesData.datasets[1]?.data.reduce((a, b) => a + b, 0) || 0
      };
    } else {
      const selectedStat = referralStats.find(stat => stat._id === referralCode);
      return {
        totalSales: selectedStat?.totalSales || 0,
        totalOrders: selectedStat?.count || 0
      };
    }
  };

  const { totalSales, totalOrders } = calculateSummaryStats();
  const averageSale = totalOrders ? totalSales / totalOrders : 0;

  const fetchSalesData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(salesAnalyticsRoute, {
        params: { timeRange, referralCode }
      });
      if (response.data.status) {
        setSalesData(response.data.data);
        setReferralStats(response.data.referralStats);
      } else {
        console.error('API returned error:', response.data.msg);
      }
    } catch (error) {
      console.error('Error fetching sales data:', error.response || error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSalesData();
  }, [timeRange, referralCode]);

  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };

  const handleReferralCodeChange = (event) => {
    setReferralCode(event.target.value);
  };

  const handleViewTypeChange = (event, newValue) => {
    setViewType(newValue);
  };

  const renderChart = () => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
          <CircularProgress />
        </Box>
      );
    }

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: isMobile ? 'bottom' : 'top' },
        title: {
          display: true,
          text: `Sales Analysis - ${timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}ly View`,
        },
      },
    };

    const chartHeight = isMobile ? 300 : 450;

    switch (viewType) {
      case 'line':
        return <Box height={chartHeight}><Line data={salesData} options={chartOptions} /></Box>;
      case 'bar':
        return <Box height={chartHeight}><Bar data={salesData} options={chartOptions} /></Box>;
      case 'pie':
        return <Box height={chartHeight}><Pie data={salesData} options={chartOptions} /></Box>;
      case 'doughnut':
        return <Box height={chartHeight}><Doughnut data={salesData} options={chartOptions} /></Box>;
      default:
        return <Box height={chartHeight}><Line data={salesData} options={chartOptions} /></Box>;
    }
  };

  return (
    <Box sx={{ p: isMobile ? 1 : 3 }}>
      <Typography variant={isMobile ? 'h5' : 'h4'} gutterBottom>
        Sales Analysis Dashboard
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size={isMobile ? 'small' : 'medium'}>
            <InputLabel>Time Range</InputLabel>
            <Select value={timeRange} label="Time Range" onChange={handleTimeRangeChange}>
              <MenuItem value="hour">Hourly</MenuItem>
              <MenuItem value="day">Daily</MenuItem>
              <MenuItem value="month">Monthly</MenuItem>
              <MenuItem value="year">Yearly</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size={isMobile ? 'small' : 'medium'}>
            <InputLabel>Referral Code</InputLabel>
            <Select value={referralCode} label="Referral Code" onChange={handleReferralCodeChange}>
              <MenuItem value="all">All Referrals</MenuItem>
              {referralStats.map((stat) => (
                <MenuItem key={stat._id} value={stat._id}>{stat._id}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ mb: 2 }}>
            <Tabs
              value={viewType}
              onChange={handleViewTypeChange}
              variant={isMobile ? 'scrollable' : 'fullWidth'}
              scrollButtons={isMobile ? 'auto' : false}
              centered={!isMobile}
            >
              <Tab label="Line" value="line" />
              <Tab label="Bar" value="bar" />
              <Tab label="Pie" value="pie" />
              <Tab label="Doughnut" value="doughnut" />
            </Tabs>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              {renderChart()}
            </CardContent>
          </Card>
        </Grid>

        {/* Summary Cards */}
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Total Sales</Typography>
              <Typography variant="h6">₹{totalSales.toLocaleString()}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Total Orders</Typography>
              <Typography variant="h6">{totalOrders.toLocaleString()}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Average Sale</Typography>
              <Typography variant="h6">₹{averageSale.toFixed(2)}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Table */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Referral Statistics</Typography>
              <TableContainer>
                <Table size={isMobile ? 'small' : 'medium'}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Referral Code</TableCell>
                      <TableCell align="right">Total Sales</TableCell>
                      <TableCell align="right">Orders</TableCell>
                      <TableCell align="right">Avg Sale</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {referralStats.map((stat) => (
                      <TableRow key={stat._id}>
                        <TableCell>{stat._id}</TableCell>
                        <TableCell align="right">₹{stat.totalSales.toLocaleString()}</TableCell>
                        <TableCell align="right">{stat.count}</TableCell>
                        <TableCell align="right">₹{(stat.totalSales / stat.count).toFixed(2)}</TableCell>
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

export default AffileProfits;
