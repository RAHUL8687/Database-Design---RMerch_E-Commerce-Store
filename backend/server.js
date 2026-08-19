const express = require("express")
const cors = require("cors")
const mysql = require("mysql2")
require("dotenv").config()

const app = express()

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors())
app.use(express.json())

// =====================================================
// MYSQL CONNECTION
// =====================================================

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
})

db.connect((err) => {
  if (err) {
    console.error(
      "❌ MySQL connection failed:",
      err.message
    )
    return
  }

  console.log("✅ Connected to MySQL - RMerch")
})

// =====================================================
// HOME ROUTE
// =====================================================

app.get("/", (req, res) => {
  res.json({
    message:
      "Tr&Ra Merch Store Backend is running 🚀",
  })
})

// =====================================================
// TEST DATABASE
// =====================================================

app.get("/api/test-db", (req, res) => {
  db.query(
    "SELECT 1 AS test",
    (err, result) => {
      if (err) {
        console.error(
          "Database test error:",
          err
        )

        return res.status(500).json({
          success: false,
          message:
            "Database connection failed",
        })
      }

      res.json({
        success: true,
        message:
          "MySQL database connected successfully",
        result: result,
      })
    }
  )
})

// =====================================================
// GET PRODUCTS
// =====================================================

app.get("/api/products", (req, res) => {
  const sql = `
    SELECT
      product_id,
      product_name,
      category,
      price,
      stock,
      image_url
    FROM products
    ORDER BY product_id ASC
  `

  db.query(
    sql,
    (err, results) => {
      if (err) {
        console.error(
          "Products error:",
          err
        )

        return res.status(500).json({
          success: false,
          message:
            "Failed to fetch products",
        })
      }

      res.json({
        success: true,
        products: results,
      })
    }
  )
})

// =====================================================
// LOGIN
// =====================================================

app.post("/api/login", (req, res) => {
  const {
    email,
    password,
  } = req.body

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message:
        "Email and password are required",
    })
  }

  const sql = `
    SELECT
      customer_id,
      name,
      email,
      city
    FROM customers
    WHERE email = ?
    AND password = ?
    LIMIT 1
  `

  db.query(
    sql,
    [email, password],
    (err, results) => {
      if (err) {
        console.error(
          "Login error:",
          err
        )

        return res.status(500).json({
          success: false,
          message: "Server error",
        })
      }

      if (results.length === 0) {
        return res.status(401).json({
          success: false,
          message:
            "Invalid email or password",
        })
      }

      res.json({
        success: true,
        message:
          "Login successful",
        user: results[0],
      })
    }
  )
})

// =====================================================
// REGISTER
// =====================================================

app.post("/api/register", (req, res) => {
  const {
    name,
    email,
    password,
    city,
  } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message:
        "Name, email and password are required",
    })
  }

  const checkSql = `
    SELECT customer_id
    FROM customers
    WHERE email = ?
    LIMIT 1
  `

  db.query(
    checkSql,
    [email],
    (err, results) => {
      if (err) {
        console.error(
          "Registration check error:",
          err
        )

        return res.status(500).json({
          success: false,
          message:
            "Server error",
        })
      }

      if (results.length > 0) {
        return res.status(409).json({
          success: false,
          message:
            "Email already registered",
        })
      }

      const insertSql = `
        INSERT INTO customers
        (
          name,
          email,
          city,
          signup_date,
          password
        )
        VALUES
        (?, ?, ?, CURDATE(), ?)
      `

      db.query(
        insertSql,
        [
          name,
          email,
          city || "",
          password,
        ],
        (err, result) => {
          if (err) {
            console.error(
              "Registration error:",
              err
            )

            return res.status(500).json({
              success: false,
              message:
                "Registration failed",
            })
          }

          res.status(201).json({
            success: true,
            message:
              "Registration successful",
            customer_id:
              result.insertId,
          })
        }
      )
    }
  )
})

// =====================================================
// CREATE ORDER
// =====================================================

