// Add subtle scroll reveal animations
document.addEventListener('DOMContentLoaded', () => {
    // Add scroll listener for navbar shadow
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
        } else {
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // AI Chatbot Logic
    const chatWidget = document.querySelector('.floating-chat');
    const chatWindow = document.getElementById('chat-window');
    
    if(chatWidget && chatWindow) {
        const closeChatBtn = document.getElementById('close-chat');
        const chatMessages = document.getElementById('chat-messages');
        const chatInput = document.getElementById('chat-input');
        const sendChatBtn = document.getElementById('send-chat');

        chatWidget.addEventListener('click', () => {
            chatWindow.classList.toggle('active');
            if(chatWindow.classList.contains('active')) {
                chatInput.focus();
            }
        });

        closeChatBtn.addEventListener('click', () => {
            chatWindow.classList.remove('active');
        });

        function appendMessage(text, sender) {
            const msgDiv = document.createElement('div');
            msgDiv.classList.add('chat-msg', sender);
            
            // Basic markdown formatting (bold and newlines)
            let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            formattedText = formattedText.replace(/\n/g, '<br>');
            
            msgDiv.innerHTML = `<p>${formattedText}</p>`;
            chatMessages.appendChild(msgDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        function showTyping() {
            const typingDiv = document.createElement('div');
            typingDiv.classList.add('chat-msg', 'bot', 'typing-indicator');
            typingDiv.id = 'typing-indicator';
            typingDiv.innerHTML = `<span></span><span></span><span></span>`;
            chatMessages.appendChild(typingDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        function removeTyping() {
            const typing = document.getElementById('typing-indicator');
            if (typing) typing.remove();
        }

        // Simulated AI Logic (No API Key Required for Demo)
        async function handleSend() {
            const userText = chatInput.value.trim();
            if (!userText) return;

            // Show user message
            appendMessage(userText, 'user');
            chatInput.value = '';
            
            // Show typing indicator
            showTyping();

            // Simulate network delay and AI processing
            setTimeout(() => {
                removeTyping();
                
                let botResponse = "";
                const lowerText = userText.toLowerCase();

                // Simulated AI keyword matching logic
                if (lowerText.includes("hello") || lowerText.includes("hi")) {
                    botResponse = "Hello! Welcome to SAM Dairy. How can I help you with your milk delivery today?";
                } else if (lowerText.includes("missing") || lowerText.includes("didn't receive") || lowerText.includes("not delivered")) {
                    botResponse = "I am so sorry to hear your milk was missing! Please provide your pincode or registered phone number, and I will immediately alert the delivery agent for your area to bring it to you.";
                } else if (lowerText.includes("price") || lowerText.includes("cost") || lowerText.includes("how much") || lowerText.includes("rate")) {
                    botResponse = "Our prices vary by brand! For example, **Amul Gold** (Full Cream) is ₹66/L, and **Mother Dairy Toned** is ₹54/L. You can see all prices by clicking the brand logos on our homepage!";
                } else if (lowerText.includes("brand") || lowerText.includes("which milk")) {
                    botResponse = "We proudly deliver **Amul, Mother Dairy, Parag, and Nandini** directly to your doorstep before 7:00 AM every morning.";
                } else if (lowerText.includes("subscribe") || lowerText.includes("start") || lowerText.includes("daily") || lowerText.includes("order")) {
                    botResponse = "Starting a daily delivery is easy! Just click on your favorite brand from our homepage, select your milk type, and click **'Add to Subscription'**. We'll handle the rest!";
                } else if (lowerText.includes("time") || lowerText.includes("when")) {
                    botResponse = "Our delivery executives ensure your milk is safely placed at your doorstep **every morning before 7:00 AM**.";
                } else if (lowerText.includes("contact") || lowerText.includes("email") || lowerText.includes("support") || lowerText.includes("human") || lowerText.includes("helpdesk")) {
                    botResponse = "If you need to reach out to us directly, you can contact our support team via email at **chikuu0012@gmail.com**. We will get back to you as soon as possible!";
                } else {
                    botResponse = "That's a great question! For detailed support, you can easily contact us directly at **chikuu0012@gmail.com**. Is there anything else I can help you with regarding our milk deliveries?";
                }

                appendMessage(botResponse, 'bot');
            }, 1200); // 1.2 second delay to simulate "thinking"
        }

        sendChatBtn.addEventListener('click', handleSend);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSend();
        });

        // Quick Options Logic
        const quickOptions = document.querySelectorAll('.quick-option');
        quickOptions.forEach(option => {
            option.addEventListener('click', () => {
                chatInput.value = option.innerText;
                handleSend();
                // Optionally hide the quick options after the first click
                document.getElementById('chat-quick-options').style.display = 'none';
            });
        });
    }

    // --- Cart Logic ---
    let cart = JSON.parse(localStorage.getItem('samDairyCart')) || [];
    const cartBtn = document.getElementById('cart-btn');
    const closeCartBtn = document.getElementById('close-cart');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const cartCountElements = document.querySelectorAll('.cart-count');
    const checkoutBtn = document.getElementById('checkout-btn');

    function saveCart() {
        localStorage.setItem('samDairyCart', JSON.stringify(cart));
        updateCartUI();
    }

    function toggleCart() {
        if(cartOverlay && cartSidebar) {
            cartOverlay.classList.toggle('active');
            cartSidebar.classList.toggle('active');
        }
    }

    if(cartBtn) cartBtn.addEventListener('click', toggleCart);
    if(closeCartBtn) closeCartBtn.addEventListener('click', toggleCart);
    if(cartOverlay) cartOverlay.addEventListener('click', toggleCart);

    function updateCartUI() {
        if(!cartItemsContainer) return;
        
        cartItemsContainer.innerHTML = '';
        let total = 0;
        let count = 0;

        if(cart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="cart-empty">Your cart is empty.</div>';
        } else {
            cart.forEach((item, index) => {
                total += item.price * item.quantity;
                count += item.quantity;

                const itemDiv = document.createElement('div');
                itemDiv.classList.add('cart-item');
                itemDiv.innerHTML = `
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>${item.variant} x ${item.quantity}</p>
                        <div class="cart-item-price">₹${item.price * item.quantity}</div>
                    </div>
                    <div class="cart-item-controls">
                        <button class="cart-item-remove" data-index="${index}"><i class="fa-solid fa-trash"></i></button>
                    </div>
                `;
                cartItemsContainer.appendChild(itemDiv);
            });
        }

        if(cartTotalPrice) cartTotalPrice.innerText = `₹${total}`;
        cartCountElements.forEach(el => el.innerText = count);
        
        // Add remove listeners
        document.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.currentTarget.getAttribute('data-index');
                cart.splice(index, 1);
                saveCart();
            });
        });
    }

    // Add to cart listeners
    document.querySelectorAll('.product-info button').forEach(btn => {
        if(btn.innerText.includes('Add to')) {
            btn.addEventListener('click', (e) => {
                const productInfo = e.currentTarget.closest('.product-info');
                const name = productInfo.querySelector('h3').innerText;
                const checkedVariant = productInfo.querySelector('input[type="radio"]:checked');
                
                if(!checkedVariant) return;

                const variantBox = checkedVariant.nextElementSibling;
                const variantName = variantBox.querySelector('.qty').innerText;
                const priceStr = variantBox.querySelector('.price').innerText;
                const price = parseInt(priceStr.replace(/[^0-9]/g, ''));

                // Check if already in cart
                const existingItem = cart.find(i => i.name === name && i.variant === variantName);
                if(existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cart.push({
                        name: name,
                        variant: variantName,
                        price: price,
                        quantity: 1
                    });
                }
                
                saveCart();
                
                // Show feedback
                const originalText = btn.innerText;
                btn.innerText = 'Added!';
                btn.style.backgroundColor = '#48bb78';
                btn.style.color = 'white';
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.backgroundColor = '';
                    btn.style.color = '';
                }, 1500);

                // Open cart
                if(!cartSidebar.classList.contains('active')) {
                    toggleCart();
                }
            });
        }
    });

    if(checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if(cart.length === 0) {
                alert('Your cart is empty!');
                return;
            }
            alert('Proceeding to checkout...');
        });
    }

    // Initialize cart UI on load
    updateCartUI();

    // --- Auth / Google Sign In Logic ---
    const authOverlay = document.createElement('div');
    authOverlay.className = 'auth-overlay';
    authOverlay.innerHTML = `
        <div class="auth-modal">
            <button class="close-auth" id="close-auth"><i class="fa-solid fa-xmark"></i></button>
            <div style="font-size: 3.5rem; color: var(--primary); margin-bottom: 1rem;"><i class="fa-regular fa-circle-user"></i></div>
            <h2>Welcome Back</h2>
            <p>Sign in to manage your daily milk subscriptions and track deliveries.</p>
            <button class="google-btn" id="google-signin-btn">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google">
                Continue with Google
            </button>
        </div>
    `;
    document.body.appendChild(authOverlay);

    const closeAuthBtn = document.getElementById('close-auth');
    const googleSignInBtn = document.getElementById('google-signin-btn');
    const signInBtns = document.querySelectorAll('.nav-actions .cta-btn.small');

    let currentUser = JSON.parse(localStorage.getItem('samDairyUser'));

    function updateNavAuthUI() {
        signInBtns.forEach(btn => {
            if (currentUser) {
                // Ensure profile div doesn't already exist
                if (!btn.nextElementSibling || !btn.nextElementSibling.classList.contains('user-profile')) {
                    const profileDiv = document.createElement('div');
                    profileDiv.className = 'user-profile';
                    profileDiv.title = "Click to Log Out";
                    profileDiv.innerHTML = `
                        <div class="user-avatar">${currentUser.name.charAt(0)}</div>
                    `;
                    // Add click listener to log out
                    profileDiv.addEventListener('click', () => {
                        if(confirm('Do you want to log out?')) {
                            localStorage.removeItem('samDairyUser');
                            currentUser = null;
                            btn.style.display = 'inline-block';
                            profileDiv.remove();
                        }
                    });

                    btn.style.display = 'none';
                    btn.parentNode.insertBefore(profileDiv, btn.nextSibling);
                }
            } else {
                btn.style.display = 'inline-block';
                const profileDiv = btn.parentNode.querySelector('.user-profile');
                if(profileDiv) profileDiv.remove();
            }
        });
    }

    signInBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            authOverlay.classList.add('active');
        });
    });

    if(closeAuthBtn) {
        closeAuthBtn.addEventListener('click', () => {
            authOverlay.classList.remove('active');
        });
    }

    authOverlay.addEventListener('click', (e) => {
        if(e.target === authOverlay) authOverlay.classList.remove('active');
    });

    if(googleSignInBtn) {
        googleSignInBtn.addEventListener('click', () => {
            // Mock Google Sign in
            const originalText = googleSignInBtn.innerHTML;
            googleSignInBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Connecting...';
            
            setTimeout(() => {
                currentUser = {
                    name: 'User',
                    email: 'user@gmail.com'
                };
                localStorage.setItem('samDairyUser', JSON.stringify(currentUser));
                updateNavAuthUI();
                authOverlay.classList.remove('active');
                googleSignInBtn.innerHTML = originalText;
            }, 1200);
        });
    }

    // Init Auth UI
    updateNavAuthUI();
});
