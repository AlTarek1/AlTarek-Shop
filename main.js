const cartMenu = document.querySelector("#cart_menu");
const xCartMenu = document.querySelector(".xcart");
const show = document.querySelector(".overlay");
const cartMenuCnt = document.querySelector("#cart_menu_cnt");
const cartDOM = document.querySelector("#cart");
const totalDOM = document.querySelector("#total");
const clearCart = document.querySelector("#clearCart");
const ProductsDOM = document.querySelector(".main_products");

let cart = localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : [],
  addCartButtons = [],
  currentProducts = [];

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

function loadProducts(products) {
  let productsHTML = "";
  products.forEach((product) => {
    productsHTML += `
      <div class="product">
      <div class="image">
        <img src="${product.image}" alt="" />
        <button data-id="${product.id}" id="add_to_cart">Add To Cart</button>
      </div>
      <h3>${product.title}</h3>
      <h4>${product.price}$</h4>
    </div>`;
  });
  ProductsDOM.innerHTML = productsHTML;
}
function showCart() {
  show.classList.add("visible");
  loadCart();
  Total();
}
function hideCart() {
  show.classList.remove("visible");
  amountItems();
}
function BtnText() {
  if (addCartButtons.length) {
    addCartButtons.forEach((btn) => {
      const inCart = cart.find((item) => item.id === btn.dataset.id);
      if (inCart) {
        btn.innerText = "In Cart";
        btn.disabled = true;
      } else {
        btn.innerText = "Add To Cart";
        btn.disabled = false;
      }
    });
  }
}
function productBtn() {
  const btns = document.querySelectorAll("#add_to_cart");
  addCartButtons = btns;
  btns.forEach((btn) => {
    const inCart = cart.find((item) => item.id === btn.dataset.id);

    if (inCart) {
      btn.innerText = "In Cart";
      btn.disabled = true;
    } else {
      btn.innerText = "Add To Cart";
      btn.disabled = false;
    }
    btn.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      console.log(e.target.innerText);
      e.target.innerText = "In Cart";
      console.log(e.target.innerText);

      e.target.disabled = true;
      cart.push({ id, amount: 1 });
      saveCart(cart);
      showCart();
    });
  });
}
function cartFunctions(e) {
  if (e.target.classList.contains("minus")) {
    e.target.nextElementSibling.innerText =
      parseInt(e.target.nextElementSibling.innerText) - 1;
    if (e.target.nextElementSibling.innerText === "0") {
      cart = cart.filter((item) => item.id !== e.target.dataset.id);
      deleteChild(e.target);
      BtnText();
    } else {
      cart.forEach((item) => {
        if (item.id === e.target.dataset.id) item.amount--;
      });
    }
  } else if (e.target.classList.contains("plus")) {
    e.target.previousElementSibling.innerText =
      parseInt(e.target.previousElementSibling.innerText) + 1;
    cart.forEach((item) => {
      if (item.id === e.target.dataset.id) item.amount++;
    });
  } else if (
    e.target.classList.contains("x-item") &&
    e.target.parentElement.parentElement
  ) {
    cart = cart.filter((item) => item.id !== e.target.dataset.id);
    BtnText();

    e.target.parentElement.parentElement.removeChild(e.target.parentElement);
  }
  saveCart(cart);
  Total();
  amountItems();
}
function Total() {
  let tempTotal = 0;
  cart.forEach((e) => {
    tempTotal += currentProducts[e.id - 1].price * e.amount;
  });
  totalDOM.innerText = parseFloat(tempTotal).toFixed(2);
}
function amountItems() {
  let tempAmount = 0;
  cart.forEach((e) => {
    tempAmount += e.amount;
  });
  cartMenuCnt.innerText = tempAmount;
}
function clearAllCart() {
  cart = [];
  saveCart(cart);
  cartDOM.innerHTML = "";
  Total();
  amountItems();
  BtnText();

  hideCart();
}
function deleteChild(child) {
  child.parentElement.parentElement.parentElement.parentElement.removeChild(
    child.parentElement.parentElement.parentElement
  );
}
function loadCart() {
  const cartItem = cart
    .map((item) => {
      let ele;
      currentProducts.forEach((e) => {
        if (e.id === item.id) ele = e;
      });
      return `
      <div class="cart-item">
   <img src="${ele.image}" alt="" />
   <div class="info">
     <h4>${ele.title}</h4>
     <h5>${ele.price}$</h5>
     <div class="chnge">
       <i class="fa-solid fa-minus minus" data-id=${item.id}></i>
       <span>${item.amount}</span>
       <i class="fa-solid fa-plus plus" data-id=${item.id}></i>
     </div>
   </div>
   <i class="fa-regular fa-circle-xmark x-item" data-id=${item.id}></i>
 </div>`;
    })
    .join("");
  cartDOM.innerHTML = cartItem;
  amountItems();
}

function saveCart(cart) {
  return localStorage.setItem("cart", JSON.stringify(cart));
}

document.addEventListener("DOMContentLoaded", () => {
  getAllProducts()
    .then((items) => {
      loadProducts(items);
    })
    .then(() => productBtn())
    .then(() => {
      BtnText();

      amountItems();
    });
});
cartMenu.addEventListener("click", showCart);
xCartMenu.addEventListener("click", hideCart);
clearCart.addEventListener("click", clearAllCart);
cartDOM.addEventListener("click", (e) => cartFunctions(e));
