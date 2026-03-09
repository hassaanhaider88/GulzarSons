import { BackEndHostedURI } from "./BEURI.js";

const API_URL = `${BackEndHostedURI}/api/orders`; // change if deployed
const tableBody = document.getElementById("ordersTableBody");

// Fetch all orders
async function fetchOrders() {
  tableBody.innerHTML = `<tr><td colspan="7" class="text-center p-4">Loading...</td></tr>`;
  try {
    const res = await fetch(API_URL);
    const orders = await res.json();
    console.log(orders)
    if (!orders.success || orders.orders.length == 0) {
      tableBody.innerHTML = `<tr><td colspan="7" class="text-center p-4">No orders found</td></tr>`;
      return;
    }

    tableBody.innerHTML = "";

    orders.orders.forEach((order) => {
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
                   ${p.ProductId.ProductCode} (QTY:${p.ProductQuantity})
                </a>
              </div>`
          ).join("")
          : "No products"
        }
</td>


        <td class="p-2">Rs. ${order.TotalAmount}</td>
        <td class="p-2">
          <select onchange="updateOrder('${order._id}', { PaymentStatus: this.value })" class="border rounded p-1">
            ${["Pending", "Paid", "Failed", "Refunded"]
          .map((status) => `<option ${order.PaymentStatus === status ? "selected" : ""}>${status}</option>`)
          .join("")}
          </select>
        </td>
        <td class="p-2">
          <select onchange="updateOrder('${order._id}', { OrderStatus: this.value })" class="border rounded p-1">
            ${["Pending", "Processing", "Shipped", "Delivered", "Cancelled"]
          .map((status) => `<option ${order.OrderStatus === status ? "selected" : ""}>${status}</option>`)
          .join("")}
          </select>
        </td>
        <td class="p-2 text-center">
          <button onclick="deleteOrder('${order._id}')" class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  } catch (err) {
    console.error(err);
    tableBody.innerHTML = `<tr><td colspan="7" class="text-center p-4 text-red-500">Failed to fetch orders</td></tr>`;
  }
}

// Update order
window.updateOrder = async function (id, updateData) {
  if (!confirm("Are you sure you want to update this order?")) return;
  try {
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
      return;
    } else {
      await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });
      fetchOrders();
    }

  } catch (err) {
    console.error("Error updating order:", err);
  }
}

// Delete order
window.deleteOrder = async function (id) {
  if (!confirm("Are you sure you want to delete this order?")) return;
  try {
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
      return;
    } else {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      fetchOrders();
    }

  } catch (err) {
    console.error("Error deleting order:", err);
  }
}

// Initial load
fetchOrders();

window.checkForAdmin = function () {
  if (!localStorage.getItem("email")) {
    window.location.href = "/"
  }
}

checkForAdmin()