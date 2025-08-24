// script.js

// Sample product data (crochet & resin)
const products = [
    { id: 1, name: "Handmade Crochet Bag", price: 799, category: "crochet", image: "img/Crochet bag.jpeg" },
    { id: 2, name: "Resin Earrings", price: 499, category: "resin", image: "img/resin_earrings.png" },
    { id: 3, name: "Crochet Keychain", price: 199, category: "crochet", image: "img/keychain.jpeg" },
    { id: 4, name: "Crochet Pouch", price: 349, category: "crochet", image: "img/crochet_pouch.jpg" },
    { id: 5, name: "Resin Ring", price: 299, category: "resin", image: "img/resin_ring.jpg" },
    { id: 6, name: "Crochet Coaster", price: 149, category: "crochet", image: "img/coster.jpeg" },
    { id: 7, name: "Resin Pendant", price: 399, category: "resin", image: "img/pendent.jpeg" },
    { id: 8, name: "Crochet Flower", price: 99, category: "crochet", image: "img/flowers.jpeg" },
    { id: 9, name: "Resin Bracelet", price: 449, category: "resin", image: "img/resin_bracelet.png" },
    { id: 10, name: "Crochet Hat", price: 599, category: "crochet", image: "img/hat.jpeg" },
    { id: 11, name: "Resin Brooch", price: 349, category: "resin", image: "img/broch.jpeg" },
    { id: 12, name: "Crochet Hairclip", price: 129, category: "crochet", image: "img/hairclip.jpeg" },
    { id: 13, name: "Resin Key Charms", price: 799, category: "resin", image: "img/key.jpeg" },
    { id: 14, name: "Resin Earring", price: 399, category: "resin", image: "img/leaves.jpeg" },
    { id: 15, name: "Resin Bookmark", price: 199, category: "resin", image: "img/Personalized Resin Bookmarks.jpeg" },
    { id: 16, name: "Resin Flower Earring", price: 599, category: "resin", image: "img/ear.jpeg" },



];

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Set up event listeners for filters
    setupFilterListeners();
    
    // Set up event listeners for Add to Cart buttons
    setupAddToCartListeners();
    
    // Initialize cart
    updateCart();
    
    // Set up checkout form if it exists
    if (document.getElementById('checkout-form')) {
        setupCheckoutForm();
    }
                // Update cart count
      updateCartCount();
      // Set up event listeners
            setupEventListeners();
            
            // Set up category tabs
            setupCategoryTabs();

});


// Set up filter event listeners
function setupFilterListeners() {
    const crochetFilter = document.getElementById('crochet');
    const resinFilter = document.getElementById('resin');
    const priceFilter = document.getElementById('price-filter');

    if (crochetFilter && resinFilter && priceFilter) {
        crochetFilter.addEventListener('change', applyFilters);
        resinFilter.addEventListener('change', applyFilters);
        priceFilter.addEventListener('change', applyFilters);
    }
}

// Apply filters to products
function applyFilters() {
    const showCrochet = document.getElementById('crochet').checked;
    const showResin = document.getElementById('resin').checked;
    const priceValue = document.getElementById('price-filter').value;
    
    // Get all product items
    const productItems = document.querySelectorAll('.product-item');
    
    // Track if we have visible items in each category
    let hasVisibleCrochet = false;
    let hasVisibleResin = false;
    
    // Apply filters to each product
    productItems.forEach(item => {
        const category = item.getAttribute('data-category');
        const price = parseInt(item.getAttribute('data-price'));
        let shouldShow = true;
        
        // Category filter
        if ((category === 'crochet' && !showCrochet) || 
            (category === 'resin' && !showResin)) {
            shouldShow = false;
        }
        
        // Price filter
        if (shouldShow && priceValue !== 'all') {
            if (priceValue === '0-500' && price >= 500) {
                shouldShow = false;
            } else if (priceValue === '500-1000' && (price < 500 || price > 1000)) {
                shouldShow = false;
            } else if (priceValue === '1000+' && price <= 1000) {
                shouldShow = false;
            }
        }
        
        // Show or hide the product
        if (shouldShow) {
            item.classList.remove('hidden');
            // Track visible categories
            if (category === 'crochet') hasVisibleCrochet = true;
            if (category === 'resin') hasVisibleResin = true;
        } else {
            item.classList.add('hidden');
        }
    });
    
    // Show/hide category sections based on whether they have visible products
    document.querySelectorAll('.product-section').forEach(section => {
        const category = section.getAttribute('data-category');
        if ((category === 'crochet' && !hasVisibleCrochet) || 
            (category === 'resin' && !hasVisibleResin)) {
            section.classList.add('hidden');
            // Also hide the section title
            document.querySelector(`.product-section-title[data-category="${category}"]`).classList.add('hidden');
        } else {
            section.classList.remove('hidden');
            document.querySelector(`.product-section-title[data-category="${category}"]`).classList.remove('hidden');
        }
    });
}

// Set up Add to Cart event listeners
function setupAddToCartListeners() {
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            addToCart(productId);
            alert('Product added to cart!');
        });
    });
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCart();
}

// Remove product from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Update product quantity in cart
function updateQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = quantity;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCart();
        }
    }
}

