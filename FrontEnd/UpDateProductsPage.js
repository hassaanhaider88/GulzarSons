import { BackEndHostedURI } from './BEURI.js'
// import AllProductsData from "./assets/AllProductsData.js";

var simplemde = new SimpleMDE({
  element: document.getElementById("TextAre"),
});

const params = new URLSearchParams(window.location.search);
let PCode = params.get("productCode");

let UpdateAbleProduct;
async function FetchSinleProductAndShow() {
  if (PCode) {
    PCode = decodeURIComponent(PCode);
    PCode = PCode.replace(/"/g, "");
    2;
  }

  if (PCode) {
    let res = await fetch(`${BackEndHostedURI}/api/products/sinlge-product`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({ ProductCode: PCode })
    }
    );
    res = await res.json();
    console.log(res)
    UpdateAbleProduct = res.data;

    if (!UpdateAbleProduct) {
      window.location.href = "./AdminPage.html";
    }
    document.getElementById("productCode").value = UpdateAbleProduct.ProductCode;
    document.getElementById("productName").value = UpdateAbleProduct.ProductName;
    // document.getElementById("TextAre").value = UpdateAbleProduct.ProductDescript;
    simplemde.value(UpdateAbleProduct.ProductDescript || "");
    document.getElementById("productCategory").value = UpdateAbleProduct.Cetagroy;
    document.getElementById('productYTUrl').value = `https://www.youtube.com/watch?v=${UpdateAbleProduct.ProductYTVideoCode}` || '';
    document.getElementById("ProductOriginalPrice").value = UpdateAbleProduct.ProductOriginalPrice;
    document.getElementById("ProductOfferPrice").value = UpdateAbleProduct.ProductOfferPrice;
    document.getElementById("isAvailable").checked = UpdateAbleProduct.IsProductAvailable;

    renderExistingImage(UpdateAbleProduct.ProductImgUrl);
  }
}

FetchSinleProductAndShow()

const form = document.getElementById("productForm");


form.addEventListener("submit", (e) => {
  e.preventDefault();

  const productCode = document.getElementById("productCode").value;
  const productName = document.getElementById("productName").value;
  // const productDesc = document.getElementById("TextAre").value();
  const productDesc = simplemde.value();

  const productCategory = document.getElementById("productCategory").value;
  const productYTUrl = document.getElementById("productYTUrl").value;
  const ProductOriginalPrice = document.getElementById("ProductOriginalPrice").value;
  const ProductOfferPrice = document.getElementById("ProductOfferPrice").value;
  const isAvailable = document.getElementById("isAvailable").checked;
  const images = document.getElementById("productImages").files;

  // Convert images to fake URLs (in real case you’ll upload to Cloudinary)
  const imageUrls = [];
  for (let i = 0; i < images.length; i++) {
    imageUrls.push(URL.createObjectURL(images[i]));
  }
  let productObj;
  if (images.length > 0) {
    productObj = {
      ProductCode: productCode,
      ProductName: productName,
      ProductImgUrl: imageUrls,
      ProductDescript: productDesc,
      Cetagroy: productCategory,
      ProductYTVideoUrl: productYTUrl,
      ProductOriginalPrice: ProductOriginalPrice,
      ProductOfferPrice: ProductOfferPrice,
      IsProductAvailable: isAvailable,
    };

  } else {
    productObj = {
      ProductCode: productCode,
      ProductName: productName,
      ProductImgUrl: UpdateAbleProduct.ProductImgUrl,
      ProductDescript: productDesc,
      Cetagroy: productCategory,
      ProductYTVideoUrl: productYTUrl,
      ProductOriginalPrice: ProductOriginalPrice,
      ProductOfferPrice: ProductOfferPrice,
      IsProductAvailable: isAvailable,
    };

  }
   HanldeFinalUpadateProduct()

});


