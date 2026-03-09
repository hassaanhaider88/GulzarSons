import { BackEndHostedURI } from "./BEURI.js";

import ShowDescriptionForCetagory from "./CetagoryDes.js";

let proudctQuantity = 1;


const params = new URLSearchParams(window.location.search);

let category = params.get("productCetagory");

if (category) {
  category = decodeURIComponent(category).replace(/"/g, "");
} else {
  category = "All";
}

FetchDataFromDB();

let UserCartDataArray = JSON.parse(localStorage.getItem("UserCartData")) || [];

const UserCartDiv = document.getElementById("UserCartDiv");

const UserCartSection = document.getElementById("UserCartSection");

if (category) {
  category = decodeURIComponent(category);

  category = category.replace(/"/g, "");
}

// get If Offers Available In Time
async function getOfferAvailable() {
  var Offers = await fetch(`${BackEndHostedURI}/api/offers`);
  let res = await Offers.json();
  console.log(res);
}
getOfferAvailable();

// script for ALL data know use local then fetch from DataBase

var AllProductContainerDiv = document.getElementById("AllProductContainerDiv");

let AllProductsData;

async function FetchDataFromDB() {
  document.getElementById("CustomLoader").classList.remove("hidden");

  var res = await fetch(`${BackEndHostedURI}/api/products`);

  res = await res.json();
  console.log(res);
  AllProductsData = res.data;
  if (!res.success) {
    document.getElementById("CustomLoader").classList.add("hidden");
    return;
  }
  document.getElementById("CustomLoader").classList.add("hidden");

  AllProductsData?.forEach((product) => {
    const parsedDescription = marked.parse(product.ProductDescript || "");

    // 100 character limit
    const shortDescription = parsedDescription.substring(0, 70) + "...";

    if (category == "All" || category == product.Cetagroy) {
      const productHTML = `
<div class=" all ${product.Cetagroy}">
  <div class="meeting-item product-card">

    <div class="thumb product-thumb">

        <img 
          loading="lazy"
          class="product-img"
          src="${product.ProductImgUrl[0]}"
          alt="${product.ProductName}">


      <a href="./SinleProductView?PCode=${product.ProductCode}">
      <div class="product-overlay">
        <h4 class="overlay-title">${product.ProductName}</h4>
      </div>
      </a>

    </div>
    <div class="overlay-buttons">
          <button 
            onClick="hanldeAddToCartClick('${product.ProductCode}')"
            class="AddToCartBtn">
            Add Cart
          </button>

          <a target="_blank"
            href="https://wa.me/+923108184555?text=I%20wanna%20Buy%20Product%20With%20ProductCode%20${product.ProductCode}">
            <button title="WhatsApp Contact" class="ChatOnWABtn">
               Contact
            </button>
          </a>
        </div>

        <div class="ProductPrice">${product.ProductOfferPrice &&
          product.ProductOriginalPrice &&
          product.ProductOfferPrice !== product.ProductOriginalPrice
          ? (() => {
            const discount = Math.round(
              ((product.ProductOriginalPrice - product.ProductOfferPrice) /
                product.ProductOriginalPrice) *
              100,
            );
            return `
                    <span class="original">Rs. ${product.ProductOriginalPrice}</span>
                    <span class="offer">Rs. ${product.ProductOfferPrice}</span>
                    <span class="discount">${discount}% OFF</span>
                  `;
          })()
          : `<span class="offer">
                  Rs. ${product.ProductOriginalPrice || product.ProductOfferPrice || "Soon"}
                </span>`
        }</div>

      <a href="./SinleProductView?PCode=${product.ProductCode}">
        <div class="DescriptonText">${shortDescription}</div>
       </a>
        </div>
</div>`;

      // Add to container

      AllProductContainerDiv.insertAdjacentHTML("beforeend", productHTML);
    }

    // HTML structure dynamically bnao
  });
}


FetchDataFromDB();



document.addEventListener("DOMContentLoaded", () => {
  const lazyImages = document.querySelectorAll("img.lazy");

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;

        img.src = img.dataset.src; // replace placeholder with real image

        img.classList.remove("lazy");

        observer.unobserve(img);
      }
    });
  });

  lazyImages.forEach((img) => observer.observe(img));
});

let IsShowCart = false;

window.HandleShowCartIconClick = function () {
  var AllProductsInCart = JSON.parse(localStorage.getItem("UserCartData"));

  if (AllProductsInCart == null || AllProductsInCart.length <= 0) {
    alert("Cart Is Empty");

    return;
  }

  if (IsShowCart) {
    UserCartSection.classList.add("hidden");

    IsShowCart = false;
  } else {
    UserCartSection.classList.remove("hidden");

    IsShowCart = true;
  }

  console.log(AllProductsInCart);
};

