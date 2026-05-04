const fs = require('fs');
const path = require('path');

const files = ['index.html', 'amul-products.html', 'motherdairy-products.html', 'nandini-products.html', 'parag-products.html'];

const navReplacement = `        <div class="nav-actions">
            <button class="cart-btn" id="cart-btn">
                <i class="fa-solid fa-cart-shopping"></i>
                <span class="cart-count" id="cart-count">0</span>
            </button>
            <button class="cta-btn small">Sign In</button>
        </div>`;

const cartHtml = `
    <!-- Shopping Cart Sidebar -->
    <div class="cart-overlay" id="cart-overlay"></div>
    <div class="cart-sidebar" id="cart-sidebar">
        <div class="cart-header">
            <h2>Your Cart</h2>
            <button class="close-cart" id="close-cart"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="cart-items" id="cart-items">
            <!-- Cart items will be injected here -->
        </div>
        <div class="cart-footer">
            <div class="cart-total">
                <span>Total:</span>
                <span id="cart-total-price">₹0</span>
            </div>
            <button class="cta-btn primary full-width checkout-btn" id="checkout-btn">Proceed to Checkout</button>
        </div>
    </div>`;

for (const file of files) {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) continue;
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    content = content.replace('<button class="cta-btn small">Sign In</button>', navReplacement);
    
    if (!content.includes('<script src="script.js"></script>')) {
        content = content.replace('</body>', '    <script src="script.js"></script>\n</body>');
    }
    
    if (!content.includes('id="cart-overlay"')) {
        if (content.includes('    <script src="script.js"></script>')) {
            content = content.replace('    <script src="script.js"></script>', cartHtml + '\n    <script src="script.js"></script>');
        } else {
            content = content.replace('</body>', cartHtml + '\n</body>');
        }
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
}

console.log('HTML files updated successfully.');
