import { BackEndHostedURI } from "./BEURI.js";

var simplemde = new SimpleMDE({
  element: document.getElementById("TextAre"),
});

const form = document.getElementById("productForm");
const previewBox = document.getElementById("previewBox");
const output = document.getElementById("productOutput");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const productCode = document.getElementById("productCode").value;
  const productName = document.getElementById("productName").value;
  const productDesc = simplemde.value();
  const productYTUrl = document.getElementById("productYTUrl").value;
  const productCategory = document.getElementById("productCategory").value;
  const ProductOriginalPrice = document.getElementById("productOrigianlPrice").value;
  const ProductOfferPrice = document.getElementById("ProductOfferPrice").value;
  const isAvailable = document.getElementById("isAvailable").checked;
  const images = document.getElementById("productImages").files;

  // Show previews (temporary local URLs)
  const imageUrls = [];
  for (let i = 0; i < images.length; i++) {
    imageUrls.push(URL.createObjectURL(images[i]));
  }

  const productObj = {
    ProductCode: productCode,
    ProductName: productName,
    ProductImgUrl: imageUrls,
    ProductDescript: productDesc,
    ProductYTVideoUrl: productYTUrl,
    Cetagroy: productCategory,
    ProductOriginalPrice: ProductOriginalPrice,
    ProductOfferPrice: ProductOfferPrice,
    IsProductAvailable: isAvailable,
  };

  // Preview first image
  document.getElementById("productImage").classList.remove("hidden");
  let ImageElement = ""; // initialize as empty string
  for (let i = 0; i < imageUrls.length; i++) {
    ImageElement += `
    <img 
      src="${imageUrls[i]}"  
      class="w-80 h-80 object-cover rounded-lg m-2" 
      alt="Preview ${i + 1}" 
    />
  `;
  }

  document.getElementById("productImage").innerHTML = ImageElement;

  // console.log(imageUrls)
  document.getElementById("FinalUploadProductBtn").classList.remove("hidden");

  // Show JSON preview
  output.textContent = JSON.stringify(productObj, null, 2);
  previewBox.classList.remove("hidden");


});

window.HanldeFinalUploadProduct = async function () {
  const finalBtn = document.getElementById("FinalUploadProductBtn");
  finalBtn.setAttribute("disabled", true);

  const userInput = prompt("Please enter your Password:");
  if (!userInput) {
    alert("Password required");
    return;
  }
  const loginRes = await fetch(
    `${BackEndHostedURI}/api/admin-login`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        passwordInput: userInput,
        emailInput: localStorage.getItem("email"),
      }),
    },
  );

  const loginData = await loginRes.json();

  if (!loginData.success) {
    alert("Email or password is wrong");
    finalBtn.removeAttribute("disabled");
    return;
  } else {


    const images = document.getElementById("productImages").files;
    const uploadedUrls = [];

    const statusContainer = document.getElementById("imageUploadStatus");
    const productStatus = document.getElementById("productUploadStatus");

    // clear previous statuses
    statusContainer.innerHTML = "";
    productStatus.classList.add("hidden");

    // Upload each image with loading feedback
    for (let i = 0; i < images.length; i++) {
      const imageStatus = document.createElement("div");
      imageStatus.textContent = `Uploading image ${i + 1}...`;
      statusContainer.appendChild(imageStatus);

      const formData = new FormData();
      formData.append("image", images[i]);

      try {
        const res = await fetch(`${BackEndHostedURI}/api/upload-img`, {
          method: "POST",
          body: formData,
        });
        const uploadResult = await res.json();

        if (uploadResult?.url) {
          uploadedUrls.push(uploadResult.url);
          imageStatus.textContent = `✅ Image ${i + 1} uploaded`;
        } else {
          imageStatus.textContent = `❌ Image ${i + 1} failed`;
        }
      } catch (err) {
        console.error(err);
        imageStatus.textContent = `❌ Image ${i + 1} failed`;
      }
    }

    // Now show final product upload
    productStatus.textContent = "Uploading full product...";
    productStatus.classList.remove("hidden");

    const productCode = document.getElementById("productCode").value;
    const productName = document.getElementById("productName").value;
    const productDesc = simplemde.value();
    const productCategory = document.getElementById("productCategory").value;
    const productYTUrl = document.getElementById("productYTUrl").value;
    const ProductOriginalPrice = document.getElementById("productOrigianlPrice").value;
    const ProductOfferPrice = document.getElementById("ProductOfferPrice").value;
    const isAvailable = document.getElementById("isAvailable").checked;

    try {
      const productRes = await fetch(`${BackEndHostedURI}/api/products/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ProductCode: productCode,
          ProductName: productName,
          ProductImgUrl: uploadedUrls,
          ProductDescript: productDesc,
          ProductYTVideoUrl: productYTUrl,
          Cetagroy: productCategory,
          ProductOriginalPrice: ProductOriginalPrice,
          ProductOfferPrice: ProductOfferPrice,
          IsProductAvailable: isAvailable,
        }),
      });

      const result = await productRes.json();

      if (result.success) {
        productStatus.textContent = "✅ Product uploaded successfully!";
        productStatus.classList.add("text-green-600");
        setTimeout(() => {
          window.location.href = "./AdminPage.html";
        }, 1500); // redirect after 1.5s
      } else {
        productStatus.textContent = "❌ Product upload failed";
        productStatus.classList.add("text-red-600");
        finalBtn.removeAttribute("disabled");
      }
    } catch (err) {
      console.error(err);
      productStatus.textContent = "❌ Product upload failed";
      productStatus.classList.add("text-red-600");
      finalBtn.removeAttribute("disabled");
    }
  }
};