import { useState } from "react"

function Login({ onClose }) {
  const [isSignup, setIsSignup] = useState(false)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [city, setCity] = useState("")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError("")
    setSuccess("")
    setLoading(true)

    try {
      const endpoint = isSignup
        ? "http://localhost:5001/api/register"
        : "http://localhost:5001/api/login"

      const body = isSignup
        ? {
            name,
            email,
            password,
            city,
          }
        : {
            email,
            password,
          }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Something went wrong"
        )
      }

      // ================= SIGNUP SUCCESS =================

      if (isSignup) {
        setSuccess(
          "Account created successfully! You can now login."
        )

        setName("")
        setEmail("")
        setPassword("")
        setCity("")

        setTimeout(() => {
          setIsSignup(false)
          setSuccess("")
        }, 1500)

        return
      }

      // ================= LOGIN SUCCESS =================

      localStorage.setItem(
        "trraUser",
        JSON.stringify(data.user)
      )

      setSuccess(
        `Welcome back, ${data.user.name}!`
      )

      setTimeout(() => {
        onClose()
        window.location.reload()
      }, 1000)

    } catch (error) {
      console.error("Authentication error:", error)

      setError(
        error.message ||
          "Unable to connect to the server."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4">

      <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto">

        {/* CLOSE BUTTON */}

        <button
          onClick={onClose}
          className="absolute top-5 right-6 text-2xl text-gray-500 hover:text-black"
        >
          ×
        </button>


        {/* LOGO */}

        <div className="text-center mb-8">

          <div className="w-16 h-16 bg-black text-white rounded-2xl mx-auto flex items-center justify-center text-xl font-black shadow-lg">
            Tr&Ra
          </div>

          <h2 className="text-3xl font-bold mt-5">
            Tr&Ra
          </h2>

          <p className="text-xs uppercase tracking-[0.25em] text-gray-500 mt-1">
            Merch Store
          </p>

          <p className="text-gray-500 mt-4">
            {isSignup
              ? "Create your account"
              : "Welcome back, developer"}
          </p>

        </div>


        {/* ERROR MESSAGE */}

        {error && (

          <div className="mb-5 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
            {error}
          </div>

        )}


        {/* SUCCESS MESSAGE */}

        {success && (

          <div className="mb-5 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm">
            {success}
          </div>

        )}


        {/* FORM */}

        <form onSubmit={handleSubmit}>

          {/* NAME */}

          {isSignup && (

            <div className="mb-5">

              <label className="block text-sm font-medium mb-2">
                Full Name
              </label>

              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-black"
              />

            </div>

          )}


          {/* EMAIL */}

          <div className="mb-5">

            <label className="block text-sm font-medium mb-2">
              Email Address
            </label>

            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-black"
            />

          </div>


          {/* PASSWORD */}

          <div className="mb-5">

            <label className="block text-sm font-medium mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
              minLength="6"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-black"
            />

          </div>


          {/* CITY */}

          {isSignup && (

            <div className="mb-6">

              <label className="block text-sm font-medium mb-2">
                City
              </label>

              <input
                type="text"
                placeholder="Enter your city"
                value={city}
                onChange={(e) =>
                  setCity(e.target.value)
                }
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-black"
              />

            </div>

          )}


          {/* SUBMIT */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading
              ? "Please wait..."
              : isSignup
              ? "Create Account"
              : "Login"}
          </button>

        </form>


        {/* SWITCH LOGIN / SIGNUP */}

        <div className="text-center mt-6 text-sm text-gray-500">

          {isSignup
            ? "Already have an account?"
            : "Don't have an account?"}

          <button
            onClick={() => {
              setIsSignup(!isSignup)
              setError("")
              setSuccess("")
            }}
            className="ml-2 font-semibold text-black hover:underline"
          >
            {isSignup
              ? "Login"
              : "Create Account"}
          </button>

        </div>

      </div>

    </div>
  )
}

export default Login