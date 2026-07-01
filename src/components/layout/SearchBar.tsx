"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { getCategoryName, getProductBasePrice } from "@/lib/catalog";
import { formatPrice } from "@/lib/currency";
import { getCategories } from "@/lib/data";
import { searchProducts } from "@/lib/search";

interface SearchBarProps {
  className?: string;
  onNavigate?: () => void;
}

export function SearchBar({ className = "", onNavigate }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const categories = useMemo(() => getCategories(), []);

  const results = useMemo(() => searchProducts(query), [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = () => {
    setQuery("");
    setOpen(false);
    onNavigate?.();
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <svg
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Buscar productos, SKU..."
          className="h-10 w-full rounded-lg border border-border bg-white py-2 pl-10 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-accent/40 focus:ring-2 focus:ring-accent/10"
          aria-label="Buscar productos"
          aria-expanded={open && query.length > 0}
          aria-autocomplete="list"
        />
      </div>

      {open && query.trim().length > 0 && (
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-[80] overflow-hidden rounded-xl border border-border bg-white shadow-2xl">
          {results.length > 0 ? (
            <ul className="max-h-80 overflow-y-auto py-2">
              {results.map((product) => (
                <li key={product.id}>
                  <Link
                    href={`/productos/${product.slug}`}
                    onClick={handleSelect}
                    className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-surface-elevated"
                  >
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md border border-border bg-surface-elevated">
                      <Image
                        src={product.images[0]}
                        alt=""
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {product.name}
                      </p>
                      <p className="text-xs text-muted">
                        {getCategoryName(product.categoryId, categories)} ·{" "}
                        {formatPrice(getProductBasePrice(product))}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-6 text-center text-sm text-muted">
              No se encontraron productos para &ldquo;{query}&rdquo;
            </p>
          )}
        </div>
      )}
    </div>
  );
}
