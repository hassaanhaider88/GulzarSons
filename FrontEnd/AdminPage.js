// import AllProductsData from "./assets/AllProductsData.js";
import { BackEndHostedURI } from './BEURI.js';
var AllProductsListContainer = document.getElementById(
  "AllProductsListContainer"
);
var SearchValue = document.getElementById("SearchValue");

window.handleUpdateBtnClick = function (productCode) {
  var IsWannaUpdate = confirm("Are You Realy Wanna Updates?");
  if (IsWannaUpdate) {
    window.location.href = `./UpdateProductPage?productCode=${productCode}`;

  } else {
    console.log("Dont Wanna Upadate");
    return;
  }
};

window.handleDeleteBtnClick = async function (productCode) {
  var IsWannaDelete = confirm("Are You Realy Wanna Deletes?");
  if (IsWannaDelete) {
    const userInput = prompt("Please enter your Password:");
    if (!userInput) {
      return alert("please prodive..");
    }
    const Emailres = await fetch(`${BackEndHostedURI}/api/admin-login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        passwordInput: userInput.toString(),
        emailInput: localStorage.getItem("email"),
      }),
    });
    const data = await Emailres.json();
    if (data.success) {
      var res = await fetch(`${BackEndHostedURI}/api/products/delete-product`, {
        method: "POSt",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({ ProductCode: productCode })
      });
      res = await res.json();
      if (res.success) {
        window.location.href = "/AdminPage";
      } else {
        alert('Something Went Wrong');
      }
    } else {
      alert("email or pass is wrong...")
    }
    return;
  } else {
    console.log("Dont Wanna Upadate");
    return;
  }
}


window.handleSearchBtn = function () {

  if (SearchValue.value === "") {
    alert('Please Search Somthing...');
    AllProductsData.forEach((product) => {
      const SingleProductHTML = `
        <div class="singleProductOnAdmin text-black flex-wrap flex justify-between items-center w-full rounded-[15px] shadow bg-white py-2 px-3">
<a href="/SinleProductView?PCode=${product.ProductCode}">
<img  src="${product.ProductImgUrl[0]
        }" loading="lazy" class="w-[150px] cursor-pointer hover:scale-110 duration-300 transition-all ease-in-out h-[60px] bg-green-400 rounded-[10px]" alt="">
  </a>
<p class="text-black">${product.ProductCode}</p>
<h1 class="text-black">${product.ProductName}</h1>
<p class="text-black">${product.Cetagroy}</p>
<p class="text-black">${product.ProductPrice ? product.ProductPrice : "Rs. Null"
        }</p>
<div class="DeleteAndUpdateBtns gap-2 flex">
  <button onclick="handleUpdateBtnClick('${product.ProductCode
        }')" class="UpdateButton hover:scale-95 transition-all duration-400 h-10 w-10 flex justify-center items-center">
    <svg stroke="currentColor" fill="" stroke-width="0" viewBox="0 0 576 512" height="25px" width="25px" xmlns="http://www.w3.org/2000/svg" class="copy-svg-injected"><path d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z"></path></svg>
  </button>
  <button onclick="handleDeleteBtnClick('${product.ProductCode
        }')" class="DeleteButton h-10 w-10 hover:scale-95 transition-all duration-400 flex justify-center items-center">
    <svg stroke="currentColor" fill="red" stroke-width="0" viewBox="0 0 576 512" height="25px" width="25px" xmlns="http://www.w3.org/2000/svg" class="copy-svg-injected"><path d="M576 128c0-35.3-28.7-64-64-64L205.3 64c-17 0-33.3 6.7-45.3 18.7L9.4 233.4c-6 6-9.4 14.1-9.4 22.6s3.4 16.6 9.4 22.6L160 429.3c12 12 28.3 18.7 45.3 18.7L512 448c35.3 0 64-28.7 64-64l0-256zM271 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"></path></svg>
  </button>
