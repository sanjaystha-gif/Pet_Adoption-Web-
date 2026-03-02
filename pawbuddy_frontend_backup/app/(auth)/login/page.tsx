import LoginForm from "../_components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex flex-row h-screen">
      {/* Left Section */}
      <div className="flex flex-col justify-center items-center w-1/2 bg-gray-100">
        <h1 className="text-3xl font-bold mb-6">Log In to PawBuddy</h1>
        <LoginForm />
        <p className="mt-4 text-sm">
          Don’t have an account?{" "}
          <a href="/auth/register" className="text-blue-600">
            Sign up
          </a>
        </p>
      </div>

      {/* Right Section */}
      <div className="flex justify-center items-center w-1/2 bg-red-100">
        <img
          src="/images/kitten-login.png"
          alt="Kitten holding login sign"
          className="max-w-full h-auto"
        />
      </div>
    </div>
  );
}
