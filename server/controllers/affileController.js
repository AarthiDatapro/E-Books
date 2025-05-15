import shortUrlModel from "../models/shortUrlModel.js";
import { startOfDay, endOfDay, subDays, subMonths, subYears } from 'date-fns';
import orderModel from "../models/ordersModel.js";
import messageModel from "../models/messageModel.js";
import userModel from "../models/userModel.js";

export const affileDetails = async (req, res) => {
    try {
        const email = req.body.email;
        const affile = await shortUrlModel.findOne({ email: email });
        if (!affile) {
            return res.status(404).json({ status: false, message: "Affile not found" });
        }
        res.status(200).json({ status: true, details: affile });
    } catch (error) {
        console.error("Error fetching affile details:", error);
        res.status(500).json({ status: false, message: "Internal server error" });
    }
}

export const getAffiliateAnalytics = async (req, res) => {
    try {
        const { email, timeRange } = req.query;

        if (!email) {
            return res.status(400).json({
                status: false,
                message: 'Email is required'
            });
        }

        // Get affiliate details first to get the referral code
        const affiliate = await shortUrlModel.findOne({ email });
        if (!affiliate) {
            return res.status(404).json({
                status: false,
                message: 'Affiliate not found'
            });
        }

        const referralCode = affiliate.shortKey;

        // Calculate date range based on timeRange
        let startDate;
        const endDate = new Date();

        switch (timeRange) {
            case 'week':
                startDate = subDays(endDate, 7);
                break;
            case 'month':
                startDate = subMonths(endDate, 1);
                break;
            case 'year':
                startDate = subYears(endDate, 1);
                break;
            default:
                startDate = subMonths(endDate, 1);
        }

        // Fetch orders for the affiliate using referral code
        const orders = await orderModel.find({
            referal: referralCode,
            paidAt: {
                $gte: startDate,
                $lte: endDate
            }
        }).sort({ paidAt: -1 });

        // Calculate statistics
        const totalSales = orders.reduce((sum, order) => sum + order.product.price, 0);
        const totalOrders = orders.length;
        const totalCommission = totalSales * 0.6; // 60% commission


        const userCommision = await userModel.findOne({ email: email });
        if (!userCommision) {
            return res.status(404).json({
                status: false,
                message: 'User not found'
            });
        }
        userCommision.commission += totalCommission;
        await userCommision.save();

        // Prepare data for charts
        const salesData = {
            labels: [],
            datasets: [
                {
                    label: 'Sales',
                    data: [],
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }
            ]
        };

        // Group orders by date
        const ordersByDate = {};
        orders.forEach(order => {
            const date = order.paidAt.toISOString().split('T')[0];
            if (!ordersByDate[date]) {
                ordersByDate[date] = 0;
            }
            ordersByDate[date] += order.product.price;
        });

        // Sort dates and prepare chart data
        const sortedDates = Object.keys(ordersByDate).sort();
        salesData.labels = sortedDates;
        salesData.datasets[0].data = sortedDates.map(date => ordersByDate[date]);

        res.json({
            status: true,
            data: salesData,
            orders,
            monthlyStats: {
                totalSales,
                totalOrders,
                totalCommission: userCommision.commission
            }
        });

    } catch (error) {
        console.error('Error fetching affiliate analytics:', error);
        res.status(500).json({
            status: false,
            message: 'Error fetching affiliate analytics'
        });
    }
}

export const getAffiliateStats = async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({
                status: false,
                message: 'Email is required'
            });
        }

        // Get affiliate details first to get the referral code
        const affiliate = await shortUrlModel.findOne({ email });
        if (!affiliate) {
            return res.status(404).json({
                status: false,
                message: 'Affiliate not found'
            });
        }

        const referralCode = affiliate.shortUrl;

        // Get total lifetime stats
        const totalOrders = await orderModel.countDocuments({ referralCode });
        const orders = await orderModel.find({ referralCode });

        const totalSales = orders.reduce((sum, order) => sum + order.product.price, 0);
        const totalCommission = totalSales * 0.02;

        // Get monthly stats
        const lastMonthStart = subMonths(new Date(), 1);
        const lastMonthOrders = await orderModel.find({
            referal: referralCode,
            paidAt: { $gte: lastMonthStart }
        });

        const monthlySales = lastMonthOrders.reduce((sum, order) => sum + order.product.price, 0);
        const monthlyCommission = monthlySales * 0.02;

        res.json({
            status: true,
            stats: {
                lifetime: {
                    totalOrders,
                    totalSales,
                    totalCommission
                },
                monthly: {
                    orders: lastMonthOrders.length,
                    sales: monthlySales,
                    commission: monthlyCommission
                }
            }
        });

    } catch (error) {
        console.error('Error fetching affiliate stats:', error);
        res.status(500).json({
            status: false,
            message: 'Error fetching affiliate stats'
        });
    }
}



export const getMessagesByRef = async (req, res) => {
    try {
        const { referal } = req.body;
        const messages = await messageModel.find({ referal: referal }).sort({ createdAt: -1 });
        res.json({ status: true, messages: messages });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: false, error: "Failed to fetch messages" });
    }
}




