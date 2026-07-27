const cartItems = document.getElementById("cartItems");

const totalPrice = document.getElementById("totalPrice");


let cart = JSON.parse(localStorage.getItem("cart")) || [];


// Add quantity property if it does not exist
cart = cart.map(product => {

    if (!product.quantity) {
        product.quantity = 1;
    }

    return product;

});



function displayCart() {


    cartItems.innerHTML = "";


    let total = 0;


    if (cart.length === 0) {

        cartItems.innerHTML = "<h3>Your cart is empty</h3>";

        totalPrice.innerHTML = "";

        return;

    }


    cart.forEach((product, index) => {


        total += product.price * product.quantity;


        cartItems.innerHTML += `

            <div>

                <img src="images/${product.image}" width="150">


                <div>

                    <h3>${product.name}</h3>

                    <p>Price: ₹${product.price}</p>


                    <button onclick="decreaseQuantity(${index})">
                        -
                    </button>


                    <span>
                        ${product.quantity}
                    </span>


                    <button onclick="increaseQuantity(${index})">
                        +
                    </button>


                    <p>
                        Subtotal: ₹${product.price * product.quantity}
                    </p>


                    <button onclick="removeProduct(${index})">
                        Remove
                    </button>

                </div>


            </div>

            <hr>

        `;


    });


    totalPrice.innerHTML = `Total Price: ₹${total}`;


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


}



function increaseQuantity(index) {


    cart[index].quantity++;


    displayCart();

}



function decreaseQuantity(index) {


    if (cart[index].quantity > 1) {

        cart[index].quantity--;

    }


    displayCart();

}



function removeProduct(index) {


    cart.splice(index, 1);


    displayCart();

}



displayCart();