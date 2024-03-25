const mongoose = require("mongoose");
const { Schema,model } = mongoose;
const {Role} = require("./Role");

// Схема пользователя
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password:{ type: String, required: true },
    role: { type: String, required: true,default:"USER"},
    active: { type: Boolean, default: true }
});

const User = mongoose.model('User', UserSchema);

// Схема продукта
const ProductSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    image_url: { type: String }
});

const Product = mongoose.model('Product', ProductSchema);

// Схема заказа
const OrderSchema = new mongoose.Schema({
    id: { type: Number, required: true },
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