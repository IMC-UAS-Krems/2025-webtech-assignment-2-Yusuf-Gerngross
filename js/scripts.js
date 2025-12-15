const products = [
    { id: 1, name: "Cozy Recovery Kit", price: 30, desc: "Fleece blanket and grip socks.", img: "recovery.jpg" },
    { id: 2, name: "Chemo Care Bag", price: 45, desc: "Nausea relief and skincare.", img: "chemo-bag.jpg" },
    { id: 3, name: "Headwear Bundle", price: 25, desc: "Soft bamboo beanies.", img: "headwear.jpg" },
    { id: 4, name: "Post-Surgery Pillow", price: 20, desc: "Supportive recovery pillow.", img: "pillow.jpg" },
    { id: 5, name: "Mental Health Session", price: 60, desc: "1-hour emotional support counseling.", img: "counseling.jpg" },
    { id: 6, name: "Nutritional Consultation", price: 40, desc: "Dietary planning sessions.", img: "nutrition.jpg" },
    { id: 7, name: "In-Home Assistance", price: 75, desc: "Light cleaning and meal prep help.", img: "home-help.jpg" },
    { id: 8, name: "Ride to Treatment", price: 15, desc: "Transportation for appointments.", img: "ride.jpg" },
    { id: 9, name: "Childcare Support", price: 50, desc: "Care for little ones during appointments.", img: "childcare.jpg" },
    { id: 10, name: "Emergency Grant", price: 100, desc: "Help with utility bills and medical co-pays.", img: "grant.jpg" }
];

let cart = [];

function renderProducts() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    grid.innerHTML = products.map(item => `
        <div class="col-md-6 col-lg-4">
            <div class="card h-100 shadow-sm border-0">
                <div style="height: 200px; cursor: zoom-in;" onclick="openImage('${item.img}', '${item.name}')">
                    <img src="img/${item.img}" class="w-100 h-100" style="object-fit: cover; border-radius: 15px 15px 0 0;">
                </div>
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title fw-bold">${item.name}</h5>
                    <p class="mt-auto fw-bold text-primary">€${item.price}</p>
                    <button class="btn btn-outline-primary btn-sm w-100 rounded-pill" onclick="addToCart(${item.id})">Add to Donation</button>
                </div>
            </div>
        </div>
    `).join('');
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    const existing = cart.find(item => item.id === id);
    if (existing) { existing.quantity += 1; } else { cart.push({ ...product, quantity: 1 }); }
    showAlert(`Added ${product.name} to donation!`, "success");
}

function navToCart() {
    const cartList = document.getElementById('cart-list');
    const continueBtn = document.getElementById('cart-continue-btn');
    if (cart.length === 0) {
        cartList.innerHTML = `<div class="text-center p-4"><h4>Cart is empty</h4></div>`;
        continueBtn.classList.add('d-none');
    } else {
        let html = `<ul class="list-group border-0">`;
        cart.forEach((item, index) => {
            html += `
                <li class="list-group-item d-flex justify-content-between align-items-center border-0 border-bottom py-3">
                    <div><h6 class="mb-0 fw-bold">${item.name}</h6><small>€${item.price} each</small></div>
                    <div class="d-flex align-items-center">
                        <div class="input-group input-group-sm me-3" style="width: 100px;">
                            <button class="btn btn-outline-secondary" onclick="updateQty(${index}, -1)" ${item.quantity === 1 ? 'disabled' : ''}>-</button>
                            <span class="input-group-text bg-white">${item.quantity}</span>
                            <button class="btn btn-outline-secondary" onclick="updateQty(${index}, 1)">+</button>
                        </div>
                        <button class="btn btn-sm text-danger" onclick="removeFromCart(${index})">Remove</button>
                    </div>
                </li>`;
        });
        const subtotal = cart.reduce((s, i) => s + (i.price * i.quantity), 0);
        const totalItems = cart.reduce((s, i) => s + i.quantity, 0);
        const discount = totalItems >= 3 ? subtotal * 0.15 : 0;
        const finalTotal = subtotal - discount;

        html += `</ul><div class="mt-4 p-3 bg-light rounded shadow-sm">`;
        html += `<div class="d-flex justify-content-between mb-1"><span>Subtotal:</span><span>€${subtotal.toFixed(2)}</span></div>`;
        if (discount > 0) {
            html += `<div class="d-flex justify-content-between mb-1 text-success fw-bold"><span>Savings (15%):</span><span>€${discount.toFixed(2)}</span></div>`;
            html += `<hr><div class="d-flex justify-content-between fw-bold text-primary fs-5"><span>Price after discount:</span><span>€${finalTotal.toFixed(2)}</span></div>`;
        } else {
            html += `<hr><div class="d-flex justify-content-between fw-bold fs-5"><span>Total Price:</span><span>€${finalTotal.toFixed(2)}</span></div>`;
        }
        html += `</div>`;
        cartList.innerHTML = html;
        continueBtn.classList.remove('d-none');
    }
    goToStep(2);
}

