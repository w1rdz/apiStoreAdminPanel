const {User,Product, Order} = require("./models/db");
const { Role } = require("./models/Role");
const jwt = require('jsonwebtoken');
const { secret } = require("./config");

const generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles
    };
    return jwt.sign(payload, secret, { expiresIn: '24h' });
};

class authController {
    async addUser(req, res) {
        try {
            const { username, email, password,roles} = req.body;
            const candidate = await User.findOne({ username, email });
            if (candidate) {
                return res.status(400).json({ message: "пользователь уже зарегистрирован" });
            }
            if(!roles){
                const userRole = new Role({ value:"USER" });
                const user = new User({ username, email, password, roles: [userRole.value] });
                user.save()
                return res.status(201).json({ message: "User created successfully" });
            }
            const userRole = new Role({ value:roles });
            const user = new User({ username, email, password, roles: [userRole.value] });
            await user.save();
            res.status(201).json({ message: "User created successfully" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Failed to create user" });
        }
    }

    async login(req, res) {
        try {
            const { username, password } = req.body;
            const user = await User.findOne({ username });
            if (!user) {
                return res.status(400).json({ message: `пользователь с именем ${username} не найден` });
            }
            if (user.password !== password) {
                return res.status(400).json({ message: "неверный пароль" });
            }
            const token = generateAccessToken(user._id, user.roles);
            return res.json({ token });
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: "Failed to login" });
        }
    }

    async getUsers(req, res) {
        try {
            const users = await User.find({});
            res.json(users);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async delUser(req,res){
        try {
            const userId = req.params.id;
            const user = await User.deleteOne({ _id: userId });;
            if (!user) {
                return res.status(404).json({ message: "Пользователь не найден" });
            }
            res.status(400).json({message:"пользователь успешно удален"})
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Ошибка сервера при удалении пользователя" });
        }
    }

    async resPass(req,res){
        try {
            const userId = req.params.id;
            const newPassword = req.body.newPassword;
            const user = await User.findByIdAndUpdate(userId, { password: newPassword });
    
            if (!user) {
                return res.status(404).json({ message: "Пользователь не найден" });
            }
            res.json({ message: "Пароль пользователя успешно обновлен" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Ошибка сервера при обновлении пароля пользователя" });
        }
    }

    async getProduct(req,res){
        try {
            const product = await Product.find({});
            res.json(product);
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async addProduct(req,res){
        try{
            const {name,description,price,category,image_url} = req.body;
            const newProduct = new Product({name,description,price,category,image_url})
            if(!newProduct){
                return res.status(400).json({message:"ошибка при добавлении продукта"})
            }
            res.status(200).json({message:"продукт успешно добавлен"})
            await newProduct.save()
        }catch(error){
            console.log(error)
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async getOneProduct(req,res) {
        try {
            const productId = req.params.id;
            const product = await Product.findOne({_id:productId})
            if(!product){
                res.status(400).json({message:"продукт не найден"})
            }
            res.json({product})
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async resProduct(req,res) {
        try {
            const productId = req.params.id;
            const {newName,newDescription,newPrice,newCategory,newImage_url} = req.body;
            const resProduct = await Product.findByIdAndUpdate(productId,{name:newName,description:newDescription,price:newPrice,category:newCategory,image_url:newImage_url})
            if(!resProduct) {
                res.status(400).json({message:"продукт не найден"})
            }
            res.status(200).json({message:"продукт успешно изменен"})
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async delProduct(req,res) {
        try {
        const productId = req.params.id;
        const delProduct = await Product.deleteOne({_id:productId})
        if(!delProduct){
            res.status(400).json({message:"продукт не найден"})
        }
        res.status(200).json({message:"продукт успешно удален"})
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async getOrder(req,res){
        try {
            const getOrder = await Order.find()
            res.json({getOrder})
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Internal server error" });
        }

    }

    async updateOrder(req,res){
       try {
        const orderId = req.params.id;
        const {newCustomer_name,newTotal_amount,newStatus} = req.body;
        const getOrder = await Order.findOneAndUpdate(orderId,{customer_name:newCustomer_name,total_amount:newTotal_amount,status:newStatus})
        if(!getOrder){
            res.status(400).json({message:"ордер не найден"})
        }
        res.json({getOrder})
       } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" });
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
                }
            ]);
            const statistics = {
                total_sales: totalSales,
                total_sales_amount: totalSalesAmount.length > 0 ? totalSalesAmount[0].totalAmount : 0,
                order_status_counts: orderStatusCounts.reduce((acc, curr) => {
                    acc[curr._id] = curr.count;
                    return acc;
                }, {})
            };
            
            res.json(statistics);
        } catch (error) {
            console.log(erorr)
            res.status(500).json({ message: "Internal server error" });
        }
    }

}

module.exports = new authController();
