document.addEventListener('DOMContentLoaded', () => {
    // Get references to key elements in the HTML
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceSpan = document.getElementById('total-price');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-button');

    // Initialize an empty array to hold our cart items
    let cart = [];

    // --- Utility Functions ---

    // Saves the current state of the cart to the browser's local storage
    const saveCart = () => {
        localStorage.setItem('komorebiCart', JSON.stringify(cart));
    };

    // Loads the cart from local storage when the page first loads
    const loadCart = () => {
        const storedCart = localStorage.getItem('komorebiCart');
        if (storedCart) {
            cart = JSON.parse(storedCart);
            updateCartDisplay(); // Update the UI with loaded items
        }
    };

    // Updates the visual representation of the cart in the HTML
    const updateCartDisplay = () => {
        cartItemsContainer.innerHTML = ''; // Clear out existing items in the displayed cart

        if (cart.length === 0) {
            // If the cart is empty, show the "Your cart is empty" message
            emptyCartMessage.style.display = 'block';
        } else {
            // If there are items, hide the empty message and display each item
            emptyCartMessage.style.display = 'none';
            cart.forEach((item, index) => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <div class="cart-item-info">
                        ${item.name} (¥${item.price}) x ${item.quantity}
                    </div>
                    <span>¥${item.price * item.quantity}</span>
                    <button class="remove-item-button" data-index="${index}">Remove</button>
                `;
                cartItemsContainer.appendChild(listItem);
            });
        }
        updateCartTotal(); // Recalculate and display the total price
        saveCart(); // Save the updated cart to local storage
    };

    // Calculates and displays the total price of all items in the cart
    const updateCartTotal = () => {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        totalPriceSpan.textContent = total;
    };

    // --- Event Listeners ---

    // Add event listeners to all "Add to Cart" buttons
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const menuItem = event.target.closest('.menu-item'); // Get the parent menu-item div
            const itemName = menuItem.dataset.name; // Get item name from data attribute
            const itemPrice = parseInt(menuItem.dataset.price); // Get item price from data attribute
            const itemQuantityInput = menuItem.querySelector('.item-quantity'); // Get the quantity input field
            const quantity = parseInt(itemQuantityInput.value); // Get the quantity the user wants to add

            if (quantity > 0) {
                // Check if the item already exists in the cart
                const existingItemIndex = cart.findIndex(item => item.name === itemName);

                if (existingItemIndex > -1) {
                    // If it exists, just update its quantity
                    cart[existingItemIndex].quantity += quantity;
                } else {
                    // If it's a new item, add it to the cart array
                    cart.push({ name: itemName, price: itemPrice, quantity: quantity });
                }
                updateCartDisplay(); // Refresh the cart display
                itemQuantityInput.value = 1; // Reset the quantity input to 1 for next time
            } else {
                alert('Please enter a quantity greater than 0.');
            }
        });
    });

    // Add event listener to the cart items container for "Remove" buttons
    // Using event delegation because remove buttons are added dynamically
    cartItemsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-item-button')) {
            const indexToRemove = event.target.dataset.index; // Get the index of the item to remove
            cart.splice(indexToRemove, 1); // Remove the item from the cart array
            updateCartDisplay(); // Refresh the cart display
        }
    });

    // Event listener for the "Proceed to Checkout" button
    const checkoutButton = document.getElementById('checkout-button');
    checkoutButton.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent the default link behavior (e.g., navigating to #)
        if (cart.length > 0) {
            alert(`Proceeding to checkout! (This is a demonstration.) Your total is ¥${totalPriceSpan.textContent}`);
            // In a real application, you would integrate with a payment gateway here.
        } else {
            alert('Your cart is empty. Please add items before checking out.');
        }
    });

    // --- Initial Load ---
    // Load the cart from local storage when the page first loads
    loadCart();
});