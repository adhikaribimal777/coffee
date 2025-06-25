document.addEventListener('DOMContentLoaded', () => {
    const cartItemsList = document.getElementById('cart-items');
    const cartTotalSpan = document.getElementById('cart-total');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-button');
    const checkoutButton = document.querySelector('.checkout-button');

    let cart = [];

    // Function to update the cart display
    function updateCartDisplay() {
        cartItemsList.innerHTML = ''; // Clear current items
        let total = 0;

        cart.forEach((item, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <div class="cart-item-info">
                    ${item.name} (x${item.quantity}) - ¥${(item.price * item.quantity).toFixed(2)}
                </div>
                <button class="remove-item-button" data-index="${index}">Remove</button>
            `;
            cartItemsList.appendChild(listItem);
            total += item.price * item.quantity;
        });

        cartTotalSpan.textContent = `Total: ¥${total.toFixed(2)}`;

        // Add event listeners to new remove buttons
        document.querySelectorAll('.remove-item-button').forEach(button => {
            button.addEventListener('click', (event) => {
                const indexToRemove = event.target.dataset.index;
                removeItemFromCart(indexToRemove);
            });
        });
    }

    // Function to add item to cart
    function addItemToCart(name, price, quantity) {
        const existingItemIndex = cart.findIndex(item => item.name === name);

        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += quantity;
        } else {
            cart.push({ name, price, quantity });
        }
        updateCartDisplay();
    }

    // Function to remove item from cart
    function removeItemFromCart(index) {
        cart.splice(index, 1);
        updateCartDisplay();
    }

    // Event listeners for "Add to Cart" buttons
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const menuItem = event.target.closest('.menu-item');
            const itemName = menuItem.querySelector('.item-details h3').textContent;
            const itemPrice = parseFloat(menuItem.querySelector('.item-price').textContent.replace('¥', ''));
            const itemQuantityInput = menuItem.querySelector('.item-quantity');
            const itemQuantity = parseInt(itemQuantityInput.value);

            if (itemQuantity > 0) {
                addItemToCart(itemName, itemPrice, itemQuantity);
                itemQuantityInput.value = 1; // Reset quantity to 1 after adding
            } else {
                alert('Please select a quantity greater than 0.');
            }
        });
    });

    // Event listener for checkout button
    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            if (cart.length > 0) {
                alert('Proceeding to checkout with your order!');
                // In a real application, you would send this cart data to a server
                // and redirect to a payment gateway.
                console.log('Cart Contents:', cart);
                // For demonstration, clear the cart after "checkout"
                cart = [];
                updateCartDisplay();
            } else {
                alert('Your cart is empty. Please add some items before checking out.');
            }
        });
    }

    // Initial cart display update
    updateCartDisplay();
});