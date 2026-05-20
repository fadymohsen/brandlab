import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import BookCall from "@/components/BookCall";
import About from "@/components/About";
import Portfolio from "@/components/Portfolio";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import DesignPricing from "@/components/DesignPricing";
import Contact from "@/components/Contact";
import JoinTeamCTA from "@/components/JoinTeamCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Services />
      <BookCall />
      <About />
      <Portfolio />
      <Testimonials />
      <Pricing />
      <DesignPricing />
      <Contact />
      <JoinTeamCTA />
      <Footer />
    </>
  );
}
