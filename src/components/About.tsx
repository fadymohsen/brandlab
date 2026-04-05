import { Target, Zap, Heart, Award } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Precision",
    description: "Every frame is intentional. Every cut tells a story.",
  },
  {
    icon: Zap,
    title: "Speed",
    description: "Fast turnaround without compromising quality.",
  },
  {
    icon: Heart,
    title: "Passion",
    description: "We pour creativity into every project we touch.",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "We don't stop until your vision exceeds expectations.",
  },
];

export default function About() {
  return (
    <section id="about" className="py-24 lg:py-32 relative bg-dark-light/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Content */}
          <div>
            <span className="text-sm font-semibold text-primary uppercase tracking-widest">
              About Us
            </span>
            <h2 className="mt-4 text-4xl lg:text-5xl font-bold text-cream leading-tight">
              We Bring Your{" "}
              <span className="gradient-text">Vision to Life</span>
            </h2>
            <p className="mt-6 text-cream/60 text-lg leading-relaxed">
              Brand Lab was born from a passion for visual storytelling. We
              believe every brand has a unique story — and the right video can
              make the world listen. Our team of skilled editors and creative
              minds work hand-in-hand with startups, freelancers, and content
              creators to produce videos that don&apos;t just look great — they
              deliver results.
            </p>
            <p className="mt-4 text-cream/60 text-lg leading-relaxed">
              Whether it&apos;s a 15-second reel or a full brand film, we
              approach every project with the same dedication to craft and
              precision.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <a
                href="#contact"
                className="px-8 py-4 bg-gradient-to-r from-primary to-secondary rounded-full text-base font-semibold text-white hover:opacity-90 transition-opacity text-center"
              >
                Work With Us
              </a>
              <a
                href="#portfolio"
                className="px-8 py-4 rounded-full border border-cream/20 text-base font-medium text-cream hover:bg-cream/5 transition-colors text-center"
              >
                See Our Work
              </a>
            </div>
          </div>

          {/* Right - Values */}
          <div className="grid grid-cols-2 gap-6">
            {values.map((value, index) => (
              <div
                key={value.title}
                className={`gradient-border p-6 ${
                  index % 2 === 1 ? "mt-8" : ""
                }`}
              >
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4">
                    <value.icon size={24} className="text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-cream mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-cream/50">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
