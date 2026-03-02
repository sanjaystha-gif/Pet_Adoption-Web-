"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../schema";
import { z } from "zod";

import { FaGoogle, FaFacebook } from "react-icons/fa";

// Define the type for the form inputs
type LoginFormInputs = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormInputs) => {
    console.log("Login Data:", data);
    window.location.href = "/auth/dashboard"; // dummy redirect
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-80">
      <div>
        <label className="block text-sm font-medium mb-1">Full Name</label>
        <input {...register("email")} placeholder="Full Name" className="border p-2 w-full rounded placeholder-gray-500" />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <div className="relative">
          <input {...register("password")} type="password" placeholder="Password" className="border p-2 w-full rounded placeholder-gray-500" />
          <span className="absolute right-2 top-2 cursor-pointer">👁️</span>
        </div>
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" id="keepLoggedIn" className="cursor-pointer" />
        <label htmlFor="keepLoggedIn" className="text-sm">Keep me logged in</label>
      </div>

      <button type="submit" className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition">Log In</button>

      <p className="text-center text-sm mt-4">Or Sign Up with</p>
      <div className="flex justify-center gap-4 mt-2">
        <button type="button" className="flex items-center gap-2 border p-2 rounded hover:bg-gray-100 transition">
          <FaGoogle /> Google
        </button>
        <button type="button" className="flex items-center gap-2 border p-2 rounded hover:bg-gray-100 transition">
          <FaFacebook /> Facebook
        </button>
      </div>

      <p className="text-center text-sm mt-4">
        <a href="/auth/forgot-password" className="text-blue-600 hover:underline">Forgot Password?</a>
      </p>
    </form>
  );
}
