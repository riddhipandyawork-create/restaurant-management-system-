const Order = require('../models/Order');
const User = require('../models/User');

exports.getDishChefAnalysis = async (req, res) => {
  try {
    // Analyze which chef prepares which dish fastest
    const analysis = await Order.aggregate([
      { $match: { status: 'served', chefId: { $exists: true } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: { chef: '$chefId', dish: '$items.menuItem' },
          avgPrepTime: { $avg: { $subtract: ['$updatedAt', '$createdAt'] } },
          totalPrepared: { $sum: '$items.quantity' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id.chef',
          foreignField: '_id',
          as: 'chefDetails'
        }
      },
      {
        $lookup: {
          from: 'menuitems',
          localField: '_id.dish',
          foreignField: '_id',
          as: 'dishDetails'
        }
      },
      { $unwind: '$chefDetails' },
      { $unwind: '$dishDetails' },
      {
        $project: {
          _id: 0,
          chefName: '$chefDetails.name',
          dishName: '$dishDetails.name',
          avgPrepTimeMinutes: { $divide: ['$avgPrepTime', 60000] },
          totalPrepared: 1
        }
      },
      { $sort: { avgPrepTimeMinutes: 1 } }
    ]);
    res.json(analysis);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getStarChef = async (req, res) => {
  try {
    // Recommend star chef based on volume and speed
    const starChefs = await Order.aggregate([
      { $match: { status: 'served', chefId: { $exists: true } } },
      {
        $group: {
          _id: '$chefId',
          totalOrders: { $sum: 1 },
          avgCompletionTime: { $avg: { $subtract: ['$updatedAt', '$createdAt'] } }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'chef'
        }
      },
      { $unwind: '$chef' },
      {
        $project: {
          chefName: '$chef.name',
          totalOrders: 1,
          avgCompletionTimeMinutes: { $divide: ['$avgCompletionTime', 60000] }
        }
      },
      // Score = totalOrders / avgCompletionTimeMinutes
      {
        $addFields: {
          score: { $divide: ['$totalOrders', { $max: ['$avgCompletionTimeMinutes', 1] }] }
        }
      },
      { $sort: { score: -1 } },
      { $limit: 3 }
    ]);
    res.json(starChefs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getForecasting = async (req, res) => {
  try {
    // Simple moving average forecast based on last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const dailyData = await Order.aggregate([
      { $match: { status: 'billed', createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$total' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Calculate 7-day moving average
    const forecast = dailyData.map((day, index, arr) => {
      let sumRev = 0;
      let count = 0;
      for (let i = Math.max(0, index - 6); i <= index; i++) {
        sumRev += arr[i].revenue;
        count++;
      }
      return {
        date: day._id,
        actualRevenue: day.revenue,
        trendForecast: sumRev / count
      };
    });

    res.json(forecast);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