</div>
</div>
        `;
      AllProductsListContainer.insertAdjacentHTML(
        "beforeend",
        SingleProductHTML
      );
    });
    return;
  }

  const FilteredProducts = AllProductsData.filter(
    (product) => product.ProductCode === SearchValue.value.trim()
  );
  if (FilteredProducts.length <= 0) {
    alert("Product Not Found");
    AllProductsData.forEach((product) => {
      const SingleProductHTML = `
        <div class="singleProductOnAdmin text-black flex-wrap flex justify-between items-center w-full rounded-[15px] shadow bg-white py-2 px-3">
<a href="/SinleProductView?PCode=${product.ProductCode}">
<img  src="${product.ProductImgUrl[0]
        }" loading="lazy" class="w-[150px] cursor-pointer hover:scale-110 duration-300 transition-all ease-in-out h-[60px] bg-green-400 rounded-[10px]" alt="">
  </a>
<p class="text-black">${product.ProductCode}</p>
<h1 class="text-black">${product.ProductName}</h1>
<p class="text-black">${product.Cetagroy}</p>
<p class="text-black">${product.ProductPrice ? product.ProductPrice : "Rs. Null"
        }</p>
<div class="DeleteAndUpdateBtns gap-2 flex">
  <button title="Update Product" onclick="handleUpdateBtnClick('${product.ProductCode
        }')"  class="UpdateButton hover:scale-95 transition-all duration-400 h-10 w-10 flex justify-center items-center">
    <svg stroke="currentColor" fill="" stroke-width="0" viewBox="0 0 576 512" height="25px" width="25px" xmlns="http://www.w3.org/2000/svg" class="copy-svg-injected"><path d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z"></path></svg>
  </button>
  <button title="Delete Product" onclick="handleDeleteBtnClick('${product.ProductCode
        }')" class="DeleteButton h-10 w-10 hover:scale-95 transition-all duration-400 flex justify-center items-center">
    <svg stroke="currentColor" fill="red" stroke-width="0" viewBox="0 0 576 512" height="25px" width="25px" xmlns="http://www.w3.org/2000/svg" class="copy-svg-injected"><path d="M576 128c0-35.3-28.7-64-64-64L205.3 64c-17 0-33.3 6.7-45.3 18.7L9.4 233.4c-6 6-9.4 14.1-9.4 22.6s3.4 16.6 9.4 22.6L160 429.3c12 12 28.3 18.7 45.3 18.7L512 448c35.3 0 64-28.7 64-64l0-256zM271 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"></path></svg>
  </button>
</div>
</div>
        `;
      AllProductsListContainer.insertAdjacentHTML(
        "beforeend",
        SingleProductHTML
      );
    });
    return;
  }
  //   console.log(FilteredProducts);



  AllProductsListContainer.innerHTML = `
        <div class="singleProductOnAdmin text-black flex-wrap flex justify-between items-center w-full rounded-[15px] shadow bg-white py-2 px-3">
<a href="./SinleProductView?PCode=${FilteredProducts.ProductCode}">
<img  src="${FilteredProducts[0].ProductImgUrl[0]}" loading="lazy" class="w-[150px] cursor-pointer hover:scale-110 duration-300 transition-all ease-in-out h-[60px] bg-yellow-400 rounded-[10px]" alt="">
  </a>
<p class="text-black">${FilteredProducts[0].ProductCode}</p>
<h1 class="text-black">${FilteredProducts[0].ProductName}</h1>
<p class="text-black">${FilteredProducts[0].Cetagroy}</p>
<p class="text-black">${FilteredProducts[0].ProductPrice
      ? FilteredProducts[0].ProductPrice
      : "Rs. Null"
    }</p>