app.post("/api/orders", (req, res) => {
  const {
    customer_id,
    items,
    payment_mode,
  } = req.body

  // ---------------------------------------------------
  // VALIDATION
  // ---------------------------------------------------

  if (!customer_id) {
    return res.status(400).json({
      success: false,
      message:
        "Customer ID is required",
    })
  }

  if (
    !Array.isArray(items) ||
    items.length === 0
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Cart is empty",
    })
  }

  // ---------------------------------------------------
  // START TRANSACTION
  // ---------------------------------------------------

  db.beginTransaction((err) => {
    if (err) {
      console.error(
        "Transaction error:",
        err
      )

      return res.status(500).json({
        success: false,
        message:
          "Could not start transaction",
      })
    }

    // -------------------------------------------------
    // VERIFY CUSTOMER
    // -------------------------------------------------

    const customerSql = `
      SELECT customer_id
      FROM customers
      WHERE customer_id = ?
      LIMIT 1
    `

    db.query(
      customerSql,
      [customer_id],
      (err, customerResults) => {
        if (err) {
          return rollback(
            res,
            "Customer verification failed"
          )
        }

        if (
          customerResults.length === 0
        ) {
          return rollback(
            res,
            "Customer not found"
          )
        }

        checkProducts()
      }
    )

    // -------------------------------------------------
    // CHECK PRODUCTS
    // -------------------------------------------------

    const checkProducts = () => {
      let completedItems = 0
      let totalAmount = 0

      const verifiedItems = []

      items.forEach((item) => {
        const productId = Number(
          item.product_id
        )

        const quantity = Number(
          item.quantity
        )

        if (
          !Number.isInteger(
            productId
          ) ||
          !Number.isInteger(
            quantity
          ) ||
          quantity <= 0
        ) {
          return rollback(
            res,
            "Invalid product or quantity"
          )
        }

        const productSql = `
          SELECT
            product_id,
            product_name,
            price,
            stock
          FROM products
          WHERE product_id = ?
          FOR UPDATE
        `

        db.query(
          productSql,
          [productId],
          (err, productResults) => {
            if (err) {
              console.error(
                "Product check error:",
                err
              )

              return rollback(
                res,
                "Failed to check product"
              )
            }

            if (
              productResults.length === 0
            ) {
              return rollback(
                res,
                "Product not found"
              )
            }

            const product =
              productResults[0]

            if (
              product.stock < quantity
            ) {
              return rollback(
                res,
                `${product.product_name} does not have enough stock`
              )
            }

            const itemTotal =
              Number(product.price) *
              quantity

            totalAmount += itemTotal

            verifiedItems.push({
              product_id:
                product.product_id,

              quantity: quantity,

              price: Number(
                product.price
              ),
            })

            completedItems++

            if (
              completedItems ===
              items.length
            ) {
              createOrder(
                verifiedItems,
                totalAmount
              )
            }
          }
        )
      })
    }

    // -------------------------------------------------
    // CREATE ORDER
    // -------------------------------------------------

    const createOrder = (
      verifiedItems,
      totalAmount
    ) => {
      const orderSql = `
        INSERT INTO orders
        (
          customer_id,
          order_date,
          order_status
        )
        VALUES
        (
          ?,
          CURDATE(),
          'Pending'
        )
      `

      db.query(
        orderSql,
        [customer_id],
        (err, orderResult) => {
          if (err) {
            console.error(
              "Create order error:",
              err
            )

            return rollback(
              res,
              "Failed to create order"
            )
          }

          const orderId =
            orderResult.insertId

          insertOrderItems(
            orderId,
            verifiedItems,
            totalAmount
          )
        }
      )
    }

    // -------------------------------------------------
    // INSERT ORDER ITEMS
    // -------------------------------------------------

    const insertOrderItems = (
      orderId,
      verifiedItems,
      totalAmount
    ) => {
      let completedItems = 0

      verifiedItems.forEach(
        (item) => {
          const itemSql = `
            INSERT INTO order_items
            (
              order_id,
              product_id,
              quantity
            )
            VALUES
            (?, ?, ?)
          `

          db.query(
            itemSql,
            [
              orderId,
              item.product_id,
              item.quantity,
            ],
            (err) => {
              if (err) {
                console.error(
                  "Order item error:",
                  err
                )

                return rollback(
                  res,
                  "Failed to create order items"
                )
              }

              completedItems++

              if (
                completedItems ===
                verifiedItems.length
              ) {
                updateStock(
                  orderId,
                  verifiedItems,
                  totalAmount
                )
              }
            }
          )
        }
      )
    }

    // -------------------------------------------------
    // UPDATE STOCK
    // -------------------------------------------------

    const updateStock = (
      orderId,
      verifiedItems,
      totalAmount
    ) => {
      let completedItems = 0

      verifiedItems.forEach(
        (item) => {
          const stockSql = `
            UPDATE products
            SET stock = stock - ?
            WHERE product_id = ?
          `

          db.query(
            stockSql,
            [
              item.quantity,
              item.product_id,
            ],
            (err) => {
              if (err) {
                console.error(
                  "Stock update error:",
                  err
                )

                return rollback(
                  res,
                  "Failed to update stock"
                )
              }

              completedItems++

              if (
                completedItems ===
                verifiedItems.length
              ) {
                createPayment(
                  orderId,
                  totalAmount
                )
              }
            }
          )
        }
      )
    }

    // -------------------------------------------------
    // CREATE PAYMENT
    // -------------------------------------------------

    const createPayment = (
      orderId,
      totalAmount
    ) => {
      const paymentSql = `
        INSERT INTO payments
        (
          order_id,
          payment_mode,
          amount,
          payment_date
        )
        VALUES
        (
          ?,
          ?,
          ?,
          CURDATE()
        )
      `

      db.query(
        paymentSql,
        [
          orderId,
          payment_mode ||
            "Cash on Delivery",
          totalAmount,
        ],
        (err) => {
          if (err) {
            console.error(
              "Payment error:",
              err
            )

            return rollback(
              res,
              "Failed to create payment"
            )
          }

          // -------------------------------------------
          // COMMIT
          // -------------------------------------------

          db.commit((err) => {
            if (err) {
              console.error(
                "Commit error:",
                err
              )

              return rollback(
                res,
                "Failed to complete order"
              )
            }

            res.status(201).json({
              success: true,
              message:
                "Order placed successfully",

              order: {
                order_id:
                  orderId,

                customer_id:
                  customer_id,

                total_amount:
                  totalAmount,

                payment_mode:
                  payment_mode ||
                  "Cash on Delivery",
              },
            })
          })
        }
      )
    }
  })
})

// =====================================================
// ROLLBACK
// =====================================================

function rollback(
  res,
  message
) {
  console.error(
    "❌ Order rollback:",
    message
  )

  db.rollback(() => {
    res.status(400).json({
      success: false,
      message: message,
    })
  })
}

// =====================================================
// START SERVER
// =====================================================

const PORT = process.env.PORT || 5001

app.listen(PORT, () => {
  console.log(
    `🚀 Server running on port ${PORT}`
  )
})


