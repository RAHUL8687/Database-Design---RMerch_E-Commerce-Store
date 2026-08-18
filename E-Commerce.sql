-- RMERCH is a merchandise store for coders selling hoodies, mugs, stickers, notebooks, and accessories.

-- This project demonstrates:

-- Database design
-- Table relationships
-- Foreign keys
-- Realistic demo data
-- Business-style SQL analysis


CREATE DATABASE RMerch;
USE RMerch;

-- Customers Table

CREATE TABLE customers (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    email VARCHAR(150) UNIQUE,
    city VARCHAR(50),
    signup_date DATE
);

-- Products Table

CREATE TABLE products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    product_name VARCHAR(100),
    category VARCHAR(50),
    price DECIMAL(10,2),
    stock INT
);

-- Orders Table

CREATE TABLE orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT,
    order_date DATE,
    order_status VARCHAR(30),
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

-- Order Items Table

CREATE TABLE order_items (
    order_item_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT,
    product_id INT,
    quantity INT,
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);


-- Payments Table

CREATE TABLE payments (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT,
    payment_mode VARCHAR(30),
    amount DECIMAL(10,2),
    payment_date DATE,
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);


-- Insert Data
INSERT INTO customers (name, email, city, signup_date) VALUES
('Amit Sharma','amit@gmail.com','Delhi','2025-01-01'),
('Neha Verma','neha@gmail.com','Mumbai','2025-01-02'),
('Rahul Khan','rahul@gmail.com','Bangalore','2025-01-03'),
('Pooja Nair','pooja@gmail.com','Chennai','2025-01-04'),
('Rohit Gupta','rohit@gmail.com','Delhi','2025-01-05'),
('Ananya Roy','ananya@gmail.com','Kolkata','2025-01-06'),
('Karan Mehta','karan@gmail.com','Ahmedabad','2025-01-07'),
('Simran Kaur','simran@gmail.com','Chandigarh','2025-01-08'),
('Mohit Jain','mohit@gmail.com','Jaipur','2025-01-09'),
('Sneha Patel','sneha@gmail.com','Surat','2025-01-10'),
('Vikram Singh','vikram@gmail.com','Lucknow','2025-01-11'),
('Alok Mishra','alok@gmail.com','Patna','2025-01-12'),
('Nidhi Agarwal','nidhi@gmail.com','Noida','2025-01-13'),
('Saurabh Verma','saurabh@gmail.com','Ghaziabad','2025-01-14'),
('Riya Sen','riya@gmail.com','Pune','2025-01-15'),
('Aditya Malhotra','aditya@gmail.com','Delhi','2025-01-16'),
('Kritika Shah','kritika@gmail.com','Mumbai','2025-01-17'),
('Yash Tiwari','yash@gmail.com','Kanpur','2025-01-18'),
('Mehul Joshi','mehul@gmail.com','Vadodara','2025-01-19'),
('Isha Kapoor','isha@gmail.com','Gurgaon','2025-01-20');


-- Products

INSERT INTO products (product_name, category, price, stock) VALUES
('Python Hoodie','Clothing',1999,50),
('Java Hoodie','Clothing',1899,40),
('Debugging Mug','Accessories',599,100),
('Code Like a Pro Mug','Accessories',649,80),
('DSA Notebook','Stationery',499,150),
('SQL Cheat Sheet','Stationery',299,200),
('Sticker Pack','Stationery',249,300),
('Algorithm T-Shirt','Clothing',1499,60),
('GitHub Cap','Accessories',799,70),
('Keyboard Mat','Accessories',999,90),
('Linux Hoodie','Clothing',2099,35),
('AI Nerd T-Shirt','Clothing',1599,55),
('Whiteboard Notebook','Stationery',699,120),
('Bug Hunter Mug','Accessories',549,100),
('Terminal Stickers','Stationery',199,250),
('Coder Bottle','Accessories',899,110),
('Late Night Hoodie','Clothing',2199,30),
('Python Socks','Accessories',399,140),
('DSA Flash Cards','Stationery',349,180),
('Clean Code Notebook','Stationery',599,130);

-- Orders (20 rows)


