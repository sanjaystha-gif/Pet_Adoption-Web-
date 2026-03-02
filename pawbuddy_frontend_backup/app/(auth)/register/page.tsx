"use client";

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
          <h2 className="text-3xl font-bold text-rose-600 mb-6">Create your account</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
}
