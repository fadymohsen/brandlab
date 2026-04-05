import {
  Film,
  Scissors,
  Palette,
  Monitor,
  Music,
  Sparkles,
} from "lucide-react";

const services = [
  {
    icon: Film,
    title: "Video Editing",
    description:
      "Professional editing that transforms raw footage into polished, engaging content ready to captivate your audience.",
  },
  {
    icon: Scissors,
    title: "Montage & Reels",
    description:
      "Dynamic montages and short-form reels optimized for social media platforms to maximize reach and engagement.",
  },
  {
    icon: Palette,
    title: "Color Grading",
    description:
      "Cinematic color grading that sets the mood, enhances storytelling, and gives your videos a signature look.",
  },
  {
    icon: Monitor,
    title: "Motion Graphics",
    description:
      "Eye-catching animations, lower thirds, intros, and transitions that elevate your brand's visual identity.",
  },
  {
    icon: Music,
    title: "Sound Design",
    description:
      "Professional audio mixing, sound effects, and music selection that bring your visuals to life.",
  },
  {
    icon: Sparkles,
    title: "Brand Identity Videos",
    description:
      "Crafted brand films and promotional videos that communicate your story and values with impact.",
  },
];

export default function Services() {
  return (
    <section id="services" className="py-24 lg:py-32 relative">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-widest">
            What We Do
          </span>
          <h2 className="mt-4 text-4xl lg:text-5xl font-bold text-cream">
            Our <span className="gradient-text">Services</span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-cream/50 text-lg">
            From concept to final cut, we offer end-to-end video production
            services tailored to your brand.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.title}
              className="group gradient-border p-8 hover:scale-[1.02] transition-all duration-300"
            >
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <service.icon size={28} className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-cream mb-3">
                  {service.title}
                </h3>
                <p className="text-cream/50 leading-relaxed">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
