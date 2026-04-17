"use client";

import { useState, useEffect } from "react";
import { Star, Quote } from "lucide-react";
import { useDictionary } from "@/i18n/dictionary-provider";
import { RevealOnScroll, Marquee } from "./animations";

interface TestimonialItem {
  name: string;
  role: string;
  content: string;
  rating?: number;
}

function TestimonialCard({ testimonial }: { testimonial: TestimonialItem }) {
  return (
    <div dir="ltr" className="gradient-border p-8 w-[400px] shrink-0 text-left">
      <div className="relative z-10">
        <Quote size={32} className="text-primary/30 mb-4" />
        <div className="flex gap-1 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={16}
              className={
                i < (testimonial.rating ?? 5)
                  ? "text-accent fill-accent"
                  : "text-cream/20"
              }
            />
          ))}
        </div>
        <p dir="auto" className="text-cream/70 leading-relaxed mb-6">
          &ldquo;{testimonial.content}&rdquo;
        </p>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold text-lg">
            {testimonial.name[0]}
          </div>
          <div dir="auto">
            <div className="font-semibold text-cream">{testimonial.name}</div>
            <div className="text-sm text-cream/70">{testimonial.role}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const dict = useDictionary();
  const [items, setItems] = useState<TestimonialItem[]>(dict.testimonials.items);

  useEffect(() => {
    fetch("/api/testimonials")
      .then((res) => res.json())
      .then((data) => {
        if (data.items && data.items.length > 0) {
          setItems(
            data.items.map((t: { name: string; role: string; content: string; rating: number }) => ({
              name: t.name,
              role: t.role,
              content: t.content,
              rating: t.rating,
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section
      id="testimonials"
      className="py-24 lg:py-32 relative bg-dark-light/30 overflow-hidden"
    >
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10">
        <RevealOnScroll className="text-center mb-16 px-6">
          <span className="text-sm font-semibold text-primary uppercase tracking-widest">
            {dict.testimonials.label}
          </span>
          <h2 className="mt-4 text-4xl lg:text-5xl font-bold text-cream">
            {dict.testimonials.title}{" "}
            <span className="gradient-text">
              {dict.testimonials.titleHighlight}
            </span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-cream/70 text-lg">
            {dict.testimonials.subtitle}
          </p>
        </RevealOnScroll>

        <Marquee speed={40}>
          {items.map((testimonial) => (
            <TestimonialCard
              key={testimonial.name}
              testimonial={testimonial}
            />
          ))}
        </Marquee>
      </div>
    </section>
  );
}
