import { Play, ExternalLink } from "lucide-react";

const projects = [
  {
    title: "Elevate Fitness Campaign",
    category: "Brand Film",
    description:
      "A high-energy brand film for a fitness startup that boosted their social engagement by 300%.",
    gradient: "from-primary to-secondary",
  },
  {
    title: "Chef's Table Series",
    category: "Content Series",
    description:
      "A 10-episode culinary series for a food influencer, reaching 2M+ views across platforms.",
    gradient: "from-secondary to-accent",
  },
  {
    title: "TechFlow Product Launch",
    category: "Product Video",
    description:
      "Cinematic product reveal video for a SaaS startup that drove 150% increase in sign-ups.",
    gradient: "from-accent to-primary",
  },
  {
    title: "Wanderlust Travel Reels",
    category: "Social Media Reels",
    description:
      "A collection of viral travel reels for a content creator, amassing 5M+ combined views.",
    gradient: "from-primary via-secondary to-accent",
  },
  {
    title: "Nova Fashion Lookbook",
    category: "Fashion Video",
    description:
      "A sleek fashion lookbook video that captured the brand's luxury aesthetic perfectly.",
    gradient: "from-secondary to-primary",
  },
  {
    title: "Startup Pitch Deck Video",
    category: "Corporate Video",
    description:
      "A compelling pitch video that helped a startup secure $2M in seed funding.",
    gradient: "from-accent via-secondary to-primary",
  },
];

export default function Portfolio() {
  return (
    <section id="portfolio" className="py-24 lg:py-32 relative">
      <div className="absolute inset-0">
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-widest">
            Our Work
          </span>
          <h2 className="mt-4 text-4xl lg:text-5xl font-bold text-cream">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-cream/50 text-lg">
            A showcase of our finest work. Every project is a story brought to
            life.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.title}
              className="group relative overflow-hidden rounded-2xl cursor-pointer"
            >
              {/* Placeholder Visual */}
              <div
                className={`aspect-video bg-gradient-to-br ${project.gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-500`}
              />

              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform border border-white/20">
                  <Play
                    size={24}
                    className="text-white fill-white ml-1"
                  />
                </div>
              </div>

              {/* Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-dark via-dark/80 to-transparent">
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                  {project.category}
                </span>
                <h3 className="text-lg font-semibold text-cream mt-1">
                  {project.title}
                </h3>
                <p className="text-sm text-cream/50 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {project.description}
                </p>
              </div>

              {/* External Link */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                  <ExternalLink size={16} className="text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