// Update cart in localStorage and UI
function updateCart() {
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count in navbar
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
    
    // Update cart page if we're on it
    if (document.getElementById('cart-items')) {
        renderCartItems();
    }
    
    // Update checkout summary if we're on checkout page
    if (document.getElementById('checkout-summary')) {
        renderCheckoutSummary();
    }
}

// Render cart items on cart page
function renderCartItems() {
    const cartItems = document.getElementById('cart-items');
    const subtotalElement = document.getElementById('subtotal');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');
    
    if (!cartItems) return;
    
    cartItems.innerHTML = '';
    
    let subtotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="d-flex align-items-center">
                    <img src="${item.image}" alt="${item.name}" width="60" class="me-3 rounded">
                    <div>${item.name}</div>
                </div>
            </td>
            <td>₨${item.price}</td>
            <td>
                <input type="number" class="form-control form-control-sm quantity-input" 
                       value="${item.quantity}" min="1" data-id="${item.id}">
            </td>
            <td>₨${itemTotal}</td>
            <td>
                <button class="btn btn-sm btn-danger remove-item" data-id="${item.id}">Remove</button>
            </td>
        `;
        cartItems.appendChild(row);
    });
    
    const tax = subtotal * 0.1; // 10% tax
    const shipping = 50.00;
    const total = subtotal + tax + shipping;
    
    subtotalElement.textContent = `₨${subtotal.toFixed(2)}`;
    taxElement.textContent = `₨${tax.toFixed(2)}`;
    totalElement.textContent = `₨${total.toFixed(2)}`;
    
    // Add event listeners
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            removeFromCart(productId);
        });
    });
    
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const quantity = parseInt(this.value);
            updateQuantity(productId, quantity);
        });
    });
}

// Set up checkout form
function setupCheckoutForm() {
    document.getElementById('checkout-form').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Order placed successfully!');
        localStorage.removeItem('cart');
        cart = [];
        updateCart();
        window.location.href = 'home.html';
    });
    
    renderCheckoutSummary();
}

// Render checkout summary
function renderCheckoutSummary() {
    const checkoutSummary = document.getElementById('checkout-summary');
    if (!checkoutSummary) return;
    
    let subtotal = 0;
    let summaryHTML = '';
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        summaryHTML += `
            <div class="d-flex justify-content-between mb-2">
                <span>${item.name} x${item.quantity}</span>
                <span>₨${itemTotal}</span>
            </div>
        `;
    });
    
    const tax = subtotal * 0.1;
    const shipping = 50.00;
    const total = subtotal + tax + shipping;
    
    summaryHTML += `
        <hr>
        <div class="d-flex justify-content-between mb-2">
            <span>Subtotal:</span>
            <span>₨${subtotal.toFixed(2)}</span>
        </div>
        <div class="d-flex justify-content-between mb-2">
            <span>Tax:</span>
            <span>₨${tax.toFixed(2)}</span>
        </div>
        <div class="d-flex justify-content-between mb-2">
            <span>Shipping:</span>
            <span>₨${shipping.toFixed(2)}</span>
        </div>
        <div class="d-flex justify-content-between mb-2 fw-bold">
            <span>Total:</span>
            <span>₨${total.toFixed(2)}</span>
        </div>
    `;
    
    checkoutSummary.innerHTML = summaryHTML;
}
 
        
        // Update cart count in navbar
        function updateCartCount() {
            const cartCount = document.getElementById('cart-count');
            if (cartCount) {
                const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
                cartCount.textContent = totalItems;
            }
        }
        
        // Set up event listeners
        function setupEventListeners() {
            // Add to cart buttons
            document.querySelectorAll('.add-to-cart-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const productId = parseInt(this.getAttribute('data-id'));
                    addToCart(productId);
                });
            });
            
            // Product thumbnail clicks
            document.querySelectorAll('.product-thumb').forEach(thumb => {
                thumb.addEventListener('click', function() {
                    const mainImage = this.closest('.col-md-6').querySelector('.product-image');
                    const imageUrl = this.getAttribute('data-image');
                    mainImage.src = imageUrl;
                    
                    // Update active state
                    document.querySelectorAll('.product-thumb').forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                });
            });
            
            // Color options
            document.querySelectorAll('.color-option').forEach(option => {
                option.addEventListener('click', function() {
                    document.querySelectorAll('.color-option').forEach(o => o.style.border = 'none');
                    this.style.border = '2px solid #000';
                });
            });
        }
        
        // Set up category tabs
        function setupCategoryTabs() {
            const categoryTabs = document.querySelectorAll('.category-tab');
            
            categoryTabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    const category = this.getAttribute('data-category');
                    
                    // Update active tab
                    categoryTabs.forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Show/hide products based on category
                    document.querySelectorAll('.nav-link').forEach(navLink => {
                        const productId = navLink.id.replace('tab', '');
                        const product = products[parseInt(productId)];
                        
                        if (product && product.category === category) {
                            navLink.style.display = 'block';
                        } else {
                            navLink.style.display = 'none';
                        }
                    });
                });
            });
        }
        
        // Add product to cart
        function addToCart(productId) {
            const product = products.find(p => p.id === productId);
            const existingItem = cart.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ ...product, quantity: 1 });
            }
            
            // Update localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update UI
            updateCartCount();
            
            // Show confirmation
            alert(`${product.name} added to cart!`);
        }