document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceSpan = document.getElementById('total-price');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-button');

    let cart = [];

    // Function to save cart to localStorage
    const saveCart = () => {
        localStorage.setItem('komorebiCart', JSON.stringify(cart));
    };

    // Function to load cart from localStorage
    const loadCart = () => {
        const storedCart = localStorage.getItem('komorebiCart');
        if (storedCart) {
            cart = JSON.parse(storedCart);
            updateCartDisplay();
        }
    };

    // Function to update the cart display and total
    const updateCartDisplay = () => {
        cartItemsContainer.innerHTML = ''; // Clear existing cart items

        if (cart.length === 0) {
            emptyCartMessage.style.display = 'block'; // Show message
        } else {
            emptyCartMessage.style.display = 'none'; // Hide message
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
        updateCartTotal();
        saveCart(); // Save cart after every update
    };

    // Function to update the total price
    const updateCartTotal = () => {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        totalPriceSpan.textContent = total;
    };

    // Event listener for "Add to Cart" buttons
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const menuItem = event.target.closest('.menu-item');
            const itemName = menuItem.dataset.name;
            const itemPrice = parseInt(menuItem.dataset.price);
            const itemQuantityInput = menuItem.querySelector('.item-quantity');
            const quantity = parseInt(itemQuantityInput.value);

            if (quantity > 0) {
                const existingItemIndex = cart.findIndex(item => item.name === itemName);

                if (existingItemIndex > -1) {
                    // Item already in cart, update quantity
                    cart[existingItemIndex].quantity += quantity;
                } else {
                    // Add new item to cart
                    cart.push({ name: itemName, price: itemPrice, quantity: quantity });
                }
                updateCartDisplay();
                itemQuantityInput.value = 1; // Reset quantity input to 1 after adding
            } else {
                alert('Please enter a quantity greater than 0.');
            }
        });
    });

    // Event listener for "Remove" buttons in the cart
    cartItemsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-item-button')) {
            const indexToRemove = event.target.dataset.index;
            cart.splice(indexToRemove, 1); // Remove item from cart array
            updateCartDisplay();
        }
    });

    // Load cart when the page loads
    loadCart();

    // Optional: Add functionality for the checkout button (e.g., alert a message)
    const checkoutButton = document.getElementById('checkout-button');
    checkoutButton.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default link behavior
        if (cart.length > 0) {
            alert('Proceeding to checkout! (This is a demonstration.) Your total is ¥' + totalPriceSpan.textContent);
            // In a real application, you'd redirect to a checkout page or initiate payment.
        } else {
            alert('Your cart is empty. Please add items before checking out.');
        }
    });
});