function updateQty(index, change) { cart[index].quantity += change; navToCart(); }
function removeFromCart(index) { cart.splice(index, 1); navToCart(); }
function navToCheckout() { if (cart.length > 0) goToStep(3); }

function goToStep(step) {
    document.querySelectorAll('[id^="step-"]').forEach(el => el.classList.add('d-none'));
    document.getElementById('step-' + step).classList.remove('d-none');
    const widths = ["25%", "50%", "75%", "100%"];
    document.getElementById('main-progress').style.width = widths[step-1];
    window.scrollTo(0, 0);
}

function openImage(img, title) {
    document.getElementById('fullSizeImage').src = 'img/' + img;
    document.getElementById('imageCaption').innerText = title;
    new bootstrap.Modal(document.getElementById('imageModal')).show();
}

function showAlert(msg, type) {
    const container = document.getElementById('alert-container');
    container.innerHTML = `<div class="alert alert-${type} fade show border-0 shadow-sm">${msg}</div>`;
    setTimeout(() => container.innerHTML = '', 3000);
}

document.getElementById('checkout-form').addEventListener('submit', function(e) {
    e.preventDefault();
    if (this.checkValidity()) showConfirmation();
});

function showConfirmation() {
    const firstName = document.getElementById('firstName').value;
    const subtotal = cart.reduce((s, i) => s + (i.price * i.quantity), 0);
    const totalItems = cart.reduce((s, i) => s + i.quantity, 0);
    const discount = totalItems >= 3 ? subtotal * 0.15 : 0;
    const total = subtotal - discount;

    document.getElementById('summary-name').innerText = firstName;
    let summaryHtml = `<ul class="list-group mb-3 border-0">`;
    cart.forEach(item => { summaryHtml += `<li class="list-group-item d-flex justify-content-between border-0 py-1"><span>${item.name} (x${item.quantity})</span><span>€${(item.price * item.quantity).toFixed(2)}</span></li>`; });
    summaryHtml += `<hr><li class="list-group-item d-flex justify-content-between border-0"><span>Subtotal:</span><span>€${subtotal.toFixed(2)}</span></li>`;
    if (discount > 0) {
        summaryHtml += `<li class="list-group-item d-flex justify-content-between border-0 text-success"><span>Savings (15%):</span><span>€${discount.toFixed(2)}</span></li>
        <li class="list-group-item d-flex justify-content-between border-0 fw-bold fs-5 mt-2 bg-light p-3 rounded"><span>Price after discount:</span><span>€${total.toFixed(2)}</span></li>`;
    } else {
        summaryHtml += `<li class="list-group-item d-flex justify-content-between border-0 fw-bold fs-5 mt-2 bg-light p-3 rounded"><span>Total Price:</span><span>€${total.toFixed(2)}</span></li>`;
    }
    document.getElementById('order-summary').innerHTML = summaryHtml + `</ul>`;
    goToStep(4);
}

window.onload = renderProducts;