# 🛒 RMERCH — E-Commerce SQL Database Project

RMERCH is a **coder-focused merchandise store database project** built with **MySQL**. The store sells coding-themed hoodies, mugs, stickers, notebooks, T-shirts, and other accessories.

This project demonstrates practical SQL concepts through a realistic e-commerce database, including **database design, table relationships, primary keys, foreign keys, data insertion, joins, aggregation, filtering, and business analysis queries**.

## 📌 Project Overview

The RMERCH database is designed to represent the core operations of an online merchandise store.

The database contains information about:

* 👤 Customers
* 🛍️ Products
* 📦 Orders
* 🧾 Order Items
* 💳 Payments

The project also includes business-oriented SQL queries to analyze sales, customers, products, revenue, and cancelled orders.

---

## 🗂️ Database Structure

The project contains **5 relational tables**:

### 1. Customers

Stores customer information.

| Column        | Description        |
| ------------- | ------------------ |
| `customer_id` | Unique customer ID |
| `name`        | Customer name      |
| `email`       | Customer email     |
| `city`        | Customer city      |
| `signup_date` | Registration date  |

### 2. Products

Stores merchandise information.

| Column         | Description         |
| -------------- | ------------------- |
| `product_id`   | Unique product ID   |
| `product_name` | Name of the product |
| `category`     | Product category    |
| `price`        | Product price       |
| `stock`        | Available inventory |

### 3. Orders

Stores customer orders.

| Column         | Description                      |
| -------------- | -------------------------------- |
| `order_id`     | Unique order ID                  |
| `customer_id`  | Customer who placed the order    |
| `order_date`   | Date of order                    |
| `order_status` | Delivered, Pending, or Cancelled |

### 4. Order Items

Stores products included in each order.

| Column          | Description          |
| --------------- | -------------------- |
| `order_item_id` | Unique order-item ID |
| `order_id`      | Associated order     |
| `product_id`    | Purchased product    |
| `quantity`      | Quantity purchased   |

### 5. Payments

Stores payment information.

| Column         | Description                  |
| -------------- | ---------------------------- |
| `payment_id`   | Unique payment ID            |
| `order_id`     | Associated order             |
| `payment_mode` | UPI, Credit Card, Debit Card |
| `amount`       | Payment amount               |
| `payment_date` | Date of payment              |

---

## 🔗 Table Relationships

The database follows a relational structure:

```text
Customers
    │
    │ 1 : N
    ▼
 Orders
    │
    │ 1 : N
    ▼
Order Items
    │
    │ N : 1
    ▼
Products

Orders
    │
    │ 1 : N
    ▼
Payments
```

### Relationships

* One **customer** can place multiple orders.
* One **order** can contain multiple order items.
* One **product** can appear in multiple order items.
* An **order** can have associated payment records.

Foreign keys are used to maintain **referential integrity** between the tables.

---

## 🛠️ Technologies Used

* **MySQL**
* SQL
* Relational Database Management Systems (RDBMS)

### SQL Concepts Demonstrated

* `CREATE DATABASE`
* `CREATE TABLE`
* Primary Keys
* Foreign Keys
* `AUTO_INCREMENT`
* `UNIQUE`
* `DECIMAL`
* `INSERT INTO`
* `SELECT`
* `WHERE`
* `JOIN`
* `GROUP BY`
* `ORDER BY`
* Aggregate Functions

  * `SUM()`
  * `COUNT()`
* Filtering and business analysis

---

## 📊 Business Analysis Queries

The project includes SQL queries for analyzing important business metrics.

### 💰 Total Revenue

Calculates the total revenue recorded in the payments table.

```sql
SELECT SUM(amount) AS total_revenue
FROM payments;
```

### 🛍️ Revenue by Product

Identifies which products generate the most revenue from delivered orders.

```sql
SELECT p.product_name,
       SUM(oi.quantity * p.price) AS revenue
FROM order_items oi
JOIN products p
    ON oi.product_id = p.product_id
JOIN orders o
    ON oi.order_id = o.order_id
WHERE o.order_status = 'Delivered'
GROUP BY p.product_name
ORDER BY revenue DESC;
```

### 👑 Top Customers by Spend

Identifies customers who have spent the most.

```sql
SELECT c.name,
       SUM(p.amount) AS total_spent
FROM customers c
JOIN orders o
    ON c.customer_id = o.customer_id
JOIN payments p
    ON o.order_id = p.order_id
GROUP BY c.name
ORDER BY total_spent DESC;
```

### 📦 Best-Selling Products

Finds products based on total quantity sold.

```sql
SELECT p.product_name,
       SUM(oi.quantity) AS total_sold
FROM order_items oi
JOIN products p
    ON oi.product_id = p.product_id
GROUP BY p.product_name
ORDER BY total_sold DESC;
```

### ❌ Cancelled Orders

Counts the number of cancelled orders.

```sql
SELECT COUNT(*) AS cancelled_orders
FROM orders
WHERE order_status = 'Cancelled';
```

---

## 📁 Project Structure

```text
RMERCH/
│
├── rmerch.sql
└── README.md
```

The `rmerch.sql` file contains:

```text
1. Database creation
2. Table creation
3. Foreign key relationships
4. Customer data
5. Product data
6. Order data
7. Order item data
8. Payment data
9. Business analysis queries
```

---

## 🚀 How to Run the Project

### 1. Install MySQL

Install MySQL Server and a MySQL client such as:

* MySQL Workbench
* phpMyAdmin
* DBeaver
* VS Code with a MySQL extension

### 2. Clone the Repository

```bash
git clone https://github.com/your-username/RMerch.git
```

### 3. Open MySQL

Run the SQL script:

```sql
SOURCE rmerch.sql;
```

Or open `rmerch.sql` in MySQL Workbench and execute it.

### 4. Select the Database

```sql
USE RMerch;
```

### 5. Verify the Tables

```sql
SHOW TABLES;
```

You should see:

```text
customers
products
orders
order_items
payments
```

---

## 🎯 Learning Objectives

This project was created to strengthen practical SQL and database skills by working with a realistic e-commerce scenario.

Through this project, I practiced:

* Designing relational databases
* Creating normalized tables
* Establishing table relationships
* Implementing primary and foreign keys
* Managing structured data
* Writing multi-table joins
* Performing aggregation and filtering
* Analyzing business data using SQL
* Translating business questions into SQL queries

---

## 🔮 Future Improvements

Possible improvements for future versions include:

* Customer lifetime value analysis
* Monthly revenue analysis
* Revenue by category
* Monthly sales trends
* Repeat customer analysis
* Average order value
* Customer retention analysis
* Low-stock product detection
* Most profitable product categories
* Payment-method analysis
* Stored procedures
* Views
* Triggers
* Index optimization
* SQL dashboards using Power BI or Tableau


