const sections = document.querySelectorAll(".section");
const navButtons = document.querySelectorAll(".nav button");
function showSection(sectionId) {
  sections.forEach((sec) => {
    sec.classList.remove("active");
    sec.setAttribute("aria-hidden", "true");
  });
  navButtons.forEach((btn) => {
    btn.setAttribute("aria-selected", "false");
    btn.classList.remove("active-nav");
  });
  const activeSection = document.getElementById(sectionId);
  activeSection.classList.add("active");
  activeSection.setAttribute("aria-hidden", "false");
  document
    .getElementById("nav-" + sectionId)
    .setAttribute("aria-selected", "true");
  document.getElementById("nav-" + sectionId).classList.add("active-nav");
  activeSection.focus();
}

// CART MANAGEMENT
let cart = JSON.parse(localStorage.getItem("agriCart")) || [];

function saveCart() {
  localStorage.setItem("agriCart", JSON.stringify(cart));
}

function addToCart(itemName, price) {
  // Check if item exists in cart
  const existing = cart.find((i) => i.name === itemName);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name: itemName, price: price, qty: 1 });
  }
  saveCart();
  updateCartDisplay();
  alert(`${itemName} added to cart.`);
}

function updateCartDisplay() {
  const cartContainer = document.getElementById("cart-items");
  cartContainer.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>No items in cart.</p>";
  } else {
    cart.forEach((item, index) => {
      total += item.price * item.qty;

      const div = document.createElement("div");
      div.classList.add("cart-item");

      const nameDiv = document.createElement("div");
      nameDiv.classList.add("cart-item-name");
      nameDiv.textContent = item.name;

      const qtyDiv = document.createElement("div");
      qtyDiv.classList.add("cart-item-qty");
      qtyDiv.innerHTML = `
        <button aria-label="Decrease quantity of ${item.name}" onclick="changeQty(${index}, -1)">−</button>
        <input type="number" min="1" value="${item.qty}" onchange="setQty(${index}, this.value)" aria-label="Quantity of ${item.name}" />
        <button aria-label="Increase quantity of ${item.name}" onclick="changeQty(${index}, 1)">+</button>
      `;

      const priceDiv = document.createElement("div");
      priceDiv.classList.add("cart-item-price");
      priceDiv.textContent = `₹${item.price * item.qty}`;

      const removeBtn = document.createElement("button");
      removeBtn.classList.add("remove-btn");
      removeBtn.textContent = "Remove";
      removeBtn.setAttribute("aria-label", `Remove ${item.name} from cart`);
      removeBtn.onclick = () => removeItem(index);

      div.appendChild(nameDiv);
      div.appendChild(qtyDiv);
      div.appendChild(priceDiv);
      div.appendChild(removeBtn);

      cartContainer.appendChild(div);
    });
  }
  document.getElementById("cart-total").textContent = total.toFixed(2);
}

function changeQty(index, change) {
  let newQty = cart[index].qty + change;
  if (newQty < 1) return;
  cart[index].qty = newQty;
  saveCart();
  updateCartDisplay();
}

function setQty(index, value) {
  let qty = parseInt(value);
  if (isNaN(qty) || qty < 1) {
    alert("Quantity must be a positive number.");
    updateCartDisplay();
    return;
  }
  cart[index].qty = qty;
  saveCart();
  updateCartDisplay();
}

function removeItem(index) {
  if (confirm(`Remove ${cart[index].name} from cart?`)) {
    cart.splice(index, 1);
    saveCart();
    updateCartDisplay();
  }
}

function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty.");
    showSection("purchase");
    return;
  }
  const location = document.getElementById("location").value.trim();
  if (location === "") {
    alert("Please enter your delivery location.");
    document.getElementById("location").focus();
    return;
  }
  const paymentMethod = document.getElementById("payment").value;
  alert(
    `Thank you for your purchase!\n\nDelivery Location: ${location}\nPayment Method: ${
      paymentMethod === "online" ? "Online" : "Cash on Delivery"
    }\n\nTotal Amount: ₹${document.getElementById("cart-total").textContent}`
  );
  cart = [];
  saveCart();
  updateCartDisplay();
  showSection("home");
}

// Initialize cart display on page load
updateCartDisplay();

// AI Help Simulation
document.getElementById("ai-submit-btn").addEventListener("click", () => {
  const questionInput = document.getElementById("ai-question");
  const responseDiv = document.getElementById("ai-response");
  const question = questionInput.value.trim();
  if (question.length === 0) {
    alert("Please enter a question.");
    questionInput.focus();
    return;
  }

  // Show loading dots animation
  responseDiv.innerHTML = `
    <div class="loading-dots" aria-live="polite" aria-busy="true">
      <span></span><span></span><span></span>
    </div>
    <p style="margin-top:10px; color:#666; font-size: 0.9rem;">AI is thinking...</p>
  `;
  questionInput.disabled = true;
  document.getElementById("ai-submit-btn").disabled = true;

  setTimeout(() => {
    // Simple canned answers simulation for demo
    let answer = "Sorry, I don't have an answer for that right now.";
    const q = question.toLowerCase();

    if (q.includes("best crop") && q.includes("soil")) {
      answer =
        "For black soil, cotton and wheat are generally good choices due to its moisture retention properties.";
    } else if (q.includes("weather")) {
      answer =
        "Make sure to monitor local weather forecasts daily and plan irrigation accordingly.";
    } else if (q.includes("pest")) {
      answer =
        "Integrated pest management (IPM) techniques include using natural predators and minimal chemical sprays.";
    } else if (q.includes("water")) {
      answer =
        "Water requirements vary by crop, but generally early morning or late evening irrigation is best.";
    }

    responseDiv.textContent = answer;
    questionInput.disabled = false;
    document.getElementById("ai-submit-btn").disabled = false;
  }, 1800);
});
