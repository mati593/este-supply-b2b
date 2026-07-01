import { CategoryCard } from "@/components/landing/CategoryCard";
import { FadeIn } from "@/components/ui/FadeIn";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import type { Category } from "@/types";

interface CategoryGridProps {
  categories: Category[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section id="categorias" className="bg-surface py-20 sm:py-28">
      <Container>
        <FadeIn className="mx-auto mb-14 max-w-2xl text-center">
          <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-wider text-accent">
            Catálogo mayorista
          </span>
          <h2 className="mb-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Categorías destacadas
          </h2>
          <p className="text-base leading-relaxed text-muted">
            Explore nuestro inventario por segmento. Cada categoría incluye
            precios escalonados por volumen, especificaciones técnicas y stock
            actualizado.
          </p>
        </FadeIn>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <CategoryCard
              key={category.id}
              category={category}
              index={index}
            />
          ))}
        </div>

        <FadeIn className="mt-12 text-center" delay={0.2}>
          <Button href="/productos" variant="secondary" size="lg">
            Ver catálogo completo
          </Button>
        </FadeIn>
      </Container>
    </section>
  );
}
