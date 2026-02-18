# Gulzar & Sons E-commerce Backend API

This repository hosts the backend API for an e-commerce platform, likely for a furniture business ("Gulzar & Sons"). It provides robust functionalities for managing products, orders, special offers, customer inquiries, and integrating with external services like Cloudinary for image uploads and Google Maps for business reviews.

## Tech Stack

The project is built primarily with Node.js and leverages a modern JavaScript ecosystem:

*   **Language**: JavaScript (ESM - ECMAScript Modules)
*   **Runtime**: Node.js
*   **Web Framework**: Express.js
*   **Database**: MongoDB (NoSQL)
*   **ODM (Object Data Modeling)**: Mongoose
*   **Cloud Storage**: Cloudinary for image management
*   **Environment Variables**: `dotenv`
*   **CORS**: `cors` middleware for cross-origin requests
*   **File Uploads**: `multer` and `multer-storage-cloudinary`
*   **HTTP Client**: `axios` (used for Pinterest integration)
*   **Google Reviews Scraping**: `google-maps-review-scraper`, `puppeteer`
*   **Development Tools**: `nodemon` (for automatic server restarts)

## Project Structure

The project follows a modular structure, organizing features into distinct directories for better maintainability and scalability.

```
.
├── Configs/                  # Database and external service configurations
│   ├── CloudinaryConfig.js   # Cloudinary setup
│   └── MongoDBConfig.js      # MongoDB connection
├── Offers/                   # Offer management module
│   ├── Offers.Modal.js       # Mongoose schema for offers
│   └── Offers.Router.js      # API routes for offers
├── Orders/                   # Order management module
│   ├── Order.Controller.js   # Logic for handling order requests
│   ├── Order.Modal.js        # Mongoose schema for orders
│   └── Order.Router.js       # API routes for orders
├── Products/                 # Product management module
│   ├── Product.Controller.js # Logic for handling product requests
│   ├── Product.Modal.js      # Mongoose schema for products
│   └── Product.Router.js     # API routes for products
├── Services/                 # Utility functions and external integrations
│   ├── PostToPinsterest.js   # Pinterest API integration (partial)
│   ├── RequestLogger.js      # Custom request logging middleware
│   ├── SendGoogleReviews.js  # Google Maps review scraping
│   └── getYTCode.js          # Utility to extract YouTube video codes
├── User/                     # User inquiry/contact management module
│   ├── User.Conroller.js     # Logic for handling user requests
│   ├── User.Modal.js         # Mongoose schema for users
│   └── User.Router.js        # API routes for users
├── .env.example              # Example environment variables (create .env from this)
├── ImageUploader.Router.js   # Dedicated router for image uploads
├── Reviews.json              # Local fallback for Google reviews data
├── server.js                 # Main entry point and Express server setup
├── package.json              # Project metadata and dependencies
└── README.md                 # Project documentation
```

## Key Features

This API provides a comprehensive set of features for managing an e-commerce backend:

*   **Product Management**:
    *   Create, retrieve (all, single), update, and delete product listings.
    *   Products include details like code, name, multiple image URLs, description, category, YouTube video code, original and offer prices, and availability status.
    *   Aggregated product listing with sorting by price.
*   **Order Management**:
    *   Create new customer orders with details including products (with quantity), buyer information (name, phone, email, address), payment method, payment status, order status, transaction ID, and total amount.
    *   Retrieve all orders or a single order by ID, with product details populated.
    *   Update order and payment statuses.
    *   Delete orders.
*   **Offer Management**:
    *   Add, retrieve (all), and delete special offers.
    *   Offers include title, description, duration, and validity period.
    *   Virtual property `isExpired` to check offer validity.
*   **Image Upload Service**:
    *   Dedicated endpoint for uploading images to Cloudinary, ensuring efficient media hosting and delivery.
*   **User Inquiry/Contact Management**:
    *   Store user contact details and messages submitted through a contact form.
*   **Google Reviews Integration**:
    *   Scrape and display real-time Google Reviews for a specific business location.
    *   Includes a fallback mechanism to serve reviews from a local `Reviews.json` file if scraping fails.
*   **Admin Authentication**:
    *   A basic `/api/admin-login` endpoint for administrative access, secured via environment variables.
*   **YouTube Video Code Extraction**:
    *   A utility function to extract YouTube video IDs from various YouTube URL formats (standard, shorts, share links).
*   **Global Request Logging**:
    *   Middleware to log incoming HTTP requests for monitoring and debugging.

## API Endpoints

All API endpoints are prefixed with `/api`.

