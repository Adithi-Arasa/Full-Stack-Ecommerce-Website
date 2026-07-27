const express = require("express");
const router = express.Router();

const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const authMiddleware = require("../middleware/authMiddleware");


// Create Order from Cart
router.post("/create", authMiddleware, async (req, res) => {
    try {

        const cart = await Cart.findOne({
            user: req.user.id
        });


        if (!cart || cart.products.length === 0) {
            return res.status(400).json({
                message: "Cart is empty"
            });
        }


        let totalPrice = 0;


        // Check products and update stock
        for (let item of cart.products) {

            const product = await Product.findById(item.product);


            if (!product) {
                return res.status(404).json({
                    message: "Product not found"
                });
            }


            if (product.stock < item.quantity) {
                return res.status(400).json({
                    message: `Not enough stock for ${product.name}`
                });
            }


            totalPrice += product.price * item.quantity;


            // Reduce stock
            product.stock -= item.quantity;

            await product.save();
        }



        const order = new Order({
            user: req.user.id,
            products: cart.products,
            totalPrice: totalPrice,
            status: "Placed"
        });


        await order.save();



        // Clear cart after successful order
        cart.products = [];

        await cart.save();



        res.status(201).json({
            message: "Order placed successfully",
            order
        });



    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
});




// Get User Orders
router.get("/", authMiddleware, async (req, res) => {

    try {

        const orders = await Order.find({
            user: req.user.id
        }).populate("products.product");


        res.json(orders);


    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});


module.exports = router;