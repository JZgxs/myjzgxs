// 商品数据
const products = [
    {
        id: 1,
        name: "有机大米",
        price: 59.9,
        image: "https://via.placeholder.com/300x200?text=有机大米",
        description: "产自黑龙江的优质有机大米，颗粒饱满，口感细腻。",
        specs: ["5kg", "10kg", "20kg"]
    },
    {
        id: 2,
        name: "新鲜水果",
        price: 39.9,
        image: "https://via.placeholder.com/300x200?text=新鲜水果",
        description: "当季新鲜水果，产地直供，品质保证。",
        specs: ["1kg", "2kg", "5kg"]
    },
    {
        id: 3,
        name: "土鸡蛋",
        price: 29.9,
        image: "https://via.placeholder.com/300x200?text=土鸡蛋",
        description: "散养土鸡蛋，营养丰富，口感鲜美。",
        specs: ["10个", "20个", "30个"]
    },
    {
        id: 4,
        name: "新鲜玉米",
        price: 4.0,
        image: "https://via.placeholder.com/300x200?text=新鲜玉米",
        description: "当季新鲜玉米，颗粒饱满，香甜可口。",
        specs: ["1根", "5根", "10根"]
    },
    {
        id: 5,
        name: "纯芝麻香油",
        price: 50.0,
        image: "https://via.placeholder.com/300x200?text=纯芝麻香油",
        description: "传统工艺压榨，纯正芝麻油，香味浓郁。",
        specs: ["500ml", "1L", "2L"]
    },
    {
        id: 6,
        name: "红薯细粉",
        price: 60.0,
        image: "https://via.placeholder.com/300x200?text=红薯细粉",
        description: "传统手工制作，口感细腻，营养丰富。",
        specs: ["1斤", "2斤", "5斤"]
    }
];

// 购物车数据
let cart = [];

// 从localStorage加载购物车数据
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
        } catch (e) {
            console.error('Error loading cart:', e);
            cart = [];
        }
    }
}

// 更新购物车数量显示
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }
}

// 保存购物车数据到localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// 首页商品展示
function displayProducts() {
    const productGrid = document.getElementById('product-grid');
    if (productGrid) {
        productGrid.innerHTML = products.map(product => `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-price">¥${product.price.toFixed(2)}</p>
                    <button class="add-to-cart" onclick="addToCart(${product.id})">加入购物车</button>
                    <a href="product.html?id=${product.id}" class="view-detail">查看详情</a>
                </div>
            </div>
        `).join('');
    }
}

// 商品详情页展示
function displayProductDetail() {
    const productDetail = document.getElementById('product-detail');
    if (productDetail) {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = parseInt(urlParams.get('id'));
        const product = products.find(p => p.id === productId);

        if (product) {
            productDetail.innerHTML = `
                <div class="product-detail-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-detail-info">
                    <h1>${product.name}</h1>
                    <p class="product-price">¥${product.price.toFixed(2)}</p>
                    <p class="product-description">${product.description}</p>
                    <div class="specs">
                        <h3>规格选择：</h3>
                        ${product.specs.map(spec => `
                            <span class="spec-option" onclick="selectSpec(this)">${spec}</span>
                        `).join('')}
                    </div>
                    <button class="add-to-cart" onclick="addToCart(${product.id})">加入购物车</button>
                </div>
            `;
        }
    }
}

// 购物车页面展示
function displayCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if (cartItems) {
        if (cart.length === 0) {
            cartItems.innerHTML = '<p>购物车是空的</p>';
            if (cartTotal) cartTotal.textContent = '¥0.00';
            return;
        }

        cartItems.innerHTML = cart.map(item => {
            const product = products.find(p => p.id === item.id);
            return `
                <div class="cart-item">
                    <img src="${product.image}" alt="${product.name}" class="cart-item-image">
                    <div class="cart-item-info">
                        <h3>${product.name}</h3>
                        <p>规格：${item.spec}</p>
                        <p>单价：¥${product.price.toFixed(2)}</p>
                        <div class="quantity-controls">
                            <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                            <span>${item.quantity}</span>
                            <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                        </div>
                    </div>
                    <div class="cart-item-total">
                        ¥${(product.price * item.quantity).toFixed(2)}
                    </div>
                </div>
            `;
        }).join('');

        // 更新总价
        if (cartTotal) {
            const total = cart.reduce((sum, item) => {
                const product = products.find(p => p.id === item.id);
                return sum + (product.price * item.quantity);
            }, 0);
            cartTotal.textContent = `¥${total.toFixed(2)}`;
        }
    }
}

