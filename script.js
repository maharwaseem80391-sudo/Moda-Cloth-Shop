
const products = [
  {id:1,name:"Oversized Cotton T-Shirt",category:"T-Shirts",price:32,tag:"NEW",image:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600",colors:["Beige","Black","White"],sizes:["S","M","L","XL"]},
  {id:2,name:"Street Hoodie",category:"Hoodies",price:58,tag:"BESTSELLER",image:"https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600",colors:["Black","Olive","Beige"],sizes:["S","M","L","XL"]},
  {id:3,name:"Embroidered Kurti",category:"Kurtis",price:45,tag:"TRENDING",image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAbm4wDK3IKaGClF6n3EQ0PGVCSKZ3U60wd6X0t0SClVKDCzmu2YRKadXD&s=10",colors:["Beige","White"],sizes:["S","M","L","XL"]},
  {id:4,name:"Slim Fit Denim Jeans",category:"Jeans",price:64,tag:"NEW",image:"https://images.unsplash.com/photo-1542272604-787c3835535d?w=600",colors:["Blue","Black"],sizes:["S","M","L","XL"]},
  {id:5,name:"Puffer Jacket",category:"Jackets",price:71,oldPrice:89,tag:"SALE",image:"https://images.unsplash.com/photo-1544923246-77307dd654cb?w=600",colors:["Beige","Black"],sizes:["M","L","XL"]},
  {id:6,name:"Kids Graphic Hoodie",category:"Hoodies",price:28,tag:"KIDS",image:"https://images.unsplash.com/photo-1578681994506-b8f463449011?w=600",colors:["Beige","Olive"],sizes:["S","M","L"]},
  {id:7,name:"Classic White Shirt",category:"Shirts",price:40,tag:"CLASSIC",image:"https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600",colors:["White","Beige"],sizes:["S","M","L","XL"]},
  {id:8,name:"Floral Summer Dress",category:"Dresses",price:55,tag:"NEW",image:"https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600",colors:["Beige","White"],sizes:["S","M","L"]},
  {id:9,name:"Beige Wool Coat",category:"Jackets",price:95,tag:"PREMIUM",image:"https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600",colors:["Beige","Black"],sizes:["S","M","L","XL"]},
  {id:10,name:"Black T-Shirt",category:"T-Shirts",price:25,tag:"ESSENTIAL",image:"https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600",colors:["Black","White"],sizes:["S","M","L","XL"]},
  {id:11,name:"Minimal Sneakers",category:"Shoes",price:95,tag:"POPULAR",image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",colors:["White","Black"],sizes:["S","M","L","XL"]},
  {id:12,name:"Cotton Linen Jacket",category:"Jackets",price:129,tag:"BESTSELLER",image:"https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600",colors:["Beige","Olive"],sizes:["M","L","XL"]}
];

let cart = [];
let wishlist = [];
let selectedSize = {};
let activeSize = "";
let activeColor = "";
let promoApplied = false;
let checkoutPromoApplied = false;
let discountPercent = 0;
let detailQty = 1;
let detailColor = "Black";
let detailSize = "M";
let activeProductCategory = "";
let loginMode = "login";

const $ = id => document.getElementById(id);
const money = amount => "$" + amount.toFixed(2);

function renderProducts() {
  const checkedCategories = [...document.querySelectorAll("#categoryFilters input:checked")].map(x => x.value);
  const checkedTags = [...document.querySelectorAll(".tag-filter:checked")].map(x => x.value);
  const maxPrice = Number($("priceRange").value);
  const search = $("searchInput").value.toLowerCase();
  const sort = $("sortSelect").value;

  $("priceValue").textContent = money(maxPrice);

  let list = products.filter(p => {
    const categoryMatch = checkedCategories.length === 0 || checkedCategories.includes(p.category);
    const tagMatch = checkedTags.length === 0 || checkedTags.includes(p.tag);
    const sizeMatch = !activeSize || p.sizes.includes(activeSize);
    const colorMatch = !activeColor || p.colors.includes(activeColor);
    const searchMatch = (p.name + " " + p.category + " " + p.tag).toLowerCase().includes(search);
    return categoryMatch && tagMatch && sizeMatch && colorMatch && p.price <= maxPrice && searchMatch;
  });

  if (sort === "low") list.sort((a,b) => a.price-b.price);
  if (sort === "high") list.sort((a,b) => b.price-a.price);

  $("productCount").textContent = list.length + " Products";

  $("productGrid").innerHTML = list.map(p => `
    <article class="product-card" data-id="${p.id}">
      <div class="product-image">
        <img src="${p.image}" alt="${p.name}" loading="lazy">
        <span class="product-tag">${p.tag}</span>
        <button class="wish-button ${wishlist.includes(p.id) ? "active" : ""}" onclick="toggleWishlist(${p.id},event)">
          ${wishlist.includes(p.id) ? "♥" : "♡"}
        </button>
      </div>
      <div class="product-info">
        <h3>${p.name}</h3>
        <div class="product-price">${money(p.price)}
          ${p.oldPrice ? `<span class="old-price">${money(p.oldPrice)}</span>` : ""}
        </div>
        <div class="card-sizes">
          ${p.sizes.map(s => `<button class="${selectedSize[p.id] === s ? "active" : ""}" onclick="chooseSize(${p.id},'${s}',this)">${s}</button>`).join("")}
        </div>
        <div class="card-colors">
          ${p.colors.map(c => `<span title="${c}" style="background:${colorCode(c)}"></span>`).join("")}
        </div>
        <button class="add-btn" onclick="addToCart(${p.id})">♧ ADD TO CART</button>
      </div>
    </article>
  `).join("") || `<p class="muted">No products found. Try changing your filters.</p>`;

  activateTilt();
}

function colorCode(color) {
  return {
    Beige:"#d9c5a7",Black:"#111111",Olive:"#6b7a4f",
    Blue:"#8298ae",White:"#ffffff"
  }[color] || "#ccc";
}

function chooseSize(id,size,button) {
  selectedSize[id] = size;
  const card = button.closest(".product-card");
  card.querySelectorAll(".card-sizes button").forEach(b => b.classList.remove("active"));
  button.classList.add("active");
}

function filterCategory(category) {
  document.querySelectorAll("#categoryFilters input").forEach(input => {
    input.checked = input.value === category;
  });
  activeSize = "";
  activeColor = "";
  renderProducts();
  $("shop").scrollIntoView({behavior:"smooth"});
}

function setSize(size,button) {
  activeSize = activeSize === size ? "" : size;
  document.querySelectorAll(".size-filter button").forEach(b => b.classList.remove("active"));
  if(activeSize) button.classList.add("active");
  renderProducts();
}

function setColor(color,button) {
  activeColor = activeColor === color ? "" : color;
  document.querySelectorAll(".color-dot").forEach(b => b.classList.remove("active"));
  if(activeColor) button.classList.add("active");
  renderProducts();
}

function clearFilters() {
  document.querySelectorAll("#categoryFilters input,.tag-filter").forEach(i => i.checked = false);
  document.querySelectorAll(".size-filter button,.color-dot").forEach(b => b.classList.remove("active"));
  activeSize = "";
  activeColor = "";
  $("priceRange").value = 129;
  $("searchInput").value = "";
  $("sortSelect").value = "popular";
  renderProducts();
}

$("categoryFilters").addEventListener("change",renderProducts);
document.querySelectorAll(".tag-filter").forEach(x => x.addEventListener("change",renderProducts));
$("priceRange").addEventListener("input",renderProducts);

function addToCart(id) {
  const p = products.find(x => x.id === id);
  const size = selectedSize[id] || "M";
  const existing = cart.find(x => x.id === id && x.size === size);

  if(existing) existing.qty++;
  else cart.push({
    id:p.id,name:p.name,price:p.price,image:p.image,
    size,color:p.colors[0],qty:1
  });

  updateCart();
  const button = document.querySelector(`.product-card[data-id="${id}"] .add-btn`);
  if(button) {
    button.textContent = "✓ ADDED!";
    button.style.background = "#6b7a4f";
    setTimeout(() => {
      button.textContent = "♧ ADD TO CART";
      button.style.background = "";
    },900);
  }
}

function addDetailToCart() {
  const p = {
    id:2,name:"Essential 3D Hoodie",price:89,
    image:$("detailMainImg").src,
    size:detailSize,color:detailColor
  };
  const existing = cart.find(x => x.id === 2 && x.size === detailSize && x.color === detailColor);
  if(existing) existing.qty += detailQty;
  else cart.push({...p,qty:detailQty});
  updateCart();
  openCart();
}

function updateCart() {
  const count = cart.reduce((sum,item) => sum+item.qty,0);
  $("cartCount").textContent = count;
  $("drawerCount").textContent = count;

  $("cartItems").innerHTML = cart.map((item,index) => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div>
        <h4>${item.name}</h4>
        <p>Size: ${item.size} · Color: ${item.color}</p>
        <strong>${money(item.price * item.qty)}</strong>
        <div class="cart-controls">
          <button onclick="changeCartQty(${index},-1)">−</button>
          <span>${item.qty}</span>
          <button onclick="changeCartQty(${index},1)">+</button>
          <button class="remove-btn" onclick="removeCartItem(${index})">Remove</button>
        </div>
      </div>
    </div>
  `).join("") || `<p class="muted" style="padding:30px 0">Your cart is empty. Start shopping!</p>`;

  updateTotals();
}

function subtotalAmount() {
  return cart.reduce((sum,item) => sum + item.price*item.qty,0);
}

function updateTotals() {
  const subtotal = subtotalAmount();
  const discount = promoApplied ? subtotal*discountPercent : 0;
  const total = subtotal-discount;

  $("subtotal").textContent = money(subtotal);
  $("discount").textContent = "-" + money(discount);
  $("total").textContent = money(total);
  $("checkoutSubtotal").textContent = money(subtotal);
  $("checkoutTotal").textContent = money(total);

  $("checkoutItems").innerHTML = cart.map(item => `
    <div class="summary-line">
      <span>${item.name} × ${item.qty}<br><small>${item.size} / ${item.color}</small></span>
      <b>${money(item.price*item.qty)}</b>
    </div>
  `).join("");

  if(!cart.length) $("checkoutItems").innerHTML = `<p class="muted">No items in your cart.</p>`;
}

function changeCartQty(index,change) {
  cart[index].qty += change;
  if(cart[index].qty <= 0) cart.splice(index,1);
  updateCart();
}

function removeCartItem(index) {
  cart.splice(index,1);
  updateCart();
}

function applyPromo() {
  const code = $("promoInput").value.trim().toUpperCase();
  if(code === "WELCOME10") {
    promoApplied = true;
    discountPercent = .10;
    $("promoMessage").textContent = "✓ 10% discount applied successfully!";
    $("promoMessage").style.color = "green";
  } else {
    $("promoMessage").textContent = "Invalid code. Try WELCOME10.";
    $("promoMessage").style.color = "#a33";
  }
  updateTotals();
}

function applyCheckoutPromo() {
  const code = $("checkoutPromo").value.trim().toUpperCase();
  if(code === "WELCOME10") {
    promoApplied = true;
    discountPercent = .10;
    checkoutPromoApplied = true;
    alert("WELCOME10 applied successfully!");
  } else {
    alert("Invalid promo code.");
  }
  updateTotals();
}

function openCart() {
  $("overlay").classList.add("active");
  $("cartDrawer").classList.add("active");
}
function closePanels() {
  $("overlay").classList.remove("active");
  $("cartDrawer").classList.remove("active");
}

function goCheckout() {
  closePanels();
  updateTotals();
  $("checkout").scrollIntoView({behavior:"smooth"});
}

function toggleSearch() {
  $("searchBar").classList.toggle("active");
  if($("searchBar").classList.contains("active")) $("searchInput").focus();
}

function toggleWishlist(id,event) {
  if(event) event.stopPropagation();
  addWishlist(id);
  renderProducts();
}

function addWishlist(id) {
  if(wishlist.includes(id)) wishlist = wishlist.filter(x => x !== id);
  else wishlist.push(id);
  $("wishCount").textContent = wishlist.length;
  renderProducts();
}

function showWishlist() {
  $("wishlistItems").innerHTML = wishlist.map(id => {
    const p = products.find(x => x.id === id);
    return `<div class="cart-item">
      <img src="${p.image}" alt="${p.name}">
      <div><h4>${p.name}</h4><strong>${money(p.price)}</strong>
      <button class="outline-btn" onclick="addToCart(${p.id})">Add to Cart</button>
      <button class="remove-btn" onclick="addWishlist(${p.id});showWishlist()">Remove ♥</button></div>
    </div>`;
  }).join("") || `<p class="muted">Your wishlist is empty.</p>`;
  closePanels();
  $("wishlistModal").classList.add("active");
}

function showLogin() {
  $("loginModal").classList.add("active");
}

function switchTab(mode) {
  loginMode = mode;
  document.querySelectorAll(".tabs button").forEach(b => b.classList.remove("active"));
  document.querySelectorAll(".tabs button")[mode === "login" ? 0 : 1].classList.add("active");
  $("loginTitle").textContent = mode === "login" ? "Welcome back!" : "Create your account";
  $("loginName").classList.toggle("hidden",mode === "login");
  $("loginModal").querySelector(".black-btn").textContent = mode === "login" ? "Login" : "Create Account";
}

function fakeLogin(event) {
  event.preventDefault();
  const name = loginMode === "signup" && $("loginName").value.trim()
    ? $("loginName").value.trim()
    : $("loginEmail").value.split("@")[0];

  $("userName").textContent = "Hi, " + name;
  $("loginButton").textContent = "Account";
  closeModals();
  alert("Welcome " + name + "! Demo login successful.");
}

function fakeGoogle() {
  $("userName").textContent = "Hi, Guest";
  $("loginButton").textContent = "Account";
  closeModals();
  alert("Demo Google login successful!");
}

function showSizeChart() {
  $("sizeModal").classList.add("active");
}

function closeModals() {
  document.querySelectorAll(".modal").forEach(m => m.classList.remove("active"));
}

function changeDetailQty(n) {
  detailQty = Math.max(1,detailQty+n);
  $("detailQty").textContent = detailQty;
}

function changeDetailImage(img) {
  $("detailMainImg").src = img.src.replace("w=200","w=900");
}

function chooseDetailColor(button) {
  document.querySelectorAll(".detail-colors button").forEach(b => b.classList.remove("active"));
  button.classList.add("active");
  detailColor = button.getAttribute("aria-label");
}

document.querySelectorAll(".detail-sizes button").forEach(button => {
  button.addEventListener("click",() => {
    document.querySelectorAll(".detail-sizes button").forEach(b => b.classList.remove("selected"));
    button.classList.add("selected");
    detailSize = button.textContent;
  });
});

function placeOrder() {
  const name = $("fullName").value.trim();
  const email = $("email").value.trim();
  const address = $("address").value.trim();
  const phone = $("phone").value.trim();

  if(!cart.length) {
    alert("Your cart is empty. Please add products first.");
    return;
  }
  if(!name || !email || !address || !phone) {
    alert("Please fill in your name, email, phone and delivery address.");
    $("checkout").scrollIntoView({behavior:"smooth"});
    return;
  }
  if(!$("email").checkValidity()) {
    alert("Please enter a valid email address.");
    return;
  }

  $("successMessage").textContent = "Thank you " + name + "! Your demo order has been placed successfully.";
  closeModals();
  $("successModal").classList.add("active");
  cart = [];
  promoApplied = false;
  discountPercent = 0;
  updateCart();
  $("checkout").querySelectorAll("input:not([type=radio])").forEach(i => {
    if(i.id !== "checkoutPromo") i.value = "";
  });
}

function subscribe() {
  const email = $("newsletterEmail").value.trim();
  if(!email || !email.includes("@")) {
    $("newsletterMessage").textContent = "Please enter a valid email.";
    return;
  }
  $("newsletterMessage").textContent = "Thank you! You're on the list.";
  $("newsletterEmail").value = "";
}

function activateTilt() {
  document.querySelectorAll(".product-card").forEach(card => {
    if(card.dataset.tiltReady) return;
    card.dataset.tiltReady = "true";

    card.addEventListener("mousemove",e => {
      if(window.innerWidth < 700) return;
      const rect = card.getBoundingClientRect();
      const x = (e.clientX-rect.left)/rect.width;
      const y = (e.clientY-rect.top)/rect.height;
      const rotateY = (x-.5)*7;
      const rotateX = (.5-y)*7;
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });

    card.addEventListener("mouseleave",() => {
      card.style.transform = "";
    });
  });
}

// Drag to rotate the featured product image.
const detailImage = $("detailImage");
let dragging = false;
let startX = 0;
let rotation = 0;

detailImage.addEventListener("pointerdown",e => {
  dragging = true;
  startX = e.clientX;
  detailImage.setPointerCapture(e.pointerId);
  detailImage.style.cursor = "grabbing";
});

detailImage.addEventListener("pointermove",e => {
  if(!dragging) return;
  const difference = e.clientX-startX;
  rotation += difference*.3;
  $("detailMainImg").style.transform = `scale(1.06) rotateY(${rotation}deg)`;
  startX = e.clientX;
});

detailImage.addEventListener("pointerup",() => {
  dragging = false;
  detailImage.style.cursor = "grab";
});
detailImage.addEventListener("pointercancel",() => dragging = false);

// Animated dashboard chart.
function createChart() {
  const heights = [28,42,36,62,55,78,68,90,72,96,80,100];
  $("salesChart").innerHTML = heights.map(h => `<div style="height:${h}%"></div>`).join("");
}

// Smooth reveal when sections enter the viewport.
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting) {
      entry.target.style.animation = "reveal .7s ease both";
      revealObserver.unobserve(entry.target);
    }
  });
},{threshold:.08});

document.querySelectorAll(".section,.hero").forEach(section => {
  revealObserver.observe(section);
});

// Close popups with Escape.
document.addEventListener("keydown",e => {
  if(e.key === "Escape") {
    closePanels();
    closeModals();
  }
});

// Initial page setup.
renderProducts();
updateCart();
createChart();