<div class="DeleteAndUpdateBtns gap-2 flex">
  <button onclick="handleUpdateBtnClick('${FilteredProducts[0].ProductCode
    }')" class="UpdateButton hover:scale-95 transition-all duration-400 h-10 w-10 flex justify-center items-center">
    <svg stroke="currentColor" fill="" stroke-width="0" viewBox="0 0 576 512" height="25px" width="25px" xmlns="http://www.w3.org/2000/svg" class="copy-svg-injected"><path d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z"></path></svg>
  </button>
  <button onclick="handleDeleteBtnClick('${FilteredProducts[0].ProductCode
    }')" class="DeleteButton h-10 w-10 hover:scale-95 transition-all duration-400 flex justify-center items-center">
    <svg stroke="currentColor" fill="red" stroke-width="0" viewBox="0 0 576 512" height="25px" width="25px" xmlns="http://www.w3.org/2000/svg" class="copy-svg-injected"><path d="M576 128c0-35.3-28.7-64-64-64L205.3 64c-17 0-33.3 6.7-45.3 18.7L9.4 233.4c-6 6-9.4 14.1-9.4 22.6s3.4 16.6 9.4 22.6L160 429.3c12 12 28.3 18.7 45.3 18.7L512 448c35.3 0 64-28.7 64-64l0-256zM271 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"></path></svg>
  </button>
</div>
</div>
        `;
};



let AllProductsData;
async function FetchDataFromDB() {
  var res = await fetch(`${BackEndHostedURI}/api/products`);
  res = await res.json();
  // console.log(res)
  AllProductsData = res.data;

  AllProductsData.forEach((product) => {
    const SingleProductHTML = `
        <div class="singleProductOnAdmin text-black flex-wrap flex justify-between items-center w-full rounded-[15px] shadow bg-white py-2 px-3">
        <a href="/SinleProductView?PCode=${product.ProductCode}">
<img  src="${product.ProductImgUrl[0]
      }" loading="lazy" class="w-[150px] cursor-pointer hover:scale-110 duration-300 transition-all ease-in-out h-[60px] bg-green-400 rounded-[10px]" alt="">
  </a>
<p class="text-black">${product.ProductCode}</p>
<h1 class="text-black">${product.ProductName}</h1>
<p class="text-black">${product.Cetagroy}</p>
<p style="text-decoration: line-through;" class="text-black ">${product.ProductOriginalPrice ? product.ProductOriginalPrice : " Null"
      }</p>
  <p class="text-black">${product.ProductOfferPrice ? product.ProductOfferPrice : "Null"
      }</p>
<div class="DeleteAndUpdateBtns gap-2 flex">
  <button onclick="handleUpdateBtnClick('${product.ProductCode
      }')" class="UpdateButton hover:scale-95 transition-all duration-400 h-10 w-10 flex justify-center items-center">
    <svg stroke="currentColor" fill="" stroke-width="0" viewBox="0 0 576 512" height="25px" width="25px" xmlns="http://www.w3.org/2000/svg" class="copy-svg-injected"><path d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z"></path></svg>
  </button>
  <button onclick="handleDeleteBtnClick('${product.ProductCode
      }')" class="DeleteButton h-10 w-10 hover:scale-95 transition-all duration-400 flex justify-center items-center">
    <svg stroke="currentColor" fill="red" stroke-width="0" viewBox="0 0 576 512" height="25px" width="25px" xmlns="http://www.w3.org/2000/svg" class="copy-svg-injected"><path d="M576 128c0-35.3-28.7-64-64-64L205.3 64c-17 0-33.3 6.7-45.3 18.7L9.4 233.4c-6 6-9.4 14.1-9.4 22.6s3.4 16.6 9.4 22.6L160 429.3c12 12 28.3 18.7 45.3 18.7L512 448c35.3 0 64-28.7 64-64l0-256zM271 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"></path></svg>
  </button>
</div>
</div>
        `;
    AllProductsListContainer.insertAdjacentHTML("beforeend", SingleProductHTML);
  });

}

FetchDataFromDB();

document.addEventListener("DOMContentLoaded", () => {
  const lazyImages = document.querySelectorAll("img.lazy");

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove("lazy");
        observer.unobserve(img);
      }
    });
  });

  lazyImages.forEach((img) => observer.observe(img));
});
