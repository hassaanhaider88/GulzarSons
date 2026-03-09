import { BackEndHostedURI } from "./BEURI.js";
let ImageMagnifireShow = document.getElementById("Image-MagnifireShow");

const params = new URLSearchParams(window.location.search);
let ProductCode = params.get("PCode");

if (ProductCode) {
  ProductCode = decodeURIComponent(ProductCode);
  ProductCode = ProductCode.replace(/"/g, "");
}

// console.log(ProductCode)
const IsAdminLogin = localStorage.getItem("email");

let SelectProduct;
let RelatedProduct;


async function FetchSinleProductAndShow() {

  showProductLoading();

  try {
    if (!ProductCode) return;

    let res = await fetch(
      `${BackEndHostedURI}/api/products/sinlge-product`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ ProductCode }),
      }
    );

    res = await res.json();

    SelectProduct = res.data;
    RelatedProduct = res.relatedProducts;

    renderRelatedProducts(RelatedProduct);

    renderProduct(); 

  } catch (error) {
    console.error(error);

    document.getElementById("productCard").innerHTML = `
      <div class="text-center py-20">
        <p class="text-red-500 text-lg font-semibold">
          Failed to load product
        </p>
        <button onclick="FetchSinleProductAndShow()"
          class="mt-4 px-6 py-2 bg-yellow-500 text-white rounded-lg">
          Retry
        </button>
      </div>
    `;
  }
}

window.handleSingleProductAddToCart = function (productCode) {
  let cartData = JSON.parse(localStorage.getItem("UserCartData")) || [];

  // Check already exists
  let alreadyExists = cartData.some((item) => item.ProductCode === productCode);

  if (alreadyExists) {
    alert("Product already exists in cart!");
    return;
  }

  if (!SelectProduct) {
    alert("Product not loaded yet!");
    return;
  }

  // Add quantity default 1
  const productWithQty = {
    ...SelectProduct,
    proudctQuantity: 1,
  };

  cartData.push(productWithQty);

  localStorage.setItem("UserCartData", JSON.stringify(cartData));

  alert("Product added to cart successfully!");

  if (typeof AddItemsToCartDynamically === "function") {
    AddItemsToCartDynamically();
  }
};

updateCartBadge();

if (!ProductCode) {
  window.history.back()
} else {
  FetchSinleProductAndShow();
}



window.handleMouseMoveInImage = function (event) {
  const img = event.currentTarget.querySelector("img");
  const magnifier = document.getElementById("Image-MagnifireShow");

  // Create zoomed image if not already inside magnifier
  if (!magnifier.querySelector("img")) {
    const zoomImg = document.createElement("img");
    zoomImg.src = img.src;
    zoomImg.className =
      "w-full h-full object-cover transform scale-150 transition-all duration-100";
    magnifier.appendChild(zoomImg);
  }

  const zoomImg = magnifier.querySelector("img");
  magnifier.classList.remove("hidden");

  const rect = img.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 100;
  const y = ((event.clientY - rect.top) / rect.height) * 100;

  zoomImg.style.transformOrigin = `${x}% ${y}%`;
  zoomImg.style.transform = "scale(2)";
};

// Hide magnifier when leaving image
window.handleMouseLeaveInImage = function () {
  const magnifier = document.getElementById("Image-MagnifireShow");
  magnifier.classList.add("hidden");
  magnifier.innerHTML = ""; // clear image
};

// Toggle Cart Drawer
window.toggleCartDrawer = function () {
  const drawer = document.getElementById("CartDrawer");
  drawer.classList.toggle("translate-x-full");
};

// Update Cart Count Badge
function updateCartBadge() {
  const cartData = JSON.parse(localStorage.getItem("UserCartData")) || [];
  const badge = document.getElementById("CartCountBadge");
  badge.innerText = cartData.length;
}

// Override existing AddItemsToCartDynamically to use new drawer
window.AddItemsToCartDynamically = function () {
  const cartData = JSON.parse(localStorage.getItem("UserCartData")) || [];
  const cartDiv = document.getElementById("UserCartDiv");

  cartDiv.innerHTML = "";

  cartData.forEach((product) => {
    const itemHTML = `
      <div class="flex gap-3 items-center border-b pb-3">
        
        <img src="${product.ProductImgUrl[0]}" 
             class="w-16 h-16 object-cover rounded-lg">

        <div class="flex-1">
          <p class="font-semibold text-sm">${product.ProductName}</p>
          
          <div class="flex items-center gap-2 mt-2">
            
            <button 
              onclick="handleQuantityDecrease('${product.ProductCode}')"
              class="w-7 h-7 bg-yellow-500 text-white rounded-full">
              -
            </button>

            <span class="font-semibold">
              ${product.proudctQuantity || 1}
            </span>

            <button 
              onclick="handleQuantityIncrease('${product.ProductCode}')"
              class="w-7 h-7 bg-yellow-500 text-white rounded-full">
              +
            </button>

          </div>
        </div>

        <button onclick="handleRemoveFromCartClick('${product.ProductCode}')"
          class="text-red-500 text-sm">
          Remove
        </button>

      </div>
    `;

    cartDiv.insertAdjacentHTML("beforeend", itemHTML);
  });

  updateCartBadge();
};
// Checkout redirect
window.goToCheckout = function () {
  const cartData = JSON.parse(localStorage.getItem("UserCartData")) || [];

  if (cartData.length === 0) {
    alert("Cart is empty");
    return;
  }

  window.location.href = "./ConformOrder.html";
};

