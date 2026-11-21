// src/components/CategorySection.tsx  (বা তোমার আগের ফাইল)
import { MENU_CATEGORIES } from "@/config/menuCategories";
import CategoryGrid from "@/components/CategoryGrid";

const CategorySection = () => {
  return <CategoryGrid categories={MENU_CATEGORIES} />;
};

export default CategorySection;
