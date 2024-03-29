const {User,Product, Order} = require("./models/db");
const { Role } = require("./models/Role");
const jwt = require('jsonwebtoken');
const { secret } = require("./config");

const generateAccessToken = (id) => {
    const payload = {
        id
    };
    return jwt.sign(payload, secret, { expiresIn: '24h' });
};

class authController {
    async addUser(req, res) {
        try {
            const {username, email,role, password} = req.body;
            const candidate = await User.findOne({username, email });
            if (candidate) {
                return res.status(400).json({ message: "Bad Request",code:400 });
            }
            const user = new User({username, email,role, password,});
            await user.save();
            return res.status(201).send()
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: "Bad Request",code:400});
        }
    }

    async login(req, res) {
        try {
            const userId = req.params.id
            const { username, password } = req.body;
            const user = await User.findOne({ username });
            if(!username){
                res.status(400).json({ message: "Failed to login",code:400});
            }
            const token = generateAccessToken(user.userId);
            return res.json({ token });
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: "Failed to login",code:400});
        }
    }

    async getUsers(req, res) {
        try {
            const users = await User.find({});
            res.json(users.map(user => {
                return {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    active: user.active
                };
            }));
        } catch (error) {
            console.log(error);
            res.status(403).json({ message: "Forbidden",code:403 });
        }
    }

    async delUser(req, res) {
        try {
            const userId = req.params.id;
            const user = await User.findByIdAndDelete(userId);
            if (!user) {
                return res.status(404).json({ message: "Forbidden",code:404 });
            }
            return res.status(204).send()
        } catch (error) {
            console.log(error);
            return res.status(403).json({ message: "Forbidden" ,code:403});
        }
    }

    async resPass(req,res){
        try {
            const userId = req.params.id;
            const {password} = req.body;
            const user = await User.findByIdAndUpdate(userId, { password: password });
            if (!user) {
                return res.status(400).json({ message: "Bad Request",code:400 });
            }
            res.status(200).send()
        } catch (error) {
            console.log(error);
            res.status(403).json({ message: "Forbidden" ,code:403});
        }
    }

    async getProduct(req,res){
        try {
            const products = await Product.find({});
            res.json(products.map(product => {
                return {
                    id: product._id,
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    category: product.category,
                    image_url: product.image_url
                };
            }));
        } catch (error) {
            console.log(error)
            res.status(403).json({ message: "Forbidden",code:403 });
        }
    }

    async addProduct(req,res){
        try{
            const {name,description,price,category,image_url} = req.body;
            const newProduct = new Product({name,description,price,category,image_url})
            if(!newProduct){
                return res.status(400).json({message:"Bad Request",code:400})
            }
            res.status(201).send()
            await newProduct.save()

            
        }catch(error){
            console.log(error)
            return res.status(400).json({message:"Bad Request",code:400})
        }
    }

    async getOneProduct(req,res) {
        try {
            const productId = req.params.id;
            const product = await Product.findById(productId)
            if(!product){
                res.status(403).json({message:"Forbidden",code:403})
            }
            res.json({product})
        } catch (error) {
            console.log(error)
            res.status(403).json({message:"Forbidden",code:403})
        }
    }

    async resProduct(req,res) {
        try {
            const productId = req.params.id;
            const {name,description,price,category,image_url} = req.body;
            const resProduct = await Product.findByIdAndUpdate(productId,{name:name,description:description,price:price,category:category,image_url:image_url})
            if(!resProduct) {
                res.status(400).json({message:"Bad Request",code:400})
            }
            res.status(200).send()
        } catch (error) {
            console.log(error)
            res.status(403).json({ message: "Forbidden",code:403 });
        }
    }

    async delProduct(req,res) {
        try {
        const productId = req.params.id;
        const delProduct = await Product.findByIdAndDelete(productId)
        if(!delProduct){
            res.status(403).json({ message: "Forbidden",code:403 })
        }
        res.status(204).send()
        } catch (error) {
            console.log(error)
            res.status(403).json({ message: "Forbidden",code:403 });
        }
    }

    async getOrder(req,res){
        try {
            const getOrders = await Order.find()
            res.json(getOrders.map(getOrder => {
                return {
                    id: getOrder._id,
                    customer_name: getOrder.customer_name,
                    total_amount: getOrder.total_amount,
                    status: getOrder.status,
                };
            }));
        } catch (error) {
            console.log(error)
            res.status(403).json({ message: "Forbidden",code:403});
        }

    }

    async updateOrder(req,res){
       try {
        const orderId = req.params.id;
        const {status} = req.body;
        const getOrder = await Order.findByIdAndUpdate(orderId,{status:status})
        if(!getOrder){
            res.status(400).json({message:"Bad request",code:400})
        }
        res.status(200).send()
       } catch (error) {
        console.log(error)
        res.status(403).json({ message: "Forbidden",code:403});
       }
        
    }

    async getStat(req,res){
        try {
            const totalSales = await Order.countDocuments();
            const totalSalesAmount = await Order.aggregate([
                {
                    $group: {
                        _id: null,
                        totalAmount: { $sum: { $toDouble: "$total_amount" } }
                    }
                }
            ]);
            
            const orderStatusCounts = await Order.aggregate([
                {
                    $group: {
                        _id: "$status",
                        count: { $sum: 1 }
                    }
                },
            ]);
            const orderCategoryCounts = await Order.aggregate([
                {
                    $group: {
                        _id: "$category",
                        count: { $sum: 1 }
                    }
                },
            ]);
            const statistics = {
                total_sales: totalSales,
                total_sales_amount: totalSalesAmount.length > 0 ? totalSalesAmount[0].totalAmount : 0,
                sales_by_category: orderCategoryCounts.reduce((acc, curr) => {
                    acc[curr._id] = curr.count;
                    return acc;
                }, {}),
                order_statuses: orderStatusCounts.reduce((acc, curr) => {
                    acc[curr._id] = curr.count;
                    return acc;
                }, {})
            };
            
            res.json(statistics);
        } catch (error) {
            console.log(error)
            res.status(403).json({ message: "Forbidden",code:403 });
        }
    }

}

module.exports = new authController();