// Initialize on load
updateCartBadge();
AddItemsToCartDynamically();

window.handleRemoveFromCartClick = function (productCode) {
  const confirmDelete = confirm("Are you sure to remove this item?");

  if (!confirmDelete) return;

  let cartData = JSON.parse(localStorage.getItem("UserCartData")) || [];

  const updatedCart = cartData.filter(
    (item) => item.ProductCode !== productCode,
  );

  localStorage.setItem("UserCartData", JSON.stringify(updatedCart));

  // Re-render cart drawer
  AddItemsToCartDynamically();
};

window.handleQuantityIncrease = function (productCode) {
  let cartData = JSON.parse(localStorage.getItem("UserCartData")) || [];

  const index = cartData.findIndex((item) => item.ProductCode === productCode);

  if (index !== -1) {
    cartData[index].proudctQuantity =
      (cartData[index].proudctQuantity || 1) + 1;

    localStorage.setItem("UserCartData", JSON.stringify(cartData));
    AddItemsToCartDynamically();
  }
};

window.handleQuantityDecrease = function (productCode) {
  let cartData = JSON.parse(localStorage.getItem("UserCartData")) || [];

  const index = cartData.findIndex((item) => item.ProductCode === productCode);

  if (index !== -1) {
    let currentQty = cartData[index].proudctQuantity || 1;

    if (currentQty > 1) {
      cartData[index].proudctQuantity = currentQty - 1;

      localStorage.setItem("UserCartData", JSON.stringify(cartData));
      AddItemsToCartDynamically();
    }
  }
};


window.BackHistoryBbn = function () {
  window.history.back()
}


function renderRelatedProducts(products) {
  const container = document.getElementById("relatedProductsContainer");

  if (!products || products.length === 0) {
    container.innerHTML = "<p>No related products found.</p>";
    return;
  }

  container.innerHTML = products.map(product => {

    const hasDiscount =
      product.ProductOfferPrice &&
      product.ProductOriginalPrice &&
      product.ProductOfferPrice !== product.ProductOriginalPrice;

    let priceHTML = "";

    if (hasDiscount) {
      const discount = Math.round(
        ((product.ProductOriginalPrice - product.ProductOfferPrice) /
          product.ProductOriginalPrice) * 100
      );

      priceHTML = `
        <div class="flex items-center gap-3">
          <span class="line-through text-gray-400">
            Rs. ${product.ProductOriginalPrice}
          </span>
          <span class="text-green-600 font-bold">
            Rs. ${product.ProductOfferPrice}
          </span>
          <span class="text-red-500 text-sm font-semibold">
            ${discount}% OFF
          </span>
        </div>
      `;
    } else {
      priceHTML = `
        <div class="flex items-center gap-3">
          <span class="text-green-600 font-bold">
            Rs. ${product.ProductOriginalPrice || product.ProductOfferPrice || "Soon"}
          </span>
        </div>
      `;
    }

    return `
      <div class="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 cursor-pointer"
           onclick="window.location.href='./SinleProductView.html?PCode=${product.ProductCode}'">

        <div class="relative group">
          <img 
            src="${product.ProductImgUrl[0]}"
            class="w-full h-64 object-cover">

          <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
            <h4 class="text-white text-lg font-semibold">
              ${product.ProductName}
            </h4>
          </div>
        </div>

        <div class="p-4 space-y-3">
          ${priceHTML}
         <a href="./SinleProductView.html?PCode=${product.ProductCode}">
          <p class="text-md hover:text-blue-500 text-gray-600">
            ${product.ProductDescript?.slice(0, 90) || ""}
          </p>
         </a>
        </div>
      </div>
    `;
  }).join("");
}


function showProductLoading() {
  const productCard = document.getElementById("productCard");

  productCard.innerHTML = `
    <div class="animate-pulse flex flex-col lg:flex-row gap-8">

      <div class="lg:w-1/2 w-full space-y-4">
        <div class="bg-gray-300 h-[450px] rounded-2xl"></div>

        <div class="grid grid-cols-3 gap-3">
          <div class="bg-gray-300 h-28 rounded"></div>
          <div class="bg-gray-300 h-28 rounded"></div>
          <div class="bg-gray-300 h-28 rounded"></div>
        </div>
      </div>

      <div class="lg:w-1/2 w-full space-y-4">
        <div class="h-8 bg-gray-300 rounded w-3/4"></div>
        <div class="h-6 bg-gray-300 rounded w-1/3"></div>
        <div class="h-10 bg-gray-300 rounded"></div>
        <div class="h-32 bg-gray-300 rounded"></div>
      </div>

    </div>
  `;
}


