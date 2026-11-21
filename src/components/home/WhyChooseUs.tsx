// src/components/home/WhyChooseUs.tsx
import WhyChooseUsContent, { type BenefitData } from '@/components/WhyChooseUsContent';

const BENEFITS: BenefitData[] = [
  {
    iconName: "Flame",
    title: "Fresh from real kitchens",
    description:
      "Every pizza is prepared to order by local pizzerias — no reheated slices and no frozen shortcuts.",
  },
  {
    iconName: "BadgeCheck",
    title: "A menu you can trust",
    description:
      "Dishes are reviewed and approved by our team before they appear, so what you see is what you get.",
  },
  {
    iconName: "Route",
    title: "Track every order",
    description:
      "Follow your order from pending to accepted in your dashboard — clear statuses instead of guesswork.",
  },
  {
    iconName: "MapPinned",
    title: "Local spots, not chains",
    description:
      "Browse independent restaurants by location and keep your spending inside the neighbourhood.",
  },
  {
    iconName: "ShieldCheck",
    title: "Cancel while it's pending",
    description:
      "Changed your mind? Cancel your own pending order in one tap before the kitchen starts cooking.",
  },
  {
    iconName: "ChefHat",
    title: "Vendors who care",
    description:
      "Premium partners earn a featured spot, so the best-reviewed kitchens rise to the top of the menu.",
  },
];

const PROMISES = [
  "Only approved, active menu items",
  "Transparent prices and order statuses",
  "Customer, vendor and admin roles secured server-side",
];

const WhyChooseUs = () => {
  return <WhyChooseUsContent benefits={BENEFITS} promises={PROMISES} />;
};

export default WhyChooseUs;