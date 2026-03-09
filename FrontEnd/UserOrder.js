import { BackEndHostedURI } from './BEURI.js'

const API_URL = `${BackEndHostedURI}/api/orders`; // change if deployed
const tableBody = document.getElementById("ordersTableBody");

// Fetch all orders saved in localStorage
async function fetchOrders() {
  tableBody.innerHTML = `<tr><td colspan="8" class="text-center p-4">Loading...</td></tr>`;

  try {
    let UserCartData = JSON.parse(localStorage.getItem("ProductId"));
    console.log(UserCartData)
    // Agar koi order hi nahi hai to products page pe bhej do
    if (!UserCartData || UserCartData.length === 0) {
      window.location.href = "/products?productCetagory=All";
      return;
    }

    tableBody.innerHTML = "";

    // Loop through each saved order
    for (let orderObj of UserCartData) {
      const res = await fetch(`${API_URL}/${orderObj._id}`);
      const orderData = await res.json();
      console.log(orderData)
      if (!orderData.success) continue;

      const order = orderData.order;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="p-2">${order._id}</td>
        <td class="p-2">
          <div>
            <p class="font-bold">${order.BuyerName}</p>
            <p class="text-xs text-gray-600">${order.BuyerPhone}</p>
            <p class="text-xs text-gray-600">${order.BuyerAddress}</p>
          </div>
        </td>
        <td class="p-2">
          ${order.Products && order.Products.length > 0
          ? order.Products.map(
            (p) => `
              <div class="flex items-center space-x-2 mb-1">
                <a href="/SinleProductView?PCode=${p.ProductId.ProductCode}" 
                   class="text-xs font-semibold text-yellow-600 hover:underline">
                   ${p.ProductId.ProductCode} (QTY: ${p.ProductQuantity})
                </a>
              </div>`
          ).join("")
          : "No products"
        }
        </td>
        <td class="p-2">Rs. ${order.TotalAmount}</td>
        <td class="p-2">
          <p class="border rounded p-1 w-fit py-2 px-2">${order.PaymentStatus}</p>
        </td>
        <td class="p-2">
          <p class="border rounded p-1 w-fit py-2 px-2">${order.OrderStatus}</p>
        </td>
        <td class="p-2 text-center">
          ${order.PaymentMethod === "COD"
          ? "Cash On Delivery"
          : `
              <p 
                  class='border rounded p-1 w-fit py-2 px-2 cursor-pointer text-green-600 hover:bg-green-100'
                  onclick="handleMezaanPayBtnClick('${order.ProductId[0].ProductCode}', ${order.TotalAmount})"
                >EasyPaisaMezaan Bank Pay</p>
              `
        }
        </td>
        <td class="p-2 text-center">
          ${order.OrderStatus === "Cancelled"
          ? `<button class="bg-gray-400 text-white px-3 py-1 rounded cursor-not-allowed" disabled>
                   Order Cancelled
                 </button>`
          : `<button onclick="updateOrder('${order._id}', { OrderStatus: 'Cancelled' })" 
                         class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                   Cancel
                 </button>`
        }
        </td>
      `;
      tableBody.appendChild(row);
    }
  } catch (err) {
    console.error(err);
    tableBody.innerHTML = `<tr><td colspan="8" class="text-center p-4 text-red-500">Failed to fetch orders</td></tr>`;
  }
}

// Update order
window.updateOrder = async function (id, updateData) {
  try {
    var IsReadyToCencel = confirm("Are You Really Want To Cancel?");
    if (!IsReadyToCencel) return;
    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData),
    });
    fetchOrders();
  } catch (err) {
    console.error("Error updating order:", err);
  }
}

// Handle EasyPaisa payment
window.handleMezaanPayBtnClick = function (productId, productPrice) {
  if (productPrice == 0 || productPrice == null) {
    alert("Please Contact Us On WhatsApp");
    window.location.href = `https://wa.me/923108184555?text=${productId}`;
    return;
  }
  var IsReadyToPay = confirm("Are You Really Want To Pay?");
  if (!IsReadyToPay) return;
  alert("Will be Added Soon");
  console.log(productId, productPrice);
};

// Initial load
fetchOrders();
