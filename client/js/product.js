const productDetails = document.getElementById("productDetails");

const addToCartButton = document.getElementById("addToCart");

const params = new URLSearchParams(window.location.search);

const id = params.get("id");


let currentProduct;


async function getProduct() {

    try {

        const response = await fetch(
            `http://localhost:5000/api/products/${id}`
        );

        const product = await response.json();

        currentProduct = product;


        productDetails.innerHTML = `

            <img src="images/${product.image}" width="300" alt="${product.name}">

            <h2>${product.name}</h2>

            <p>${product.description}</p>

            <h3>Price: ₹${product.price}</h3>

            <p>Stock: ${product.stock}</p>

        `;


    } catch (error) {

        console.log(error);

        productDetails.innerHTML =
        "<h3>Unable to load product details</h3>";

    }

}



addToCartButton.addEventListener("click", function () {


    let cart = JSON.parse(localStorage.getItem("cart")) || [];


    cart.push(currentProduct);


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    alert("Product added to cart 🛒");


});



getProduct();