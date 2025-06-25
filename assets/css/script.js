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
// Shopping Cart Logic
let cart = []; // Array to store items in the cart

// Get DOM elements
const cartItemsList = document.getElementById('cart-items');
const totalPriceSpan = document.getElementById('total-price');
const emptyCartMessage = document.getElementById('empty-cart-message');
const checkoutButton = document.getElementById('checkout-button');

// Function to render cart items
function renderCart() {
    cartItemsList.innerHTML = ''; // Clear current cart display
    let total = 0;

    if (cart.length === 0) {
        emptyCartMessage.style.display = 'block'; // Show empty message
        checkoutButton.style.display = 'none'; // Hide checkout button if cart is empty
    } else {
        emptyCartMessage.style.display = 'none'; // Hide empty message
        checkoutButton.style.display = 'inline-block'; // Show checkout button
        cart.forEach((item, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <div class="cart-item-info">
                    ${item.name} x ${item.quantity}
                </div>
                <span>¥${(item.price * item.quantity).toLocaleString()}</span>
                <button class="remove-item-button" data-index="${index}">Remove</button>
            `;
            cartItemsList.appendChild(listItem);
            total += item.price * item.quantity;
        });
    }
    totalPriceSpan.textContent = total.toLocaleString(); // Update total price with locale formatting
}

// Add event listener to all "Add to Cart" buttons
document.querySelectorAll('.add-to-cart-button').forEach(button => {
    button.addEventListener('click', (event) => {
        const menuItem = event.target.closest('.menu-item');
        const itemName = menuItem.dataset.name;
        const itemPrice = parseInt(menuItem.dataset.price);
        const itemQuantity = parseInt(menuItem.querySelector('.item-quantity').value);

        if (itemQuantity <= 0) {
            alert('Please enter a quantity greater than 0.');
            return;
        }

        const existingItemIndex = cart.findIndex(item => item.name === itemName);

        if (existingItemIndex > -1) {
            // Item already in cart, update quantity
            cart[existingItemIndex].quantity += itemQuantity;
        } else {
            // Add new item to cart
            cart.push({
                name: itemName,
                price: itemPrice,
                quantity: itemQuantity
            });
        }
        renderCart(); // Re-render cart after adding item
        // Reset quantity input to 1 after adding
        menuItem.querySelector('.item-quantity').value = 1;
    });
});

// Add event listener for removing items from cart (event delegation)
cartItemsList.addEventListener('click', (event) => {
    if (event.target.classList.contains('remove-item-button')) {
        const indexToRemove = parseInt(event.target.dataset.index);
        cart.splice(indexToRemove, 1); // Remove item from array
        renderCart(); // Re-render cart
    }
});

// Initial render of the cart when the page loads
document.addEventListener('DOMContentLoaded', renderCart);

// Placeholder for Checkout button functionality
checkoutButton.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent default link behavior
    if (cart.length === 0) {
        alert('Your cart is empty. Please add items before checking out.');
        return;
    }
    // In a real application, you would send the 'cart' data to a backend
    // for processing payments and fulfilling the order.
    // For this demo, we'll just show an alert with the order summary.
    let orderSummary = "Your Order Summary:\n\n";
    cart.forEach(item => {
        orderSummary += `${item.name} x ${item.quantity} = ¥${(item.price * item.quantity).toLocaleString()}\n`;
    });
    orderSummary += `\nTotal: ¥${totalPriceSpan.textContent}`;
    orderSummary += "\n\nThank you for your order! This is a demo. In a real app, you'd proceed to payment.";
    alert(orderSummary); // Using alert for demo purposes
    // You might want to clear the cart after a successful (demo) checkout
    // cart = [];
    // renderCart();
});