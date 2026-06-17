"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import type { Product } from "@/models/product.model";

interface ProductCarouselProps {
  products: Product[];
}

export default function ProductCarousel({ products }: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const CARD_WIDTH = 304; // 280px (width) + 24px (gap)

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      
      // Update arrow states (with some margin of error for subpixel rendering)
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

      // Determine active indicator dot
      const index = Math.round(scrollLeft / CARD_WIDTH);
      setActiveIndex(Math.max(0, Math.min(index, products.length - 1)));
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.addEventListener("scroll", checkScroll, { passive: true });
      // Run once initially to set starting state
      checkScroll();
      
      // Also run when window resizes to update canScrollRight
      window.addEventListener("resize", checkScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", checkScroll);
      }
      window.removeEventListener("resize", checkScroll);
    };
  }, [products]);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const scrollAmount = direction === "left" ? -CARD_WIDTH : CARD_WIDTH;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const scrollToCard = (index: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: index * CARD_WIDTH,
        behavior: "smooth",
      });
    }
  };

  if (!products || products.length === 0) return null;

  return (
    <div className="relative group/carousel w-full">
      {/* Scroll Viewport Container */}
      <div
        ref={scrollRef}
        className="
          flex
          gap-6
          overflow-x-auto
          pb-6
          pt-2
          scroll-smooth
          snap-x
          snap-mandatory
          /* Hide scrollbar for Chrome, Safari, Opera, Firefox and IE/Edge */
          [&::-webkit-scrollbar]:hidden
          [-ms-overflow-style:none]
          [scrollbar-width:none]
        "
      >
        {products.map((product, index) => (
          <div
            key={product.id}
            className="
              min-w-[280px]
              max-w-[280px]
              flex-shrink-0
              snap-start
            "
          >
            <ProductCard
              id={product.id}
              title={product.title}
              price={product.price}
              discountedPrice={product.discountedPrice}
              discountPersent={product.discountPersent}
              image={product.imageUrl}
              description={product.description}
            />
          </div>
        ))}
      </div>

      {/* Left Navigation Button */}
      <button
        onClick={() => handleScroll("left")}
        disabled={!canScrollLeft}
        className={`
          absolute
          left-0
          top-1/2
          -translate-y-1/2
          -translate-x-1/2
          z-10
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-full
          border
          border-border
          bg-surface/80
          text-foreground-bright
          backdrop-blur-md
          shadow-lg
          transition-all
          duration-300
          hover:bg-primary
          hover:text-btn-primary-text
          hover:scale-110
          active:scale-95
          disabled:opacity-0
          disabled:pointer-events-none
          opacity-0
          group-hover/carousel:opacity-100
          focus:opacity-100
          focus:outline-none
          focus:ring-2
          focus:ring-primary/50
        `}
        aria-label="Anterior producto"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      {/* Right Navigation Button */}
      <button
        onClick={() => handleScroll("right")}
        disabled={!canScrollRight}
        className={`
          absolute
          right-0
          top-1/2
          -translate-y-1/2
          translate-x-1/2
          z-10
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-full
          border
          border-border
          bg-surface/80
          text-foreground-bright
          backdrop-blur-md
          shadow-lg
          transition-all
          duration-300
          hover:bg-primary
          hover:text-btn-primary-text
          hover:scale-110
          active:scale-95
          disabled:opacity-0
          disabled:pointer-events-none
          opacity-0
          group-hover/carousel:opacity-100
          focus:opacity-100
          focus:outline-none
          focus:ring-2
          focus:ring-primary/50
        `}
        aria-label="Siguiente producto"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Progress Indicator Dots */}
      <div className="mt-4 flex justify-center gap-2">
        {products.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToCard(index)}
            className={`
              h-2
              rounded-full
              transition-all
              duration-300
              focus:outline-none
              focus:ring-2
              focus:ring-primary/50
              ${
                activeIndex === index
                  ? "w-8 bg-primary"
                  : "w-2 bg-foreground-muted/30 hover:bg-foreground-muted/60"
              }
            `}
            aria-label={`Ir al producto ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
