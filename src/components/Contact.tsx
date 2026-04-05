"use client";

import { Mail, Phone, MapPin, Send, ArrowRight } from "lucide-react";

export default function Contact() {
  return (
    <section id="contact" className="py-24 lg:py-32 relative bg-dark-light/30">
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-widest">
            Get In Touch
          </span>
          <h2 className="mt-4 text-4xl lg:text-5xl font-bold text-cream">
            Let&apos;s Create{" "}
            <span className="gradient-text">Something Amazing</span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-cream/50 text-lg">
            Ready to elevate your content? Drop us a message and let&apos;s
            bring your vision to life.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shrink-0">
                <Mail size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-cream">Email Us</h3>
                <p className="text-cream/50 mt-1">hello@brandlab.studio</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shrink-0">
                <Phone size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-cream">Call Us</h3>
                <p className="text-cream/50 mt-1">+1 (555) 123-4567</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shrink-0">
                <MapPin size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-cream">Location</h3>
                <p className="text-cream/50 mt-1">
                  Available worldwide — we work remotely with clients across the
                  globe.
                </p>
              </div>
            </div>

            {/* CTA Box */}
            <div className="gradient-border p-6 mt-8">
              <div className="relative z-10">
                <h3 className="font-semibold text-cream mb-2">
                  Quick Response Guarantee
                </h3>
                <p className="text-sm text-cream/50">
                  We respond to every inquiry within 24 hours. Your project
                  matters to us.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <form
              onSubmit={(e) => e.preventDefault()}
              className="gradient-border p-8"
            >
              <div className="relative z-10 space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-cream/70 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream placeholder:text-cream/30 focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-cream/70 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream placeholder:text-cream/30 focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-cream/70 mb-2">
                    Project Type
                  </label>
                  <select className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream/70 focus:outline-none focus:border-primary/50 transition-colors">
                    <option value="" className="bg-dark">
                      Select a service
                    </option>
                    <option value="editing" className="bg-dark">
                      Video Editing
                    </option>
                    <option value="montage" className="bg-dark">
                      Montage & Reels
                    </option>
                    <option value="color" className="bg-dark">
                      Color Grading
                    </option>
                    <option value="motion" className="bg-dark">
                      Motion Graphics
                    </option>
                    <option value="sound" className="bg-dark">
                      Sound Design
                    </option>
                    <option value="brand" className="bg-dark">
                      Brand Identity Video
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-cream/70 mb-2">
                    Tell Us About Your Project
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Describe your project, goals, timeline, and any specific requirements..."
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream placeholder:text-cream/30 focus:outline-none focus:border-primary/50 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-secondary rounded-xl text-base font-semibold text-white hover:opacity-90 transition-opacity"
                >
                  <Send size={18} />
                  Send Message
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
