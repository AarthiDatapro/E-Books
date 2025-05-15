import productModel from "../models/productModel.js";
import orderModel from "../models/ordersModel.js";
import userModel from "../models/userModel.js";

export const productUpload = async (req, res, next) => {
  try {

    const {
      bookName,
      description,
      category,
      subCategory,
      author,
      price,
    } = req.body;

    if (!req.files || !req.files.bookImage || !req.files.bookPdf) {
      return res.status(400).json({ message: "Please upload both image and PDF" });
    }

    const bookImage = req.files.bookImage[0];
    const bookPdf = req.files.bookPdf[0];



    const newProduct = await productModel.create({
      bookName,
      description,
      category,
      subCategory,
      author,
      price,
      bookImage: bookImage.filename,
      bookPdf: bookPdf.filename,
    });


    return res.json({
      status: true,
      msg: "Product uploaded Successfully!",
      product: newProduct,
    });
  } catch (err) {
    console.error("Error adding product:", err);
    return res.status(500).json({
      status: false,
      msg: "Error adding product",
      error: err.message
    });
  }
};

export const getMyProducts = async (req, res, next) => {
  try {
    const products = await productModel.find({});

    return res.json({
      status: true,
      msg: "Products retrieved successfully!",
      products: products,
    });
  } catch (err) {
    console.error("Error retrieving products:", err);
    return res.status(500).json({
      status: false,
      msg: "Failed to retrieve products!",
      error: err.message
    });
  }
};

export const editProduct = async (req, res, next) => {
  try {
    const {
      bookName,
      description,
      category,
      subCategory,
      author,
      price,
      productId,
    } = req.body;

    // Find the product by ID
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ status: false, msg: "Product not found!" });
    }

    // Update the product fields
    product.bookName = bookName;
    product.description = description;
    product.category = category;
    product.subCategory = subCategory;
    product.author = author;
    product.price = price;

    if (req.files) {
      if (req.files.bookImage) {
        product.bookImage = req.files.bookImage[0].filename;
      }
      if (req.files.bookPdf) {
        product.bookPdf = req.files.bookPdf[0].filename;
      }
    }

    // Save the updated product
    await product.save();

    return res.json({
      status: true,
      msg: "Product updated successfully!",
      product: product,
    });
  } catch (err) {
    console.error("Error editing product:", err);
    return res.status(500).json({
      status: false,
      msg: "Error editing product",
      error: err.message
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await productModel.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ status: false, msg: "Product not found" });
    }
    res.status(200).json({ status: true, msg: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ status: false, msg: "Server error" });
  }
}

export const getSalesAnalytics = async (req, res) => {
  try {
    const { timeRange } = req.query;

    const now = new Date();
    let startDate;

    // Calculate start date based on timeRange
    switch (timeRange) {
      case 'hour':
        startDate = new Date(now.setHours(now.getHours() - 24));
        break;
      case 'day':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 12));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 5));
        break;
      default:
        startDate = new Date(now.setDate(now.getDate() - 7));
    }

    // First, let's check if we have any orders
    const totalOrders = await orderModel.countDocuments();

    // Aggregate sales data
    const salesData = await orderModel.aggregate([
      {
        $match: {
          paidAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: timeRange === 'hour' ? '%H:00' :
                timeRange === 'day' ? '%Y-%m-%d' :
                  timeRange === 'month' ? '%Y-%m' : '%Y',
              date: '$paidAt'
            }
          },
          totalSales: { $sum: { $toDouble: '$product.price' } }, // Convert price to number
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ]);

    // Format data for charts
    const formattedData = {
      labels: salesData.map(item => item._id),
      datasets: [
        {
          label: 'Sales',
          data: salesData.map(item => item.totalSales),
          borderColor: '#8884d8',
          backgroundColor: '#8884d8',
          tension: 0.4,
        },
        {
          label: 'Number of Orders',
          data: salesData.map(item => item.count),
          borderColor: '#82ca9d',
          backgroundColor: '#82ca9d',
          tension: 0.4,
        }
      ]
    };

    // Get referral statistics
    const referralStats = await orderModel.aggregate([
      {
        $match: {
          paidAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$referal',
          totalSales: { $sum: { $toDouble: '$product.price' } }, // Convert price to number
          count: { $sum: 1 }
        }
      }
    ]);

    return res.json({
      status: true,
      msg: "Sales analytics retrieved successfully",
      data: formattedData,
      referralStats,
      debug: {
        totalOrders,
        startDate,
        timeRange
      }
    });
  } catch (error) {
    console.error("Error getting sales analytics:", error);
    return res.status(500).json({
      status: false,
      msg: "Error retrieving sales analytics",
      error: error.message
    });
  }
};



export const getAffiliators = async (req, res) => {
  const affiles = await userModel.find({ role: "AFFILIATOR" });
  if (affiles.length > 0) {
    return res.status(200).json({
      status: true,
      msg: "Affiliators retrieved successfully",
      affiles: affiles,
    });
  } else {
    return res.status(404).json({
      status: false,
      msg: "No Affiliators found",
    });
  }
}


export const deleteAffiliator = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAffiliator = await userModel.findByIdAndDelete(id);
    if (!deletedAffiliator) {
      return res.status(404).json({ status: false, msg: "Affiliator not found" });
    }
    res.status(200).json({ status: true, msg: "Affiliator deleted successfully" });
  } catch (err) {
    res.status(500).json({ status: false, msg: "Server error" });
  }
}


export const updateAffiliator = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, phoneNumber } = req.body;

    // Find the affiliator by ID
    const affiliator = await userModel.findById(id);
    if (!affiliator) {
      return res.status(404).json({ status: false, msg: "Affiliator not found" });
    }
    // Update the fields
    if (name) affiliator.username = name;
    if (email) affiliator.email = email;
    if (password) affiliator.password = password;
    if (phoneNumber) affiliator.phoneNumber = phoneNumber;
    // Save the updated affiliator
    await affiliator.save();
    return res.json({
      status: true,
      msg: "Affiliator updated successfully!",
      affiliator: affiliator,
    });
  }
  catch (err) {
    console.error("Error updating affiliator:", err);
    return res.status(500).json({
      status: false,
      msg: "Error updating affiliator",
      error: err.message
    });
  }
}


export const resetCommissions = async (req, res) => {
  try {
    const updatedAffiliators = await userModel.updateMany(
      { role: "AFFILIATOR" },
      { $set: { commission: 0 } }
    );

    return res.json({
      status: true,
      msg: "Commissions reset successfully!",
      updatedCount: updatedAffiliators.nModified,
    });
  } catch (err) {
    console.error("Error resetting commissions:", err);
    return res.status(500).json({
      status: false,
      msg: "Error resetting commissions",
      error: err.message
    });
  }
}