INSERT INTO orders (customer_id, order_date, order_status) VALUES
(1,'2025-02-01','Delivered'),
(2,'2025-02-02','Delivered'),
(3,'2025-02-03','Delivered'),
(4,'2025-02-04','Cancelled'),
(5,'2025-02-05','Delivered'),
(6,'2025-02-06','Pending'),
(7,'2025-02-07','Delivered'),
(8,'2025-02-08','Delivered'),
(9,'2025-02-09','Delivered'),
(10,'2025-02-10','Cancelled'),
(11,'2025-02-11','Delivered'),
(12,'2025-02-12','Delivered'),
(13,'2025-02-13','Pending'),
(14,'2025-02-14','Delivered'),
(15,'2025-02-15','Delivered'),
(16,'2025-02-16','Delivered'),
(17,'2025-02-17','Cancelled'),
(18,'2025-02-18','Delivered'),
(19,'2025-02-19','Delivered'),
(20,'2025-02-20','Delivered');

-- Order Items (20+ rows)



INSERT INTO order_items (order_id, product_id, quantity) VALUES
(1,1,1),(1,7,2),
(2,3,1),(2,5,1),
(3,8,1),
(4,2,1),
(5,6,3),
(6,4,1),
(7,10,1),
(8,12,2),
(9,15,3),
(10,9,1),
(11,11,1),
(12,13,1),
(13,14,2),
(14,16,1),
(15,17,1),
(16,18,2),
(17,19,1),
(18,20,1),
(19,1,1),
(20,5,2);

-- Payments

INSERT INTO payments (order_id, payment_mode, amount, payment_date) VALUES
(1,'UPI',2497,'2025-02-01'),
(2,'Credit Card',1098,'2025-02-02'),
(3,'UPI',1499,'2025-02-03'),
(5,'Debit Card',897,'2025-02-05'),
(7,'UPI',999,'2025-02-07'),
(8,'Credit Card',3198,'2025-02-08'),
(9,'UPI',747,'2025-02-09'),
(11,'UPI',2099,'2025-02-11'),
(12,'Debit Card',699,'2025-02-12'),
(14,'UPI',899,'2025-02-14'),
(15,'Credit Card',2199,'2025-02-15'),
(16,'UPI',798,'2025-02-16'),
(18,'Debit Card',599,'2025-02-18'),
(19,'UPI',1999,'2025-02-19'),
(20,'Credit Card',998,'2025-02-20');

-- Analysis Queries

    -- Total Revenue

SELECT SUM(amount) AS total_revenue
FROM payments;

--  Revenue by Product

SELECT p.product_name,
       SUM(oi.quantity * p.price) AS revenue
FROM order_items oi
JOIN products p ON oi.product_id = p.product_id
JOIN orders o ON oi.order_id = o.order_id
WHERE o.order_status = 'Delivered'
GROUP BY p.product_name
ORDER BY revenue DESC;

-- Top Customers by Spend

SELECT c.name,
       SUM(p.amount) AS total_spent
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
JOIN payments p ON o.order_id = p.order_id
GROUP BY c.name
ORDER BY total_spent DESC;

-- Best Selling Products

SELECT p.product_name,
       SUM(oi.quantity) AS total_sold
FROM order_items oi
JOIN products p ON oi.product_id = p.product_id
GROUP BY p.product_name
ORDER BY total_sold DESC;

-- Cancelled Orders Count

SELECT COUNT(*) AS cancelled_orders
FROM orders
WHERE order_status = 'Cancelled';


ALTER TABLE customers
ADD COLUMN password VARCHAR(255);

SET SQL_SAFE_UPDATES = 0;

UPDATE customers
SET password = '123456';

SELECT customer_id, name, email, password
FROM customers;


USE RMerch;

SELECT * FROM customers;


USE RMerch;

SELECT *
FROM orders
ORDER BY order_id DESC
LIMIT 5;


SELECT *
FROM order_items
ORDER BY order_item_id DESC
LIMIT 5;

SELECT *
FROM payments
ORDER BY payment_id DESC
LIMIT 5;

SELECT
    product_id,
    product_name,
    price,
    stock
FROM products
WHERE product_id = 1;


USE RMerch;

ALTER TABLE products
ADD COLUMN image_url TEXT;

UPDATE products
SET image_url = 'https://merchshop.in/wp-content/uploads/2019/12/Computer-Programming-Language-Python-black-hoodie.jpg'
WHERE product_id = 1;

