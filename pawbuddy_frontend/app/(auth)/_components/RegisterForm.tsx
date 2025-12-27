"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../schema";
import { z } from "zod";

type RegisterFormInputs = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormInputs) => {
    console.log("Register Data:", data);
    window.location.href = "/login"; // dummy redirect
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 w-80">
      <div>
        <input {...register("name")} placeholder="Full Name" className="border p-2 w-full rounded" />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>

      <div>
        <input {...register("email")} placeholder="Email" className="border p-2 w-full rounded" />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>

      <div>
        <input {...register("password")} type="password" placeholder="Password" className="border p-2 w-full rounded" />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
      </div>

      <div>
        <input {...register("confirmPassword")} type="password" placeholder="Confirm Password" className="border p-2 w-full rounded" />
        {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
      </div>

      <button type="submit" className="text-white p-2 rounded" style={{ backgroundColor: '#FF6F61' }}>Register</button>
    </form>
  );
}