window.hanldeAddToCartClick = function (productCode) {
  // find product from all products

  var ProductForCart = AllProductsData.find(
    (p) => p.ProductCode === productCode,
  );

  if (!ProductForCart) {
    alert("Product not found!");

    return;
  }

  // check if product already exists in cart

  var alreadyInCart = UserCartDataArray.some(
    (p) => p.ProductCode === productCode,
  );

  if (alreadyInCart) {
    alert("Product already in cart!");

    return;
  }

  // add product to cart

  UserCartDataArray.push({ ...ProductForCart, proudctQuantity });

  // optionally update localStorage

  localStorage.setItem("UserCartData", JSON.stringify(UserCartDataArray));

  alert("Product added to cart!");

  AddItemsToCartDynamically();
};

window.AddItemsToCartDynamically = function () {
  var AllProductsInCart = JSON.parse(localStorage.getItem("UserCartData"));

  UserCartDiv.innerHTML = "";

  AllProductsInCart?.forEach((product) => {
    // proudctQuantity = product.ProudctQuantity;
    var sinleProduct = ` <div class="product-card">

<a href="/SinleProductView?PCode=${product.ProductCode}">

<img  src="${product.ProductImgUrl[0]}" loading="lazy" alt="Product">

</a>

<p style="color: black;">${product.ProductCode}</p>
<div style="width:80px; display:flex; justify-content:space-between; align-items:center;">
<button style="width:30px; height:30px;color:white; border:none;cursor:pointer; background:#CF8F2A; border-radius:50%;display:flex;justify-content:center; align-items:center;" onclick="handleQuantityDecrease('${product.ProductCode}')">-</button>
<div>${product.proudctQuantity || 1}</div>
<button style="width:30px; height:30px;color:white; border:none;cursor:pointer; background:#CF8F2A; border-radius:50%;display:flex;justify-content:center; align-items:center;" onclick="handleQuantityIncrease('${product.ProductCode}')">+</button>
</div>

<button onclick="handleRemoveFromCartClick('${product.ProductCode}')" class="delete-btn">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">

  <path d="M576 128c0-35.3-28.7-64-64-64L205.3 64c-17 0-33.3 6.7-45.3 

    18.7L9.4 233.4c-6 6-9.4 14.1-9.4 

    22.6s3.4 16.6 9.4 22.6L160 

    429.3c12 12 28.3 18.7 45.3 

    18.7L512 448c35.3 0 64-28.7 

    64-64l0-256zM271 175c9.4-9.4 

    24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 

    24.6-9.4 33.9 0s9.4 24.6 0 

    33.9l-47 47 47 47c9.4 9.4 9.4 

    24.6 0 33.9s-24.6 9.4-33.9 

    0l-47-47-47 47c-9.4 9.4-24.6 

    9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 

    0-33.9z"></path>

    </svg>

    </button>

  </div>`;
    UserCartDiv.insertAdjacentHTML("beforeend", sinleProduct);
  });
};

AddItemsToCartDynamically();

window.handleRemoveFromCartClick = function (productCode) {
  // find product from all products

  var IsReadyToDel = confirm("Are You Sure To Delete From Cart! ");


  if (!IsReadyToDel) {
    return;
  } else {
    // LS LocalStorage

    var AllItemsInLS = JSON.parse(localStorage.getItem("UserCartData"));

    var RemaingItems = AllItemsInLS.filter(
      (p) => p.ProductCode !== productCode,
    );

    //  console.log(RemaingItems)

    localStorage.setItem("UserCartData", JSON.stringify(RemaingItems));

    window.location.reload();
  }

  console.log(productCode);
};

window.handleQuantityIncrease = function (productCode) {
  let AllItemsInLS = JSON.parse(localStorage.getItem("UserCartData")) || [];
  let itemIndex = AllItemsInLS.findIndex((p) => p.ProductCode === productCode);

  if (itemIndex !== -1) {
    AllItemsInLS[itemIndex].proudctQuantity =
      (AllItemsInLS[itemIndex].proudctQuantity || 1) + 1;
    localStorage.setItem("UserCartData", JSON.stringify(AllItemsInLS));
    AddItemsToCartDynamically();
  }
};

window.handleQuantityDecrease = function (productCode) {
  let AllItemsInLS = JSON.parse(localStorage.getItem("UserCartData")) || [];
  let itemIndex = AllItemsInLS.findIndex((p) => p.ProductCode === productCode);

  if (itemIndex !== -1) {
    let currentQty = AllItemsInLS[itemIndex].proudctQuantity || 1;
    if (currentQty > 1) {
      AllItemsInLS[itemIndex].proudctQuantity = currentQty - 1;
      localStorage.setItem("UserCartData", JSON.stringify(AllItemsInLS));
      AddItemsToCartDynamically();
    }
  }
};

document
  .getElementById("FinalCallOnWhatsAppBnt")
  .addEventListener("click", () => {
    var AllItemsInLS = JSON.parse(localStorage.getItem("UserCartData"));

    if (AllItemsInLS == null || AllItemsInLS.length > 0) {
      window.location.href = "./ConformOrder";
    } else {
      alert("Cart Is Empty");
    }
  });



const foundCategory = ShowDescriptionForCetagory.find(
  item => item.cetagoryName === category
);

if (foundCategory) {
  document.getElementById("category-intro").innerHTML =
    foundCategory.cetagoryDescrption;
}