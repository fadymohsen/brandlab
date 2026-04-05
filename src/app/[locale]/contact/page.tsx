"use client";

import Navbar from "@/components/Navbar";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <div className="pt-20">
        <Contact />
      </div>
      <Footer />
    </>
  );
}
