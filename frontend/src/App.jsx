import { useEffect, useState } from "react"
import Login from "./Login"

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)

  const [cart, setCart] = useState([])
  const [products, setProducts] = useState([])

  const [loadingProducts, setLoadingProducts] = useState(true)
  const [productError, setProductError] = useState("")

  const [selectedProduct, setSelectedProduct] = useState(null)
  const [productQuantity, setProductQuantity] = useState(1)

  const [selectedCategory, setSelectedCategory] =
    useState("All")

  const [orderPlaced, setOrderPlaced] =
    useState(false)

  // =====================================================
  // FETCH PRODUCTS FROM BACKEND
  // =====================================================

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true)
        setProductError("")

        const response = await fetch(
          "http://localhost:5001/api/products"
        )

        const data = await response.json()

        if (!response.ok || !data.success) {
          throw new Error(
            data.message ||
              "Failed to load products"
          )
        }

        const formattedProducts =
          data.products.map((product) => {
            let category = product.category

            // Put sticker products into Stickers category
            if (
              product.product_name ===
                "Sticker Pack" ||
              product.product_name ===
                "Terminal Stickers"
            ) {
              category = "Stickers"
            }

            return {
              id: product.product_id,

              name: product.product_name,

              category: category,

              price: Number(product.price),

              stock: Number(product.stock),

              image:
                product.image_url ||
                `https://placehold.co/600x600?text=${encodeURIComponent(
                  product.product_name
                )}`,

              description:
                `A premium ${String(
                  product.category
                ).toLowerCase()} designed for developers and technology enthusiasts.`,
            }
          })

        setProducts(formattedProducts)
      } catch (error) {
        console.error(
          "Products fetch error:",
          error
        )

        setProductError(
          error.message ||
            "Unable to load products"
        )
      } finally {
        setLoadingProducts(false)
      }
    }

    fetchProducts()
  }, [])

  // =====================================================
  // FILTER PRODUCTS
  // =====================================================

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter(
          (product) =>
            product.category ===
            selectedCategory
        )

  // =====================================================
  // ADD TO CART
  // =====================================================

  const addToCart = (
    product,
    quantity = 1
  ) => {
    if (product.stock <= 0) {
      alert(
        "This product is out of stock."
      )

      return
    }

    setCart((currentCart) => {
      const existingProduct =
        currentCart.find(
          (item) =>
            item.id === product.id
        )

      if (existingProduct) {
        const newQuantity =
          existingProduct.quantity +
          quantity

        if (
          newQuantity >
          product.stock
        ) {
          alert(
            `Only ${product.stock} items are available in stock.`
          )

          return currentCart
        }

        return currentCart.map(
          (item) =>
            item.id === product.id
              ? {
                  ...item,
                  quantity:
                    newQuantity,
                }
              : item
        )
      }

      if (
        quantity >
        product.stock
      ) {
        alert(
          `Only ${product.stock} items are available in stock.`
        )

        return currentCart
      }

      return [
        ...currentCart,
        {
          ...product,
          quantity,
        },
      ]
    })
  }

  // =====================================================
  // INCREASE QUANTITY
  // =====================================================

  const increaseQuantity = (id) => {
    setCart((currentCart) =>
      currentCart.map((item) => {
        if (item.id !== id) {
          return item
        }

        if (
          item.quantity >=
          item.stock
        ) {
          alert(
            `Only ${item.stock} items are available in stock.`
          )

          return item
        }

        return {
          ...item,
          quantity:
            item.quantity + 1,
        }
      })
    )
  }

  // =====================================================
  // DECREASE QUANTITY
  // =====================================================

  const decreaseQuantity = (id) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity:
                  item.quantity - 1,
              }
            : item
        )
        .filter(
          (item) =>
            item.quantity > 0
        )
    )
  }

  // =====================================================
  // REMOVE FROM CART
  // =====================================================

  const removeFromCart = (id) => {
    setCart((currentCart) =>
      currentCart.filter(
        (item) =>
          item.id !== id
      )
    )
  }

  // =====================================================
  // CART COUNT
  // =====================================================

  const cartCount = cart.reduce(
    (total, item) =>
      total + item.quantity,
    0
  )

  // =====================================================
  // CART TOTAL
  // =====================================================

  const cartTotal = cart.reduce(
    (total, item) =>
      total +
      item.price *
        item.quantity,
    0
  )

  // =====================================================
  // OPEN PRODUCT
  // =====================================================

  const openProduct = (
    product
  ) => {
    setSelectedProduct(
      product
    )

    setProductQuantity(1)
  }

  // =====================================================
  // CLOSE PRODUCT
  // =====================================================

  const closeProduct = () => {
    setSelectedProduct(null)

    setProductQuantity(1)
  }

  // =====================================================
  // ADD SELECTED PRODUCT
  // =====================================================

  const addSelectedProduct = () => {
    if (!selectedProduct) {
      return
    }

    if (
      selectedProduct.stock <=
      0
    ) {
      alert(
        "This product is out of stock."
      )

      return
    }

    if (
      productQuantity >
      selectedProduct.stock
    ) {
      alert(
        `Only ${selectedProduct.stock} items are available in stock.`
      )

      return
    }

    addToCart(
      selectedProduct,
      productQuantity
    )

    closeProduct()

    setCartOpen(true)
  }

  // =====================================================
  // SELECT CATEGORY
  // =====================================================

  const selectCategory = (
    category
  ) => {
    setSelectedCategory(
      category
    )

    setTimeout(() => {
      document
        .getElementById("shop")
        ?.scrollIntoView({
          behavior: "smooth",
        })
    }, 50)
  }

  // =====================================================
  // PLACE ORDER
  // =====================================================

  const placeOrder = async () => {
    const savedUser =
      localStorage.getItem(
        "trraUser"
      )

    if (!savedUser) {
      alert(
        "Please login before placing an order."
      )

      setCartOpen(false)

      setLoginOpen(true)

      return
    }

    if (cart.length === 0) {
      alert(
        "Your cart is empty."
      )

      return
    }

    try {
      const user =
        JSON.parse(
          savedUser
        )

      const orderItems =
        cart.map((item) => ({
          product_id:
            item.id,

          quantity:
            item.quantity,
        }))

      const response =
        await fetch(
          "http://localhost:5001/api/orders",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              customer_id:
                user.customer_id,

              items:
                orderItems,

              payment_mode:
                "Cash on Delivery",
            }),
          }
        )

      const data =
        await response.json()

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Order could not be placed"
        )
      }

      console.log(
        "Order created successfully:",
        data.order
      )

      setCart([])

      setCartOpen(false)

      setOrderPlaced(true)

      // Refresh products to get updated stock
      const productResponse =
        await fetch(
          "http://localhost:5001/api/products"
        )

      const productData =
        await productResponse.json()

      if (
        productData.success
      ) {
        const updatedProducts =
          productData.products.map(
            (product) => {
              let category =
                product.category

              if (
                product.product_name ===
                  "Sticker Pack" ||
                product.product_name ===
                  "Terminal Stickers"
              ) {
                category =
                  "Stickers"
              }

              return {
                id:
                  product.product_id,

                name:
                  product.product_name,

                category,

                price:
                  Number(
                    product.price
                  ),

                stock:
                  Number(
                    product.stock
                  ),

                image:
                  product.image_url ||
                  `https://placehold.co/600x600?text=${encodeURIComponent(
                    product.product_name
                  )}`,

                description:
                  `A premium ${String(
                    product.category
                  ).toLowerCase()} designed for developers and technology enthusiasts.`,
              }
            }
          )

        setProducts(
          updatedProducts
        )
      }
    } catch (error) {
      console.error(
        "Order error:",
        error
      )

      alert(
        error.message ||
          "Something went wrong while placing the order."
      )
    }
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">

        <div className="px-6 md:px-8 py-4">

          <div className="flex items-center justify-between">

            {/* LOGO */}

            <a
              href="#"
              className="flex items-center gap-3"
            >

              <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center text-lg font-black shadow-lg">

                Tr

                <span className="text-gray-400 mx-0.5">
                  &
                </span>

                Ra

              </div>

              <div className="leading-tight">

                <h1 className="text-xl md:text-2xl font-black">
                  Tr&Ra
                </h1>

                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500">
                  Merch Store
                </p>

              </div>

            </a>

            {/* DESKTOP NAVIGATION */}

            <div className="hidden md:flex items-center gap-8 text-sm font-medium">

              <a
                href="#"
                className="hover:text-gray-500 transition"
              >
                Home
              </a>

              <a
                href="#shop"
                className="hover:text-gray-500 transition"
              >
                Shop
              </a>

              <a
                href="#categories"
                className="hover:text-gray-500 transition"
              >
                Categories
              </a>

              <a
                href="#about"
                className="hover:text-gray-500 transition"
              >
                About
              </a>

            </div>

            {/* RIGHT SIDE */}

            <div className="flex items-center gap-3">

              <button
                onClick={() =>
                  setLoginOpen(
                    true
                  )
                }
                className="border border-gray-900 px-5 py-2.5 rounded-full font-medium hover:bg-black hover:text-white transition"
              >
                Login
              </button>

              <button
                onClick={() =>
                  setCartOpen(
                    true
                  )
                }
                className="border border-gray-900 px-5 py-2.5 rounded-full font-medium hover:bg-black hover:text-white transition"
              >
                Cart ({cartCount})
              </button>

              <button
                onClick={() =>
                  setMenuOpen(
                    !menuOpen
                  )
                }
                className="md:hidden text-2xl"
              >
                {menuOpen
                  ? "×"
                  : "☰"}
              </button>

            </div>

          </div>

          {/* MOBILE NAVIGATION */}

          {menuOpen && (
            <div className="md:hidden mt-5 pt-5 border-t flex flex-col gap-4">

              <a
                href="#"
                onClick={() =>
                  setMenuOpen(
                    false
                  )
                }
              >
                Home
              </a>

              <a
                href="#shop"
                onClick={() =>
                  setMenuOpen(
                    false
                  )
                }
              >
                Shop
              </a>

              <a
                href="#categories"
                onClick={() =>
                  setMenuOpen(
                    false
                  )
                }
              >
                Categories
              </a>

              <a
                href="#about"
                onClick={() =>
                  setMenuOpen(
                    false
                  )
                }
              >
                About
              </a>

              <button
                onClick={() => {
                  setLoginOpen(
                    true
                  )

                  setMenuOpen(
                    false
                  )
                }}
                className="text-left font-medium"
              >
                Login / Sign Up
              </button>

            </div>
          )}

        </div>

      </nav>

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="min-h-[80vh] flex items-center justify-center text-center px-6">

        <div className="max-w-4xl">

          <p className="text-sm uppercase tracking-[0.4em] text-gray-500 mb-6">
            Built for developers
          </p>

          <h2 className="text-6xl md:text-8xl font-black tracking-tight">

            CODE.

            <br />

            BUILD.

            <br />

            WEAR.

          </h2>

          <p className="mt-6 text-gray-500 max-w-xl mx-auto text-lg">
            Coding-inspired merchandise
            for developers, programmers
            and technology enthusiasts.
          </p>

          <a
            href="#shop"
            className="inline-block mt-8 bg-black text-white px-8 py-4 rounded-full font-medium hover:bg-gray-800 transition"
          >
            Explore Collection →
          </a>

        </div>

      </section>

      {/* =====================================================
          PRODUCTS
      ===================================================== */}

      <section
        id="shop"
        className="px-6 md:px-12 py-24 bg-gray-50"
      >

        <div className="max-w-7xl mx-auto">

          <div className="mb-12">

            <p className="text-sm uppercase tracking-[0.3em] text-gray-500">
              Our collection
            </p>

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">

              <h2 className="text-4xl md:text-5xl font-bold mt-3">
                {selectedCategory ===
                "All"
                  ? "Featured Products"
                  : selectedCategory}
              </h2>

              {selectedCategory !==
                "All" && (
                <button
                  onClick={() =>
                    setSelectedCategory(
                      "All"
                    )
                  }
                  className="border border-black px-5 py-2 rounded-full text-sm font-medium hover:bg-black hover:text-white transition"
                >
                  View All Products
                </button>
              )}

            </div>

          </div>

          {/* LOADING */}

          {loadingProducts && (
            <div className="py-20 text-center">

              <div className="text-5xl mb-5">
                🛍️
              </div>

              <p className="text-gray-500">
                Loading products...
              </p>

            </div>
          )}

          {/* ERROR */}

          {!loadingProducts &&
            productError && (
              <div className="py-20 text-center">

                <div className="text-5xl mb-5">
                  ⚠️
                </div>

                <h3 className="text-xl font-semibold">
                  Unable to load products
                </h3>

                <p className="text-gray-500 mt-2">
                  {productError}
                </p>

                <button
                  onClick={() =>
                    window.location.reload()
                  }
                  className="mt-6 bg-black text-white px-6 py-3 rounded-full"
                >
                  Try Again
                </button>

              </div>
            )}

          {/* PRODUCT GRID */}

          {!loadingProducts &&
            !productError &&
            filteredProducts.length >
              0 && (

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                {filteredProducts.map(
                  (product) => (

                    <div
                      key={
                        product.id
                      }
                      className="bg-white group"
                    >

                      {/* IMAGE */}

                      <button
                        onClick={() =>
                          openProduct(
                            product
                          )
                        }
                        className="w-full"
                      >

                        <div className="h-80 bg-gray-100 overflow-hidden flex items-center justify-center">

                          <img
                            src={
                              product.image
                            }
                            alt={
                              product.name
                            }
                            className="w-full h-full object-contain p-5 group-hover:scale-105 transition duration-300"
                          />

                        </div>

                      </button>

                      {/* PRODUCT INFO */}

                      <div className="p-5">

                        <p className="text-xs uppercase text-gray-500">
                          {
                            product.category
                          }
                        </p>

                        <h3 className="font-semibold text-lg mt-1">
                          {
                            product.name
                          }
                        </h3>

                        <p className="mt-2 font-medium">
                          ₹
                          {product.price.toLocaleString(
                            "en-IN"
                          )}
                        </p>

                        <p
                          className={`text-xs mt-2 ${
                            product.stock >
                            0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {product.stock >
                          0
                            ? `${product.stock} in stock`
                            : "Out of stock"}
                        </p>

                        <button
                          onClick={() =>
                            addToCart(
                              product
                            )
                          }
                          disabled={
                            product.stock <=
                            0
                          }
                          className={`mt-4 w-full text-white py-3 rounded-full transition ${
                            product.stock >
                            0
                              ? "bg-black hover:bg-gray-800"
                              : "bg-gray-400 cursor-not-allowed"
                          }`}
                        >
                          {product.stock >
                          0
                            ? "Add to Cart"
                            : "Out of Stock"}
                        </button>

                      </div>

                    </div>

                  )
                )}

              </div>
            )}

          {/* EMPTY CATEGORY */}

          {!loadingProducts &&
            !productError &&
            filteredProducts.length ===
              0 && (

              <div className="py-20 text-center">

                <div className="text-5xl mb-5">
                  📦
                </div>

                <h3 className="text-xl font-semibold">
                  No products found
                </h3>

              </div>
            )}

        </div>

      </section>

      {/* =====================================================
          CATEGORIES
      ===================================================== */}

      <section
        id="categories"
        className="px-6 md:px-12 py-24"
      >

        <div className="max-w-7xl mx-auto">

          <p className="text-sm uppercase tracking-[0.3em] text-gray-500">
            Shop by category
          </p>

          <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-12">
            Find Your Style
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

            {[
              [
                "👕",
                "Clothing",
                "Hoodies & T-Shirts",
              ],

              [
                "☕",
                "Accessories",
                "Mugs, Caps & More",
              ],

              [
                "📓",
                "Stationery",
                "Notebooks & Cards",
              ],

              [
                "✨",
                "Stickers",
                "Express Your Code",
              ],
            ].map(
              ([
                icon,
                title,
                subtitle,
              ]) => (

                <button
                  key={title}
                  onClick={() =>
                    selectCategory(
                      title
                    )
                  }
                  className={`text-left w-full p-8 h-64 flex flex-col justify-between transition ${
                    selectedCategory ===
                    title
                      ? "bg-black text-white"
                      : "bg-gray-100 hover:bg-black hover:text-white"
                  }`}
                >

                  <span className="text-5xl">
                    {icon}
                  </span>

                  <div>

                    <h3 className="text-2xl font-bold">
                      {title}
                    </h3>

                    <p className="text-sm mt-2 opacity-70">
                      {subtitle}
                    </p>

                  </div>

                </button>

              )
            )}

          </div>

          {/* ALL PRODUCTS */}

          <div className="text-center mt-8">

            <button
              onClick={() =>
                selectCategory(
                  "All"
                )
              }
              className={`px-6 py-3 rounded-full font-medium border transition ${
                selectedCategory ===
                "All"
                  ? "bg-black text-white border-black"
                  : "border-black hover:bg-black hover:text-white"
              }`}
            >
              View All Products
            </button>

          </div>

        </div>

      </section>

      {/* =====================================================
          ABOUT
      ===================================================== */}

      <section
        id="about"
        className="px-6 md:px-12 py-24 bg-gray-50"
      >

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16">

          <div>

            <p className="text-sm uppercase tracking-[0.3em] text-gray-500">
              About Tr&Ra
            </p>

            <h2 className="text-4xl md:text-5xl font-bold mt-4">
              Made for people who
              <br />
              live in code.
            </h2>

          </div>

          <div>

            <p className="text-lg text-gray-600 leading-relaxed">
              Tr&Ra Merch Store is a
              developer-focused merchandise
              store created for programmers,
              developers and technology
              enthusiasts.
            </p>

            <p className="text-lg text-gray-600 leading-relaxed mt-6">
              From coding-inspired hoodies
              and mugs to notebooks and
              accessories, Tr&Ra brings
              technology and style together.
            </p>

          </div>

        </div>

      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="bg-black text-white px-6 md:px-12 py-16">

        <div className="max-w-7xl mx-auto">

          <h2 className="text-3xl font-black">
            Tr&Ra Merch Store
          </h2>

          <p className="text-gray-400 mt-4">
            Coding-inspired merchandise
            for developers.
          </p>

          <div className="border-t border-gray-800 mt-12 pt-6 text-sm text-gray-500">
            © 2026 Tr&Ra Merch Store.
            All rights reserved.
          </div>

        </div>

      </footer>

      {/* =====================================================
          CART OVERLAY
      ===================================================== */}

      {cartOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/40"
          onClick={() =>
            setCartOpen(false)
          }
        />
      )}

      {/* =====================================================
          CART DRAWER
      ===================================================== */}

      <div
        className={`fixed top-0 right-0 z-[70] h-full w-full sm:w-[420px] bg-white shadow-2xl transition-transform duration-300 ${
          cartOpen
            ? "translate-x-0"
            : "translate-x-full"
        }`}
      >

        <div className="h-full flex flex-col">

          <div className="flex items-center justify-between p-6 border-b">

            <div>

              <h2 className="text-xl font-bold">
                Your Cart
              </h2>

              <p className="text-sm text-gray-500">
                {cartCount} item
                {cartCount !== 1
                  ? "s"
                  : ""}
              </p>

            </div>

            <button
              onClick={() =>
                setCartOpen(
                  false
                )
              }
              className="text-2xl hover:text-gray-500"
            >
              ×
            </button>

          </div>

          <div className="flex-1 overflow-y-auto p-6">

            {cart.length === 0 ? (

              <div className="h-full flex flex-col items-center justify-center text-center">

                <div className="text-6xl">
                  🛒
                </div>

                <h3 className="text-xl font-semibold mt-5">
                  Your cart is empty
                </h3>

                <p className="text-gray-500 mt-2">
                  Add some developer gear
                  to get started.
                </p>

                <button
                  onClick={() =>
                    setCartOpen(
                      false
                    )
                  }
                  className="mt-6 bg-black text-white px-6 py-3 rounded-full"
                >
                  Continue Shopping
                </button>

              </div>

            ) : (

              <div className="space-y-6">

                {cart.map(
                  (item) => (

                    <div
                      key={
                        item.id
                      }
                      className="flex gap-4 border-b pb-6"
                    >

                      <div className="w-20 h-20 bg-gray-100 shrink-0">

                        <img
                          src={
                            item.image
                          }
                          alt={
                            item.name
                          }
                          className="w-full h-full object-contain"
                        />

                      </div>

                      <div className="flex-1">

                        <div className="flex justify-between gap-3">

                          <h3 className="font-semibold">
                            {
                              item.name
                            }
                          </h3>

                          <button
                            onClick={() =>
                              removeFromCart(
                                item.id
                              )
                            }
                            className="text-gray-400 hover:text-black"
                          >
                            ×
                          </button>

                        </div>

                        <p className="text-sm text-gray-500 mt-1">
                          ₹
                          {item.price.toLocaleString(
                            "en-IN"
                          )}
                        </p>

                        <div className="flex justify-between items-center mt-4">

                          <div className="flex border rounded-full">

                            <button
                              onClick={() =>
                                decreaseQuantity(
                                  item.id
                                )
                              }
                              className="px-3 py-1 hover:bg-gray-100 rounded-l-full"
                            >
                              −
                            </button>

                            <span className="px-3 py-1">
                              {
                                item.quantity
                              }
                            </span>

                            <button
                              onClick={() =>
                                increaseQuantity(
                                  item.id
                                )
                              }
                              className="px-3 py-1 hover:bg-gray-100 rounded-r-full"
                            >
                              +
                            </button>

                          </div>

                          <strong>
                            ₹
                            {(
                              item.price *
                              item.quantity
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </strong>

                        </div>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

          </div>

          {cart.length > 0 && (

            <div className="border-t p-6">

              <div className="flex justify-between text-lg font-bold mb-5">

                <span>
                  Total
                </span>

                <span>
                  ₹
                  {cartTotal.toLocaleString(
                    "en-IN"
                  )}
                </span>

              </div>

              <button
                onClick={
                  placeOrder
                }
                className="w-full bg-black text-white py-4 rounded-full hover:bg-gray-800 transition font-semibold"
              >
                Place Order →
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Cash on Delivery •
                Secure checkout
              </p>

            </div>

          )}

        </div>

      </div>

      {/* =====================================================
          PRODUCT DETAILS MODAL
      ===================================================== */}

      {selectedProduct && (

        <div
          className="fixed inset-0 z-[80] bg-black/60 flex items-center justify-center p-4"
          onClick={
            closeProduct
          }
        >

          <div
            className="relative bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              onClick={
                closeProduct
              }
              className="absolute top-5 right-7 text-3xl hover:text-gray-500"
            >
              ×
            </button>

            <div className="grid md:grid-cols-2 gap-10">

              <div className="bg-gray-100 rounded-2xl h-[400px] flex items-center justify-center">

                <img
                  src={
                    selectedProduct.image
                  }
                  alt={
                    selectedProduct.name
                  }
                  className="w-full h-full object-contain p-8"
                />

              </div>

              <div className="flex flex-col justify-center">

                <p className="text-sm uppercase tracking-widest text-gray-500">
                  {
                    selectedProduct.category
                  }
                </p>

                <h2 className="text-4xl font-bold mt-3">
                  {
                    selectedProduct.name
                  }
                </h2>

                <p className="text-2xl font-bold mt-5">
                  ₹
                  {selectedProduct.price.toLocaleString(
                    "en-IN"
                  )}
                </p>

                <p className="text-gray-600 leading-relaxed mt-6">
                  {
                    selectedProduct.description
                  }
                </p>

                <p
                  className={`mt-5 font-medium ${
                    selectedProduct.stock >
                    0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {selectedProduct.stock >
                  0
                    ? `${selectedProduct.stock} items available`
                    : "Out of stock"}
                </p>

                {selectedProduct.stock >
                  0 && (

                  <div className="mt-8">

                    <p className="font-semibold mb-3">
                      Quantity
                    </p>

                    <div className="flex items-center border rounded-full w-fit">

                      <button
                        onClick={() =>
                          setProductQuantity(
                            Math.max(
                              1,
                              productQuantity -
                                1
                            )
                          )
                        }
                        className="px-5 py-3 hover:bg-gray-100 rounded-l-full"
                      >
                        −
                      </button>

                      <span className="px-5">
                        {
                          productQuantity
                        }
                      </span>

                      <button
                        onClick={() =>
                          setProductQuantity(
                            Math.min(
                              selectedProduct.stock,
                              productQuantity +
                                1
                            )
                          )
                        }
                        className="px-5 py-3 hover:bg-gray-100 rounded-r-full"
                      >
                        +
                      </button>

                    </div>

                  </div>
                )}

                {selectedProduct.stock >
                  0 && (

                  <div className="flex justify-between border-t mt-8 pt-5">

                    <span>
                      Total
                    </span>

                    <strong>
                      ₹
                      {(
                        selectedProduct.price *
                        productQuantity
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </strong>

                  </div>
                )}

                <button
                  onClick={
                    addSelectedProduct
                  }
                  disabled={
                    selectedProduct.stock <=
                    0
                  }
                  className={`w-full text-white py-4 rounded-full mt-6 font-semibold transition ${
                    selectedProduct.stock >
                    0
                      ? "bg-black hover:bg-gray-800"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  {selectedProduct.stock >
                  0
                    ? "Add to Cart"
                    : "Out of Stock"}
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

      {/* =====================================================
          ORDER SUCCESS
      ===================================================== */}

      {orderPlaced && (

        <div className="fixed inset-0 z-[90] bg-black/50 flex items-center justify-center p-4">

          <div className="bg-white rounded-3xl p-10 text-center max-w-md w-full">

            <div className="text-6xl">
              🎉
            </div>

            <h2 className="text-3xl font-bold mt-5">
              Order Placed!
            </h2>

            <p className="text-gray-500 mt-4">
              Thank you for shopping with
              Tr&Ra Merch Store.
            </p>

            <button
              onClick={() =>
                setOrderPlaced(
                  false
                )
              }
              className="w-full bg-black text-white py-4 rounded-full mt-8 hover:bg-gray-800 transition"
            >
              Continue Shopping
            </button>

          </div>

        </div>

      )}

      {/* =====================================================
          LOGIN
      ===================================================== */}

      {loginOpen && (

        <Login
          onClose={() =>
            setLoginOpen(
              false
            )
          }
        />

      )}

    </div>
  )
}

export default App