window.HanldeFinalUpadateProduct = async function () {
  try {

    const name = document.getElementById("productName").value.trim();
    const category = document.getElementById("productCategory").value;
    const originalPrice = Number(document.getElementById("ProductOriginalPrice").value) || 0;
    const offerPrice = Number(document.getElementById("ProductOfferPrice").value) || 0;
    const ytUrl = document.getElementById("productYTUrl").value.trim();
    const isAvailable = document.getElementById("isAvailable").checked;

    // Proper no change check
    const noChange =
      name === UpdateAbleProduct.ProductName &&
      category === UpdateAbleProduct.Cetagroy &&
      originalPrice === UpdateAbleProduct.ProductOriginalPrice &&
      offerPrice === UpdateAbleProduct.ProductOfferPrice &&
      ytUrl === (UpdateAbleProduct.ProductYTVideoUrl || "") &&
      isAvailable === UpdateAbleProduct.IsProductAvailable;

    if (noChange) {
      alert("You didn't change anything");
      return;
    }

    const userInput = prompt("Please enter your Password:");
    if (!userInput) {
      alert("Password required");
      return;
    }

    // Admin verify
    const loginRes = await fetch(`${BackEndHostedURI}/api/admin-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        passwordInput: userInput,
        emailInput: localStorage.getItem("email"),
      }),
    });

    const loginData = await loginRes.json();

    if (!loginData.success) {
      alert("Email or password is wrong");
      return;
    }

    document.getElementById("FinalUpdateProductBtn").classList.add("hidden");

    // -------- MULTIPLE IMAGE UPLOAD --------
    const files = document.getElementById("productImages").files;
    let uploadedUrls = [];

    if (files.length > 0) {

      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("image", files[i]);

        const res = await fetch(`${BackEndHostedURI}/api/upload-img`, {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (data?.url) {
          uploadedUrls.push(data.url);
        }
      }

    } else {
      // Agar new images nahi upload hui
      uploadedUrls = UpdateAbleProduct.ProductImgUrl || [];
    }

    // -------- FINAL UPDATE CALL --------
    const updateRes = await fetch(`${BackEndHostedURI}/api/products/update-product`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ProductCode: UpdateAbleProduct.ProductCode,
        ProductName: name,
        ProductImgUrl: uploadedUrls,   // ALWAYS ARRAY
        ProductDescript: simplemde.value(),
        Cetagroy: category,
        ProductYTVideoUrl: ytUrl,
        ProductOriginalPrice: originalPrice,
        ProductOfferPrice: offerPrice,
        IsProductAvailable: isAvailable,
      }),
    });

    const updateData = await updateRes.json();

    if (updateData.success) {
      window.location.href = "./AdminPage.html";
    } else {
      alert("Something went wrong");
      document.getElementById("FinalUpdateProductBtn").classList.remove("hidden");
    }

  } catch (error) {
    console.error(error);
    alert("Unexpected error occurred");
    document.getElementById("FinalUpdateProductBtn").classList.remove("hidden");
  }
};



window.renderExistingImage = function (imagesArray) {
  const container = document.getElementById("imagePreviewContainer");
  container.innerHTML = "";

  if (!imagesArray || !imagesArray.length) return;

  imagesArray.forEach((url) => {
    container.insertAdjacentHTML(
      "beforeend",
      `
      <img 
        src="${url}"
        class="w-40 h-40 object-cover rounded-lg shadow"
      />
      `
    );
  });
};

document
  .getElementById("productImages")
  .addEventListener("change", function () {

    const files = this.files;
    const container = document.getElementById("imagePreviewContainer");

    container.innerHTML = "";

    if (!files.length) return;

    for (let i = 0; i < files.length; i++) {
      const localUrl = URL.createObjectURL(files[i]);

      container.insertAdjacentHTML(
        "beforeend",
        `
        <div class="relative">
          <img 
            src="${localUrl}"
            class="w-40 h-40 object-cover rounded-lg shadow"
          />
        </div>
        `
      );
    }
  });