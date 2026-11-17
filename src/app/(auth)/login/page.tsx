import type { Metadata } from "next";
import AuthCard from "@/components/auth/AuthCard";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign In | PizzaHub",
  description:
    "Sign in to PizzaHub to order fresh pizza from local pizzerias, track your orders, or manage your vendor menu.",
  keywords: [
    "PizzaHub",
    "sign in",
    "login",
    "pizza delivery",
    "vendor dashboard",
    "order pizza online",
  ],
  alternates: {
    canonical: "/login",
  },
  openGraph: {
    title: "Sign In | PizzaHub",
    description:
      "Sign in to PizzaHub to order fresh pizza or manage your vendor menu.",
    type: "website",
    url: "/login",
  },
};

const LoginPage = () => {
  return (
    <AuthCard
      title="Welcome back"
      description="Sign in to your PizzaHub account."
      footerText="New to PizzaHub?"
      footerLinkLabel="Create an account"
      footerLinkHref="/register"
    >
      <LoginForm />
    </AuthCard>
  );
};

export default LoginPage;
