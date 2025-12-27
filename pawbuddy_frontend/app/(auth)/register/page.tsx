import RegisterForm from "../_components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="flex w-4/5 h-4/5 shadow-lg rounded-lg overflow-hidden">
        {/* Left Section */}
        <div className="flex flex-col items-center justify-center w-1/2 bg-red-50">
          <h1 className="text-5xl font-bold">
            <span style={{ color: '#FF8C7F' }}>Paw</span>
            <span style={{ color: '#990000' }}>Buddy</span>
          </h1>
          <h2 className="text-3xl font-bold text-red-600 mt-4">Register Now</h2>
          <div className="mt-2 text-center">
            <span className="text-2xl">🐾</span>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex flex-col items-center justify-center w-1/2 bg-white">
          <h2 className="text-3xl font-bold text-red-600 mb-6">Create your account</h2>
          <form className="flex flex-col gap-4 w-80">
            <input
              type="text"
              placeholder="Full Name"
              className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-700"
              style={{ color: '#606060' }}
            />
            <input
              type="email"
              placeholder="E-mail"
              className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-700"
              style={{ color: '#606060' }}
            />
            <input
              type="password"
              placeholder="Password"
              className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-700"
              style={{ color: '#606060' }}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-700"
              style={{ color: '#606060' }}
            />
            <div className="flex items-center">
              <input type="checkbox" className="form-checkbox text-red-500" />
              <span className="ml-2 text-gray-700">
                I agree to all <a href="#" className="text-red-500 underline">Terms & Conditions</a>
              </span>
            </div>
            <button
              type="submit"
              className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Create Account
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-gray-700">Or Sign Up with</p>
            <div className="flex justify-center mt-2">
              <button className="mx-2 bg-gray-200 p-2 rounded-full hover:bg-gray-300">
                <span className="text-blue-500">G</span>
              </button>
              <button className="mx-2 bg-gray-200 p-2 rounded-full hover:bg-gray-300">
                <span className="text-blue-700">F</span>
              </button>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-gray-700">
              Already have an account? <a href="/login" className="text-red-500 underline">Sign in</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
