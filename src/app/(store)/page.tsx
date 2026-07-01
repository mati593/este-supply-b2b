import { CategoryGrid } from "@/components/landing/CategoryGrid";
import { HeroSection } from "@/components/landing/HeroSection";
import { ValueProposition } from "@/components/landing/ValueProposition";
import { getFeaturedCategories } from "@/lib/data";

export default function HomePage() {
  const categories = getFeaturedCategories();

  return (
    <>
      <HeroSection />
      <CategoryGrid categories={categories} />
      <ValueProposition />
    </>
  );
}
