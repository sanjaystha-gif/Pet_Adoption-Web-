import RegisterForm from "../_components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <RegisterForm />
    </div>
  );
}
