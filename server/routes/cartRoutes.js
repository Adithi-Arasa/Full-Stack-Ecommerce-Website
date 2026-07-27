const express = require("express");
const router = express.Router();

const Cart = require("../models/Cart");
const Product = require("../models/Product");
const authMiddleware = require("../middleware/authMiddleware");


// Add product to cart
router.post("/add", authMiddleware, async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        // Check product exists
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }


        // Find user's cart
        let cart = await Cart.findOne({
            user: req.user.id
        });


        // Create new cart if not available
        if (!cart) {
            cart = new Cart({
                user: req.user.id,
                products: []
            });
        }


        // Check if product already exists in cart
        const existingProduct = cart.products.find(
            item => item.product.toString() === productId
        );


        if (existingProduct) {
            existingProduct.quantity += quantity || 1;
        } else {
            cart.products.push({
                product: productId,
                quantity: quantity || 1
            });
        }


        await cart.save();


        res.status(200).json({
            message: "Product added to cart",
            cart
        });


    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});



// Get cart
router.get("/", authMiddleware, async (req, res) => {
    try {

        const cart = await Cart.findOne({
            user: req.user.id
        }).populate("products.product");


        if (!cart) {
            return res.json({
                message: "Cart is empty"
            });
        }


        res.json(cart);


    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});



// Remove product from cart
router.delete("/remove/:productId", authMiddleware, async (req, res) => {
    try {

        const cart = await Cart.findOne({
            user: req.user.id
        });


        if (!cart) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }


        cart.products = cart.products.filter(
            item => item.product.toString() !== req.params.productId
        );


        await cart.save();


        res.json({
            message: "Product removed from cart",
            cart
        });


    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


module.exports = router;