UPDATE products
SET image_url = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsK7JZYYO_-9PUcEhP206ypUNQMTX37dZjFzSFx249OOwllX1knN861LA&s=10'
WHERE product_id = 3;


UPDATE products
SET image_url = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFa1djg-G8R509ewyKvm_PHygAAxV7L1wzbYPHchOOealIPiTwuHqkJQ&s=10'
WHERE product_id = 5;


UPDATE products
SET image_url = 'https://m.media-amazon.com/images/I/81Tmfv34W7L.jpg'
WHERE product_id = 10;

SELECT
    product_id,
    product_name,
    image_url
FROM products
ORDER BY product_id;


UPDATE products
SET image_url = CASE product_id

    WHEN 1 THEN 'https://merchshop.in/wp-content/uploads/2019/12/Computer-Programming-Language-Python-black-hoodie.jpg'

    WHEN 2 THEN 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSI9lfKZVYOw3P6kNC7RlICH8wu5cyklVbOad9NZPj-Iw&s=10'

    WHEN 3 THEN 'https://m.media-amazon.com/images/I/81Tmfv34W7L.jpg'

    WHEN 4 THEN 'https://i.etsystatic.com/25582483/r/il/78a20d/2670792172/il_1080xN.2670792172_6083.jpg'

    WHEN 6 THEN 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRM7SPf5Mt7JxrvCxUMqWi4SsV1EZXBZh-fKAVT7Gtyew&s=10'

    WHEN 7 THEN 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLwp9DbKVoKliygCd0Q1e6fbq5k2kFKDllJXi6yAVzFzZllrZJtIL4GnQ&s=10'

    WHEN 8 THEN 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnhyBpMKXPBwA2y5Z5XT6S6vSX9hqlOp7pg5u-FQES_YmJ6yo0LNV4ZCY&s=10'

    WHEN 9 THEN 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjgjH6kx9O09pybk702DGnOUnx-xj8Ji2V5tXiv39Zbg&s=10'

    WHEN 11 THEN 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvwTy2bqKBJdph4pSLBrLpAyerehOSVU78ZtbTtupddS4eNEM_LbcXhudj&s=10'

    WHEN 12 THEN 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsWAVH2rNDViOM9txEI36v1qfyg_LDt8Rtni1Siz9jmA&s'

    WHEN 13 THEN 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpW8D53ibKZksKFTTp1WRmzLBoZEHlFdcsbCo4kLZSyg&s=10'

    WHEN 14 THEN 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQblVanZXQeJ4DARKtl1qTkpzkh76OTz_zO9XpnyIg3JA&s'

    WHEN 15 THEN 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThaCwQbdvfJ6Ec2zJVbsDXOasxq6nWTAxJA-jpSRqecw&s=10'

    WHEN 16 THEN 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1UmpTA0u3uTGjKx9U5GC0xFOlwsd-cDJ3fvKxx61DQNQSLNd-rj5W1elZ&s=10'

    WHEN 17 THEN 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzSmXZFMTcw0TH5dfKLexUix9sHtV_l7cwaGfwkdwOiqfniAYiGonCzQQ&s=10'

    WHEN 18 THEN 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFyd_s1_BQNuyVGiKnD9zwm_QzrAxKyvDorldXk-mAhA&s'

    WHEN 19 THEN 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaq70hOOlKJCk7ZNX5exhSS5vBt16vbErIrtHSFHJ9fXGeZX1_SFp54ehk&s=10'

    WHEN 20 THEN 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCgavdt49TxdqU6YA2GAqtAzDMfRVD05TiWy0XQ8FVhw&s'

END
WHERE product_id IN (
    1, 2, 3, 4,
    6, 7, 8, 9,
    11, 12, 13, 14,
    15, 16, 17, 18, 19, 20
);


SELECT product_id, product_name, image_url
FROM products
ORDER BY product_id;


UPDATE products
SET image_url = CASE product_id

    WHEN 5 THEN 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIFtGENCFmaLE6sjxdZG0fiBJgMOsLIC8rRSZMoBhybbPo9JQiJB-PtsE&s=10'

    WHEN 10 THEN 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpRVejjbXqV91VrwIMoaaTvTue7kH6ThNpZcNDYkO6rg&s'

END
WHERE product_id IN (5, 10);

SELECT product_id, product_name, image_url
FROM products
WHERE product_id IN (5, 10);