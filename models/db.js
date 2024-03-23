const mongoose = require("mongoose");
const { Schema,model } = mongoose;
const {Role} = require("./Role");

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roles: [{ type:String, ref: 'Role' }]
});

const User = mongoose.model('User', userSchema);

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    image_url: { type: String }
});

const Product = mongoose.model('Product', ProductSchema);

const OrderSchema = new mongoose.Schema({
    customer_name: { type: String, required: true },
    total_amount: { type: Number, required: true },
    status: { type: String, required: true }
});

const Order = mongoose.model('Order', OrderSchema);

// Схема статистики
const StatisticsSchema = new mongoose.Schema({
    total_sales: { type: Number, required: true },
    total_sales_amount: { type: Number, required: true },
    sales_by_category: { type: Map, of: Number },
    orders_statuses: { type: Map, of: Number }
});

const Statistics = mongoose.model('Statistics', StatisticsSchema);

module.exports = {
    User,
    Product,
    Order,
    Statistics
};