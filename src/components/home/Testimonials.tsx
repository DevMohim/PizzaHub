// src/components/home/Testimonials.tsx
import TestimonialsContent, {
  type Testimonial,
} from "@/components/TestimonialsContent";

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Ordered a pepperoni for the family on Friday night and it showed up still steaming. The order status updated the whole way, so no guessing when to set the table.",
    name: "Ayesha Rahman",
    meta: "Customer · Dhaka",
    initials: "AR",
    avatarClassName: "bg-primary/15 text-primary",
  },
  {
    quote:
      "I love that every item I see has already been approved. I've never clicked on something that turned out to be missing or out of date — the menu just works.",
    name: "Tanvir Hasan",
    meta: "Customer · Chattogram",
    initials: "TH",
    avatarClassName: "bg-accent text-accent-foreground",
  },
  {
    quote:
      "Placing the order took under a minute: pick the pizza, add the address, choose the delivery date. I cancelled one pending order and it went through instantly.",
    name: "Sadia Islam",
    meta: "Customer · Sylhet",
    initials: "SI",
    avatarClassName: "bg-primary/15 text-primary",
  },
  {
    quote:
      "The category and location filters made finding a proper vegetarian pizza genuinely easy. Ended up ordering from a small place two streets away.",
    name: "Rakib Hossain",
    meta: "Customer · Dhaka",
    initials: "RH",
    avatarClassName: "bg-accent text-accent-foreground",
  },
  {
    quote:
      "My dashboard shows every order with its status and delivery date in one list. As someone who orders lunch at work constantly, that's the feature I needed.",
    name: "Nusrat Jahan",
    meta: "Customer · Khulna",
    initials: "NJ",
    avatarClassName: "bg-primary/15 text-primary",
  },
  {
    quote:
      "Support replied about a delivery question the same evening, and the vendor had already accepted the order. Small touches, but that's why I keep coming back.",
    name: "Imran Kabir",
    meta: "Customer · Rajshahi",
    initials: "IK",
    avatarClassName: "bg-accent text-accent-foreground",
  },
];

const Testimonials = () => {
  return <TestimonialsContent testimonials={TESTIMONIALS} />;
};

export default Testimonials;
