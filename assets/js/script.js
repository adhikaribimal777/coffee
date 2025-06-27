document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceSpan = document.getElementById('total-price');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-button');

    // New DOM elements for customer details and delivery/pickup
    const checkoutButton = document.getElementById('checkout-button'); // Already exists
    const orderSection = document.querySelector('.order-section'); // Assumed you have this section
    const shoppingCartSection = document.getElementById('shopping-cart-section'); // Assumed you have this section
    const customerDetailsSection = document.getElementById('customer-details-section'); // Assumed you have this section
    const customerForm = document.getElementById('customer-form'); // Already exists

    const deliveryRadio = document.getElementById('delivery-option'); // New
    const pickupRadio = document.getElementById('pickup-option');     // New
    const customerLocationGroup = document.getElementById('customer-location-group'); // New
    const customerLocationInput = document.getElementById('customer-location'); // New

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
            checkoutButton.style.display = 'none'; // Hide checkout button if cart is empty
        } else {
            emptyCartMessage.style.display = 'none'; // Hide message
            checkoutButton.style.display = 'inline-block'; // Show checkout button
            cart.forEach((item, index) => {
                const listItem = document.createElement('li');
                // Using toLocaleString for better currency formatting
                listItem.innerHTML = `
                    <div class="cart-item-info">
                        ${item.name} (¥${item.price.toLocaleString()}) x ${item.quantity}
                    </div>
                    <span>¥${(item.price * item.quantity).toLocaleString()}</span>
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
        totalPriceSpan.textContent = total.toLocaleString(); // Format total price
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

    // --- New: Delivery/Pickup and Customer Details Logic ---

    // Function to toggle visibility and required attribute of the customer location field
    const toggleLocationField = () => {
        if (deliveryRadio.checked) {
            customerLocationGroup.style.display = 'block'; // Show the location field
            customerLocationInput.setAttribute('required', 'required'); // Make location required for delivery
        } else {
            customerLocationGroup.style.display = 'none'; // Hide the location field
            customerLocationInput.removeAttribute('required'); // Remove required for pickup
            customerLocationInput.value = ''; // Clear location input when switching to pickup
        }
    };

    // Event listeners for delivery/pickup radio buttons
    deliveryRadio.addEventListener('change', toggleLocationField);
    pickupRadio.addEventListener('change', toggleLocationField);

    // Modify Checkout button functionality to show customer details form
    checkoutButton.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default link behavior
        if (cart.length > 0) {
            // Hide menu and shopping cart, show customer details
            orderSection.style.display = 'none';
            shoppingCartSection.style.display = 'none';
            customerDetailsSection.style.display = 'block';
            // Ensure location field visibility is correctly set when entering customer details
            toggleLocationField();
        } else {
            alert('Your cart is empty. Please add items before checking out.');
        }
    });

    // Event listener for the customer form submission
    customerForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent default form submission

        const customerName = document.getElementById('customer-name').value;
        const customerEmail = document.getElementById('customer-email').value;
        const customerPhone = document.getElementById('customer-phone').value;
        const deliveryOption = document.querySelector('input[name="delivery-pickup"]:checked').value;

        let customerLocation = '';
        // Only get customer location if delivery is selected
        if (deliveryOption === 'delivery') {
            customerLocation = customerLocationInput.value;
            // Add validation for delivery location if delivery is chosen
            if (!customerLocation) {
                alert('Please enter a delivery location.');
                return;
            }
        }

        // Basic validation for required customer details
        if (!customerName || !customerEmail || !customerPhone) {
            alert('Please fill in all required customer details (Name, Email, Phone).');
            return;
        }

        // Construct order summary with customer details and delivery option
        let orderSummary = "--- Your Order Summary ---\n\n";
        cart.forEach(item => {
            orderSummary += `${item.name} x ${item.quantity} = ¥${(item.price * item.quantity).toLocaleString()}\n`;
        });
        orderSummary += `\nTotal: ¥${totalPriceSpan.textContent}`;
        orderSummary += `\n\n--- Customer Details ---\nName: ${customerName}\nEmail: ${customerEmail}\nPhone: ${customerPhone}`;
        orderSummary += `\nOrder Type: ${deliveryOption === 'delivery' ? 'Delivery' : 'Pickup'}`;

        if (deliveryOption === 'delivery') {
            orderSummary += `\nDelivery Location: ${customerLocation}`;
        }
å
        orderSummary += "\n\nThank you for your order! This is a demo. In a real application, you'd proceed to a secure payment gateway.";

        alert(orderSummary); // Using alert for demo purposes

        // Reset the form and display for a new order
        cart = []; // Clear the cart
        saveCart(); // Save the empty cart to localStorage
        updateCartDisplay(); // Update display (will show empty cart message)
        customerForm.reset(); // Clear the form fields

        // Reset delivery/pickup options visibility for the next order
        deliveryRadio.checked = true; // Set delivery as default again
        toggleLocationField(); // Ensure location field is visible (if delivery is default)

        // Navigate back to the menu/cart view
        customerDetailsSection.style.display = 'none'; // Hide customer details
        orderSection.style.display = 'block'; // Show menu section again
        shoppingCartSection.style.display = 'block'; // Show shopping cart section again
    });

    // Initial load of the cart and set the initial state of the delivery/pickup options
    loadCart();
    toggleLocationField(); // Set initial visibility for location field
});