| Method | Endpoint                    | Description                                              | Controller/Router               |
| :----- | :-------------------------- | :------------------------------------------------------- | :------------------------------ |
| `GET`  | `/`                         | API health check.                                        | `server.js`                     |
| `POST` | `/api/admin-login`          | Authenticates an admin user with email and password.     | `server.js`                     |
| `GET`  | `/api/products`             | Retrieves all products, sorted by price.                 | `Products/Product.Router.js`    |
| `POST` | `/api/products/create`      | Creates a new product.                                   | `Products/Product.Router.js`    |
| `POST` | `/api/products/sinlge-product` | Retrieves a single product by `ProductCode` from `req.body`. | `Products/Product.Router.js`    |
| `POST` | `/api/products/update-product` | Updates an existing product by `ProductCode` from `req.body`. | `Products/Product.Router.js`    |
| `POST` | `/api/products/delete-product` | Deletes a product by `ProductCode` from `req.body`.      | `Products/Product.Router.js`    |
| `GET`  | `/api/products/rss`         | _(Route defined but handler `rssRoutes` not found in `Product.Controller.js`)_ | `Products/Product.Router.js`    |
| `POST` | `/api/upload-img`           | Uploads a single image to Cloudinary. Requires `image` as field name. | `ImageUploader.Router.js`       |
| `POST` | `/api/users`                | Saves user contact/inquiry details to the database.      | `User/User.Router.js`           |
| `GET`  | `/api/offers`               | Retrieves all active offers.                             | `Offers/Offers.Router.js`       |
| `POST` | `/api/offers`               | Adds a new offer.                                        | `Offers/Offers.Router.js`       |
| `DELETE`| `/api/offers/:id`           | Deletes an offer by its ID.                              | `Offers/Offers.Router.js`       |
| `POST` | `/api/orders/create`        | Creates a new customer order.                            | `Orders/Order.Router.js`        |
| `GET`  | `/api/orders`               | Retrieves all orders.                                    | `Orders/Order.Router.js`        |
| `GET`  | `/api/orders/:id`           | Retrieves a single order by its ID.                      | `Orders/Order.Router.js`        |
| `PUT`  | `/api/orders/:id`           | Updates the status (Order/Payment) of an order by ID.    | `Orders/Order.Router.js`        |
| `DELETE`| `/api/orders/:id`           | Deletes an order by its ID.                              | `Orders/Order.Router.js`        |
| `GET`  | `/api/send-google-reviews`  | Fetches Google reviews for a predefined business URL. If scraping fails, returns data from `Reviews.json`. | `Services/SendGoogleReviews.js` |

**Note on Product Endpoints**: The product update, delete, and single product retrieval endpoints currently use `POST` requests and rely on `ProductCode` in the request body. For RESTful best practices, these operations would typically use `PUT` for updates, `DELETE` for deletions, and `GET` with URL parameters for single retrievals (e.g., `/api/products/:productCode`).

## Setup Instructions

Follow these steps to get the project up and running on your local machine.

### Prerequisites

*   Node.js (LTS recommended)
*   npm or pnpm (pnpm is listed in `package.json` but npm is also fully compatible)

### 1. Clone the Repository

```bash
git clone <repository_url>
cd backendapis # or your repository name
```

### 2. Install Dependencies

Use either npm or pnpm to install the project dependencies:

```bash
# Using npm
npm install

# Or using pnpm (if you have it installed)
pnpm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory of the project. This file will store sensitive information and configuration settings. Refer to the `.env.example` file for required variables.

```
# Server Configuration
PORT=8800 # Or any desired port

# MongoDB Configuration
MONGODB_ATLAS_CONNECTION="your_mongodb_atlas_connection_string"

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
CLOUDINARY_API_KEY="your_cloudinary_api_key"
CLOUDINARY_API_SECRET="your_cloudinary_api_secret"

# Admin Credentials (for /api/admin-login)
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="admin_password"

# Optional: Pinterest API Configuration (if `PostToPinsterest.js` were fully integrated)
# PINTEREST_BOARD_ID="your_pinterest_board_id"
# PINTEREST_ACCESS_TOKEN="your_pinterest_access_token"
```

**Important**:
*   Replace `"your_mongodb_atlas_connection_string"` with your actual MongoDB Atlas connection string.
*   Replace Cloudinary credentials with your own. You can get these from your Cloudinary dashboard.
*   Set strong credentials for `ADMIN_EMAIL` and `ADMIN_PASSWORD`.

### 4. Run the Project

You can run the project in development mode (with `nodemon` for automatic restarts) or in production mode.

#### Development Mode

```bash
npm run dev
# Or with pnpm
pnpm dev
```

The API will typically start on `http://localhost:8800` (or the `PORT` you specified in your `.env` file).

#### Production Mode

```bash
npm start
# Or with pnpm
pnpm start
```

The API will be available at the specified port.

---
