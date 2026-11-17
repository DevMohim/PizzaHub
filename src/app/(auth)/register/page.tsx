import type { Metadata } from "next";
import AuthCard from "@/components/auth/AuthCard";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Create Account | PizzaHub",
  description:
    "Join PizzaHub for free. Register as a customer to order fresh pizza from local pizzerias, or as a vendor to sell your menu online.",
  keywords: [
    "PizzaHub",
    "sign up",
    "register",
    "pizza delivery",
    "vendor account",
    "order pizza online",
  ],
  alternates: {
    canonical: "/register",
  },
  openGraph: {
    title: "Create Account | PizzaHub",
    description:
      "Join PizzaHub for free. Register as a customer or vendor and get started in seconds.",
    type: "website",
    url: "/register",
  },
};

const RegisterPage = () => {
  return (
    <AuthCard
      title="Create your account"
      description="Join PizzaHub as a customer or vendor — it's free."
      footerText="Already have an account?"
      footerLinkLabel="Sign In"
      footerLinkHref="/login"
    >
      <RegisterForm />
    </AuthCard>
  );
};

export default RegisterPage;