function renderProduct() {
  const productCard = document.getElementById("productCard");

  const markDownDecscription =
    marked.parse(SelectProduct.ProductDescript);

  productCard.innerHTML = `
<div class="flex flex-col lg:flex-row gap-8">

  <!-- LEFT SIDE : Images -->
  <div class="lg:w-1/2 w-full">
    
    <!-- Main Image -->
    <div 
      onmousemove="handleMouseMoveInImage(event)" 
      onmouseleave="handleMouseLeaveInImage()"
      class="overflow-hidden p-5 cursor-zoom-in rounded-2xl shadow-md mb-4">
      <img 
        src="${SelectProduct.ProductImgUrl[0]}" 
        alt="${SelectProduct.ProductName}"
        class="w-full h-[450px] rounded-3xl transition duration-300 hover:scale-105">
    </div>

    <!-- Thumbnail Gallery -->
    <div class="grid grid-cols-3 gap-3">
      ${SelectProduct.ProductImgUrl.map(
      (img) => `
        <div 
          onmousemove="handleMouseMoveInImage(event)" 
          onmouseleave="handleMouseLeaveInImage()"
          class="overflow-hidden cursor-zoom-in rounded-lg shadow">
          <img 
            src="${img}" 
            alt="${SelectProduct.ProductName}"
            class="w-full h-32  hover:scale-110 transition duration-300">
        </div>
        `,
    ).join("")}
    </div>

  </div>

  <!-- RIGHT SIDE : Content -->
  <div class="lg:w-1/2 w-full space-y-5">

    <h1 class="text-3xl font-bold text-yellow-500">
      ${SelectProduct.ProductName}
    </h1>
<div class="ProductPrice font-semibold">${SelectProduct.ProductOfferPrice &&
        SelectProduct.ProductOriginalPrice &&
        SelectProduct.ProductOfferPrice !== SelectProduct.ProductOriginalPrice
        ? (() => {
          const discount = Math.round(
            ((SelectProduct.ProductOriginalPrice -
              SelectProduct.ProductOfferPrice) /
              SelectProduct.ProductOriginalPrice) *
            100,
          );
          return `
                    <span class="original line-through text-red-400">Rs. ${SelectProduct.ProductOriginalPrice}</span>
                    <span class="offer">Rs. ${SelectProduct.ProductOfferPrice}</span>
                    <span class="discount text-[#F5A425]">${discount}% OFF</span>
                  `;
        })()
        : `<span class="offer">
                  Rs. ${SelectProduct.ProductOriginalPrice || SelectProduct.ProductOfferPrice || "Soon"}
                </span>`
      }</div>


     <p class="text-gray-600">
     Product Code : <span class="font-semibold text-black">
        ${SelectProduct.ProductCode}
      </span>
    </p>

  <!-- for Card and contact button -->
  <div class="w-full text-white flex gap-5">
  <button onclick="handleSingleProductAddToCart('${SelectProduct.ProductCode}')"  class="py-1 w-full px-4 bg-[#CF8F2A] rounded-xl">Add To Cart</button>
  <a  class="w-full py-1 px-4 rounded-xl bg-green-400 text-white flex justify-center items-center text-none" target="_blank"
            href="https://wa.me/+923108184555?text=I%20wanna%20Buy%20Product%20With%20ProductCode%20${SelectProduct.ProductCode}">
            <button title="WhatsApp Contact">
               Contact on WhatsApp
            </button>
          </a>
  </div>

    <!-- Availability -->
    <div>
      <span class="font-semibold text-gray-700">Availability:</span>
      <span class="${SelectProduct.IsProductAvailable
        ? "text-green-600 font-semibold"
        : "text-red-600 font-semibold"
      }">
        ${SelectProduct.IsProductAvailable ? "In Stock" : "Out of Stock"}
      </span>
    </div>

    <!-- Description (Markdown Rendered) -->
    <div class="prose max-w-none text-gray-800">
      ${markDownDecscription}
    </div>

    <!-- YouTube Video -->
    ${SelectProduct.ProductYTVideoCode
        ? `
        <div class="w-full h-[300px] rounded-xl overflow-hidden shadow">
          <iframe 
            width="100%" 
            height="100%" 
            src="https://www.youtube.com/embed/${SelectProduct.ProductYTVideoCode}" 
            allowfullscreen>
          </iframe>
        </div>
        `
        : ""
      }
  </div>
</div>
`;
}
