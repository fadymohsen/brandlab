"use client";

import Navbar from "@/components/Navbar";
import JoinUs from "@/components/JoinUs";
import Footer from "@/components/Footer";

export default function JoinUsPage() {
  return (
    <>
      <Navbar />
      <div className="pt-20">
        <JoinUs />
      </div>
      <Footer />
    </>
  );
}
