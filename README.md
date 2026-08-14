# 🛍️ Tr&Ra Merch Store

A full-stack developer-focused e-commerce platform built for programmers, developers and technology enthusiasts.

Tr&Ra Merch Store combines a modern React frontend with a Node.js/Express backend and MySQL database to provide a complete e-commerce experience including user authentication, products, cart management and order processing.

---



## 📌 Project Overview

Tr&Ra Merch Store is a full-stack e-commerce application designed around developer-themed merchandise.

Users can browse products, create accounts, log in, add products to their cart and place orders.

The backend communicates with a MySQL database to manage customers, products, orders, order items and payments.

---

## ✨ Features

### 👤 User Authentication

- User registration
- User login
- Email validation
- Password validation
- Duplicate email checking
- Customer information stored in MySQL

### 🛍️ Product Management

- Product listing
- Product categories
- Product prices
- Product stock management
- Product details
- Dynamic product retrieval from MySQL

### 🛒 Shopping Cart

- Add products to cart
- Increase product quantity
- Decrease product quantity
- Remove products
- Automatic cart total calculation
- Cart item count

### 📦 Order Management

- Place orders
- Validate customer
- Validate products
- Check product stock
- Create orders
- Create order items
- Automatically reduce product stock
- Calculate order total

### 💳 Payment Management

- Payment records
- Payment mode
- Payment amount
- Payment date
- Order-payment relationship

### 🔐 Database Transactions

Order processing uses MySQL transactions to maintain data consistency.

If an order operation fails, the transaction is rolled back.

---

## 🏗️ Tech Stack

### Frontend

- React.js
- JavaScript
- Vite
- Tailwind CSS
- HTML5
- CSS3

### Backend

- Node.js
- Express.js
- REST API
- CORS
- dotenv

### Database

- MySQL

### Development Tools

- VS Code
- Git
- GitHub
- MySQL Workbench
- Chrome DevTools

---

## 📂 Project Structure

```text
E-Commerce Store/
│
├── E-Commerce.sql
│
├── backend/
│   ├── db.js
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── Login.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
