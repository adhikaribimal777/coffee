document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceSpan = document.getElementById('total-price');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-button');

    const checkoutButton = document.getElementById('checkout-button');
    const orderSection = document.querySelector('.order-section');
    const shoppingCartSection = document.getElementById('shopping-cart-section');
    const customerDetailsSection = document.getElementById('customer-details-section');
    const customerForm = document.getElementById('customer-form');

    const deliveryRadio = document.getElementById('delivery-option');
    const pickupRadio = document.getElementById('pickup-option');

    const deliveryDetailsGroup = document.getElementById('delivery-details-group');
    const postalCodeInput = document.getElementById('postal-code');
    const customerLocationGroup = document.getElementById('customer-location-group');
    const customerLocationInput = document.getElementById('customer-location');

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
                listItem.innerHTML = `
                    <div class="cart-item-info">
                        ${item.name} (¥${item.price.toLocaleString()}) x ${item.quantity}
                    </div>
                    <div class="cart-item-controls">
                       <span>¥${(item.price * item.quantity).toLocaleString()}</span>
                       <button class="remove-item-button" data-index="${index}">Remove</button>
                    </div>
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
            let itemName = menuItem.dataset.name;
            const itemPrice = parseInt(menuItem.dataset.price);
            const itemQuantityInput = menuItem.querySelector('.item-quantity');
            const quantity = parseInt(itemQuantityInput.value);

            // Check for temperature options and modify the item name accordingly.
            const tempOptions = menuItem.querySelector('.temperature-options');
            if (tempOptions) {
                const selectedTemp = tempOptions.querySelector('input[name="latte-temp"]:checked');
                if (selectedTemp) { // Ensure a temperature is selected
                    itemName += ` (${selectedTemp.value.charAt(0).toUpperCase() + selectedTemp.value.slice(1)})`;
                }
            }

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
            const indexToRemove = parseInt(event.target.dataset.index, 10);
            cart.splice(indexToRemove, 1); // Remove item from cart array
            updateCartDisplay();
        }
    });

    // --- Delivery/Pickup and Customer Details Logic ---

    // Function to toggle visibility of delivery details (postal code + full address)
    const toggleDeliveryDetails = () => {
        if (deliveryRadio.checked) {
            deliveryDetailsGroup.style.display = 'block'; // Show postal code and location group
            postalCodeInput.setAttribute('required', 'required'); // Make postal code required
            customerLocationGroup.style.display = 'none'; // Initially hide full address until postal code is entered
            customerLocationInput.removeAttribute('required'); // Remove required for full address initially
        } else {
            deliveryDetailsGroup.style.display = 'none'; // Hide all delivery fields
            postalCodeInput.removeAttribute('required'); // Remove required from postal code
            postalCodeInput.value = ''; // Clear postal code
            customerLocationGroup.style.display = 'none'; // Hide full address
            customerLocationInput.removeAttribute('required'); // Remove required from full address
            customerLocationInput.value = ''; // Clear full address
        }
    };

    // Event listener for postal code input
    postalCodeInput.addEventListener('input', () => {
        if (postalCodeInput.value.trim() !== '') {
            customerLocationGroup.style.display = 'block'; // Show full address field
            customerLocationInput.setAttribute('required', 'required'); // Make full address required
        } else {
            customerLocationGroup.style.display = 'none'; // Hide full address field
            customerLocationInput.removeAttribute('required'); // Remove required
            customerLocationInput.value = ''; // Clear full address
        }
    });

    // Event listeners for delivery/pickup radio buttons
    pickupRadio.addEventListener('change', toggleDeliveryDetails);
    deliveryRadio.addEventListener('change', toggleDeliveryDetails);


    // Modify Checkout button functionality to show customer details form
    checkoutButton.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default link behavior
        if (cart.length > 0) {
            // Hide menu and shopping cart, show customer details
            orderSection.style.display = 'none';
            shoppingCartSection.style.display = 'none';
            customerDetailsSection.style.display = 'block';
            // Ensure delivery details visibility is correctly set when entering customer details
            toggleDeliveryDetails();
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

        let postalCode = '';
        let customerLocation = '';

        // --- Start of integrated validation from your second script ---

        // Basic validation for required customer details (Name, Email, Phone)
        if (!customerName || !customerEmail || !customerPhone) {
            alert('Please fill in all required customer details (Name, Email, Phone).');
            return; // Stop form submission
        }

        if (deliveryOption === 'delivery') {
            postalCode = postalCodeInput.value.trim();
            customerLocation = customerLocationInput.value.trim();

            if (!postalCode) {
                alert('Please enter a postal code for delivery.');
                return; // Stop form submission
            }
            if (!customerLocation) {
                alert('Please enter a delivery address.');
                return; // Stop form submission
            }
        }
        // --- End of integrated validation from your second script ---


        // Construct order summary with customer details and delivery option
        let orderSummary = "--- Your Order Summary ---\n\n";
        cart.forEach(item => {
            orderSummary += `${item.name} x ${item.quantity} = ¥${(item.price * item.quantity).toLocaleString()}\n`;
        });
        orderSummary += `\nTotal: ¥${totalPriceSpan.textContent}\n\n`;
        orderSummary += `--- Customer Details ---\n`;
        orderSummary += `Name: ${customerName}\n`;
        orderSummary += `Email: ${customerEmail}\n`;
        orderSummary += `Phone: ${customerPhone}\n`;
        orderSummary += `Delivery Option: ${deliveryOption.charAt(0).toUpperCase() + deliveryOption.slice(1)}\n`;

        if (deliveryOption === 'delivery') {
            orderSummary += `Postal Code: ${postalCode}\n`;
            orderSummary += `Delivery Address: ${customerLocation}\n`;
        }
        
        
        // --- Added final message from your second script ---
        orderSummary += "\n\nThank you for your order! This is a demo. In a real application, you'd proceed to a secure payment gateway.";

        alert(orderSummary); // Display the order summary

        // Reset the form and display for a new order
        cart = []; // Clear the cart
        saveCart(); // Save the empty cart to localStorage
        updateCartDisplay(); // Update display (will show empty cart message)
        customerForm.reset(); // Clear the form fields

        // Reset delivery/pickup options visibility for the next order
        pickupRadio.checked = true; // Set pickup as default again
        toggleDeliveryDetails(); // Ensure delivery fields are hidden

        // Navigate back to the menu/cart view
        customerDetailsSection.style.display = 'none'; // Hide customer details
        orderSection.style.display = 'block'; // Show menu section again
        shoppingCartSection.style.display = 'block'; // Show shopping cart section again
    });

    // Initial load of the cart and set the initial state of the delivery/pickup options
    loadCart();
    pickupRadio.checked = true; // Ensure pickup is selected by default on load
    toggleDeliveryDetails(); // Set initial visibility for delivery details when page loads
});
 document.addEventListener('DOMContentLoaded', () => {
        const deliveryRadio = document.getElementById('delivery-option');
        const pickupRadio = document.getElementById('pickup-option');
        const deliveryDetailsGroup = document.getElementById('delivery-details-group');
        const postalCodeInput = document.getElementById('postal-code');
        const customerLocationGroup = document.getElementById('customer-location-group');
        const customerLocationInput = document.getElementById('customer-location');
        const customerForm = document.getElementById('customer-form');

        // Function to toggle visibility of delivery details (postal code + full address)
        const toggleDeliveryDetails = () => {
            if (deliveryRadio.checked) {
                deliveryDetailsGroup.style.display = 'block';
                postalCodeInput.setAttribute('required', 'required');
                customerLocationGroup.style.display = 'none';
                customerLocationInput.removeAttribute('required');
            } else {
                deliveryDetailsGroup.style.display = 'none';
                postalCodeInput.removeAttribute('required');
                postalCodeInput.value = '';
                customerLocationGroup.style.display = 'none';
                customerLocationInput.removeAttribute('required');
                customerLocationInput.value = '';
            }
        };

        postalCodeInput.addEventListener('input', () => {
            if (postalCodeInput.value.trim() !== '') {
                customerLocationGroup.style.display = 'block';
                customerLocationInput.setAttribute('required', 'required');
            } else {
                customerLocationGroup.style.display = 'none';
                customerLocationInput.removeAttribute('required');
                customerLocationInput.value = '';
            }
        });

        pickupRadio.addEventListener('change', toggleDeliveryDetails);
        deliveryRadio.addEventListener('change', toggleDeliveryDetails);

        customerForm.addEventListener('submit', (event) => {
            event.preventDefault();
            // Event listener for the customer form submission

            const customerName = document.getElementById('customer-name').value;
            const customerEmail = document.getElementById('customer-email').value;
            const customerPhone = document.getElementById('customer-phone').value;
            const deliveryOption = document.querySelector('input[name="delivery-pickup"]:checked').value;

            let postalCode = '';
            let customerLocation = '';
// Basic validation for required customer details (Name, Email, Phone)
            if (!customerName || !customerEmail || !customerPhone) {
                alert('Please fill in all required customer details (Name, Email, Phone).');
                return;
            }

            if (deliveryOption === 'delivery') {
                postalCode = postalCodeInput.value.trim();
                customerLocation = customerLocationInput.value.trim();

                if (!postalCode) {
                    alert('Please enter a postal code for delivery.');
                    return;
                }
                if (!customerLocation) {
                    alert('Please enter a delivery address.');
                    return;
                }
            }

            let orderSummary = "--- Customer Details ---\n";
            orderSummary += `Name: ${customerName}\nEmail: ${customerEmail}\nPhone: ${customerPhone}`;
            orderSummary += `\nOrder Type: ${deliveryOption === 'delivery' ? 'Delivery' : 'Pickup'}`;

            if (deliveryOption === 'delivery') {
                orderSummary += `\nPostal Code: ${postalCode}`;
                orderSummary += `\nDelivery Address: ${customerLocation}`;
            }

            orderSummary += "\n\nThank you for your order! This is a demo. In a real application, you'd proceed to a secure payment gateway.";

            alert(orderSummary);

            customerForm.reset();
            pickupRadio.checked = true;
            toggleDeliveryDetails();
        });

        toggleDeliveryDetails();
    });