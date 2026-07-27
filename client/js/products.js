const productContainer = document.getElementById("productContainer");


async function getProducts() {

    try {

        const response = await fetch(
            "http://localhost:5000/api/products"
        );


        const products = await response.json();


        productContainer.innerHTML = "";


        products.forEach(product => {


            const productCard = document.createElement("div");

            productCard.className = "product-card";


            productCard.innerHTML = `

               <img src="images/${product.image}" alt="${product.name}">

                <h3>${product.name}</h3>

                <p>${product.description}</p>

                <p><b>Price:</b> ₹${product.price}</p>

                <p><b>Stock:</b> ${product.stock}</p>

                <button onclick="viewProduct('${product._id}')">
                    View Details
                </button>

            `;


            productContainer.appendChild(productCard);


        });


    } catch (error) {

        console.log(error);

        productContainer.innerHTML =
        "<h3>Unable to load products</h3>";

    }

}



function viewProduct(id) {

    localStorage.setItem(
        "productId",
        id
    );


    window.location.href = "product.html";

}



getProducts();
function viewProduct(id) {
    window.location.href = `product.html?id=${id}`;
}