// Html ELements
const cartMenu = document.querySelector("#cart_menu");
const xCartMenu = document.querySelector(".xcart");
const show = document.querySelector(".overlay");
const cartMenuCnt = document.querySelector("#cart_menu_cnt");
const cartDOM = document.querySelector("#cart");
const totalDOM = document.querySelector("#total");
const clearCart = document.querySelector("#clearCart");
const ProductsDOM = document.querySelector(".main_products");
// End of Html ELements
// Save Cart in Local Storage
function saveCart(cart) {
  return localStorage.setItem("cart", JSON.stringify(cart));
}

// End Of Save Cart in Local Storage
let initCart = [];
// Get Cart Items From Local Storage
const getCart = () =>
  localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : initCart;
//End OF Get Cart Items From Local Storage

// Our Variables
let cart = getCart(),
  addCartButtons = [],
  currentProducts = [];
//End Of Our Variables

// Get Products From Json File
async function getAllProducts() {
  try {
    const res = await fetch("products.json");
    const data = await res.json();
    const { items } = data;
    currentProducts = items;
    return items;
  } catch (e) {
    console.log(e);
  }
}
// End of Get Products From Json File

// Load Products In Our Products Section
function loadProducts(products) {
  let productsHTML = "";
  products.forEach((product, i) => {
    productsHTML += `
      <div class="product">
      <div class="image">
        <img src="${product.image}" alt="" />
        <button data-i="${i}" id="add_to_cart">Add To Cart</button>
      </div>
      <h3>${product.title}</h3>
      <h4>${product.price}$</h4>
    </div>`;
  });
  ProductsDOM.innerHTML = productsHTML;
}
// End OF Load Products In Our Products Section

// Show And Hide Cart
function showCart() {
  show.classList.add("visible");
  loadCart();
  Total();
}
function hideCart() {
  show.classList.remove("visible");
  amountItems();
}
// End Of Show And Hide Cart

// Dealing with Text in Products button
function BtnText() {
  if (addCartButtons.length) {
    addCartButtons.forEach((btn) => {
      const inCart = cart[btn.dataset.i];
      if (inCart.amount) {
        btn.innerText = "In Cart";
        btn.disabled = true;
      } else {
        btn.innerText = "Add To Cart";
        btn.disabled = false;
      }
    });
  }
}
//End Of Dealing with Text in Products button

// Functionality Of Products Buttons
function productBtn() {
  const btns = document.querySelectorAll("#add_to_cart");
  addCartButtons = btns;
  btns.forEach((btn) => {
    BtnText();
    btn.addEventListener("click", (e) => {
      const id = e.target.dataset.i;
      e.target.innerText = "In Cart";
      e.target.disabled = true;
      cart[e.target.dataset.i].amount++;
      saveCart(cart);
      showCart();
    });
  });
}
//End OF Functionality Of Products Buttons

// Cart Functionality
function cartFunctions(e) {
  let element = e.target;
  if (element.classList.contains("minus")) {
    element.nextElementSibling.innerText--;
    cart[element.dataset.i].amount--;
    if (element.nextElementSibling.innerText === "0") {
      BtnText();
      deleteChild(element);
    }
  } else if (element.classList.contains("plus")) {
    element.previousElementSibling.innerText++;
    cart[element.dataset.i].amount++;
  } else if (element.classList.contains("x-item")) {
    cart[element.dataset.i].amount = 0;

    BtnText();
    deleteChild(element);
  }
  saveCart(cart);

  Total();
  amountItems();
}
//End of Cart Functionality
function deleteChild(child) {
  let parent = child.parentElement,
    childToRemove = child;

  while (!parent.classList.contains("cart-content")) {
    parent = parent.parentElement;
    childToRemove = childToRemove.parentElement;
  }
  parent.removeChild(childToRemove);
}
// Total Of Cart Products
function Total() {
  let tempTotal = 0;
  cart.forEach((e) => {
    tempTotal += currentProducts[e.indx].price * e.amount;
  });
  totalDOM.innerText = parseFloat(tempTotal).toFixed(2);
}
//End Of Total Of Cart Products
// amount of items in Cart
function amountItems() {
  let tempAmount = 0;
  cart.forEach((e) => {
    tempAmount += e.amount;
  });
  cartMenuCnt.innerText = tempAmount;
}
//End of amount of items in Cart

// Clear All Cart Button
function clearAllCart() {
  cart = initCart;
  saveCart(cart);
  cartDOM.innerHTML = "";
  BtnText();

  Total();
  amountItems();
  hideCart();
}
//End Of Clear All Cart Button

// Load Cart
function loadCart() {
  const cartItem = cart
    .map((item) => {
      let ele = currentProducts[item.indx];
      if (item.amount)
        return `
      <div class="cart-item">
   <img src="${ele.image}" alt="" />
   <div class="info">
     <h4>${ele.title}</h4>
     <h5>${ele.price}$</h5>
     <div class="chnge">
       <i class="fa-solid fa-minus minus" data-i=${item.indx}></i>
       <span>${item.amount}</span>
       <i class="fa-solid fa-plus plus" data-i=${item.indx}></i>
     </div>
   </div>
   <i class="fa-regular fa-circle-xmark x-item" data-i=${item.indx}></i>
 </div>`;
    })
    .join("");
  cartDOM.innerHTML = cartItem;
  amountItems();
}
// End Of Load Cart

// Loading Proucts After Dom Content is Loaded
document.addEventListener("DOMContentLoaded", () => {
  getAllProducts()
    .then((items) => {
      loadProducts(items);
      initCart = items.map((item, i) => {
        return { id: item.id, amount: 0, indx: i };
      });
      cart = getCart();
    })
    .then(() => productBtn())
    .then(() => {
      BtnText();

      amountItems();
    });
});
// End OF Loading Proucts After Dom Content is Loaded

// Some Events
cartMenu.addEventListener("click", showCart);
xCartMenu.addEventListener("click", hideCart);
clearCart.addEventListener("click", clearAllCart);
cartDOM.addEventListener("click", (e) => cartFunctions(e));
//End Of Some Events