// 添加商品到购物车
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const selectedSpec = document.querySelector('.spec-option.selected');
    
    if (!selectedSpec && window.location.pathname.includes('product.html')) {
        alert('请选择商品规格');
        return;
    }

    const spec = selectedSpec ? selectedSpec.textContent : product.specs[0];
    const existingItem = cart.find(item => item.id === productId && item.spec === spec);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            spec: spec,
            quantity: 1
        });
    }

    saveCart();
    alert('已添加到购物车');
}

// 更新购物车商品数量
function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        cart = cart.filter(item => !(item.id === productId));
    } else {
        const item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity = newQuantity;
        }
    }
    saveCart();
    displayCart();
}

// 选择商品规格
function selectSpec(element) {
    const specs = element.parentElement.querySelectorAll('.spec-option');
    specs.forEach(spec => spec.classList.remove('selected'));
    element.classList.add('selected');
}

// 结算按钮点击事件
document.getElementById('checkout-btn')?.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('购物车是空的');
        return;
    }
    alert('订单提交成功！');
    cart = [];
    saveCart();
    displayCart();
});

// 显示订单历史
function displayOrders() {
    const ordersList = document.getElementById('orders-list');
    if (ordersList) {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        
        if (orders.length === 0) {
            ordersList.innerHTML = '<p>暂无订单记录</p>';
            return;
        }

        ordersList.innerHTML = orders.map(order => `
            <div class="order-card">
                <div class="order-header">
                    <div>
                        <span class="order-id">订单号：${order.id}</span>
                        <span class="order-date">${order.date}</span>
                    </div>
                    <span class="order-status">${order.status}</span>
                </div>
                <div class="order-items">
                    ${order.items.map(item => {
                        const product = products.find(p => p.id === item.id);
                        return `
                            <div class="order-item">
                                <img src="${product.image}" alt="${product.name}" class="order-item-image">
                                <div class="order-item-info">
                                    <h3>${product.name}</h3>
                                    <p>规格：${item.spec}</p>
                                    <p>数量：${item.quantity}</p>
                                    <p>单价：¥${product.price.toFixed(2)}</p>
                                </div>
                                <div class="order-item-total">
                                    ¥${(product.price * item.quantity).toFixed(2)}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
                <div class="order-total">
                    总计：¥${order.total.toFixed(2)}
                </div>
            </div>
        `).join('');
    }
}

// 模拟快递数据
const expressData = {
    "123456789": {
        company: "顺丰速运",
        number: "SF1234567890",
        status: "运输中",
        steps: [
            {
                status: "已发货",
                location: "北京市朝阳区",
                time: "2024-03-20 10:30"
            },
            {
                status: "运输中",
                location: "北京市海淀区",
                time: "2024-03-20 14:20"
            },
            {
                status: "待派送",
                location: "北京市西城区",
                time: "2024-03-20 16:45"
            }
        ]
    }
};

// 查询快递
function searchExpress() {
    const orderId = document.getElementById('express-search').value.trim();
    const expressResult = document.getElementById('express-result');
    
    if (!orderId) {
        alert('请输入订单号');
        return;
    }

    // 获取订单信息
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const order = orders.find(o => o.id.toString() === orderId);

    if (!order) {
        expressResult.innerHTML = '<p class="error">未找到该订单</p>';
        expressResult.classList.add('active');
        return;
    }

    // 模拟快递查询
    const express = expressData[orderId] || {
        company: "顺丰速运",
        number: "SF" + Math.random().toString().slice(2, 12),
        status: "运输中",
        steps: [
            {
                status: "已发货",
                location: "北京市朝阳区",
                time: new Date(Date.now() - 86400000).toLocaleString()
            },
            {
                status: "运输中",
                location: "北京市海淀区",
                time: new Date(Date.now() - 43200000).toLocaleString()
            },
            {
                status: "待派送",
                location: "北京市西城区",
                time: new Date().toLocaleString()
            }
        ]
    };

    // 显示快递信息
    expressResult.innerHTML = `
        <h3>快递信息</h3>
        <p>快递公司：${express.company}</p>
        <p>运单号：${express.number}</p>
        <p>当前状态：${express.status}</p>
        <div class="express-timeline">
            ${express.steps.map((step, index) => `
                <div class="express-step ${index === express.steps.length - 1 ? 'pending' : 'completed'}">
                    <div class="express-status">${step.status}</div>
                    <div class="express-location">${step.location}</div>
                    <div class="express-time">${step.time}</div>
                </div>
            `).join('')}
        </div>
    `;
    expressResult.classList.add('active');
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', () => {
    loadCart(); // 加载购物车数据
    updateCartCount();
    
    if (window.location.pathname.includes('index.html')) {
        displayProducts();
    } else if (window.location.pathname.includes('product.html')) {
        displayProductDetail();
    } else if (window.location.pathname.includes('cart.html')) {
        displayCart();
    } else if (window.location.pathname.includes('orders.html')) {
        displayOrders();
    }
}); 