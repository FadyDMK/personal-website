import { useRef, useState, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Github,
  Linkedin,
  Mail,
  FileText,
  Send,
  MessageSquare,
  ExternalLink,
} from "lucide-react";
import SectionParticles from "../SectionParticles/SectionsParticles";

gsap.registerPlugin(ScrollTrigger);

type FormState = {
  name: string;
  email: string;
  message: string;
};

type FormErrors = {
  name?: string;
  email?: string;
  message?: string;
};

function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const socialsRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<FormState>({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  // GSAP animations
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".contact-heading",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom-=100",
          },
        }
      );

      // Animate form fields
      gsap.fromTo(
        ".form-element",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.8,
          scrollTrigger: {
            trigger: formRef.current,
            start: "top bottom-=50",
          },
        }
      );

      // Animate social icons
      gsap.fromTo(
        ".social-item",
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          stagger: 0.1,
          duration: 0.8,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: socialsRef.current,
            start: "top bottom-=50",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Form handling
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user types
    if (errors[name as keyof FormErrors]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {

      await fetch('https://formspree.io/f/xnnvakwo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })


      // Success path
      setSubmitStatus("success");
      setFormData({ name: "", email: "", message: "" });

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus("idle");
      }, 5000);
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="py-24 px-4 bg-secondary/10 relative"
    >
      <SectionParticles
        color="#0047AB"
        count={100}
        size={0.3}
        opacity={0.2}
        zIndex={-5}
      />

      <div className="max-w-6xl mx-auto">
        <h2 className="contact-heading text-4xl md:text-5xl font-bold text-center mb-16">
          Get In Touch
        </h2>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="form-container bg-black/40 backdrop-blur-sm p-6 md:p-8 rounded-lg border border-blue-900/30 shadow-lg">
            <h3 className="text-2xl font-semibold mb-6 text-white form-element">
              Send Me a Message
            </h3>

            <form ref={formRef} onSubmit={handleSubmit}>
              <div className="mb-6 form-element">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-1 text-blue-100"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-md bg-blue-900/20 border ${
                    errors.name ? "border-red-500" : "border-blue-700/50"
                  } text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Your name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-400">{errors.name}</p>
                )}
              </div>

              <div className="mb-6 form-element">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-1 text-blue-100"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-md bg-blue-900/20 border ${
                    errors.email ? "border-red-500" : "border-blue-700/50"
                  } text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="your.email@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                )}
              </div>

              <div className="mb-6 form-element">
                <label
                  htmlFor="message"
                  className="block text-sm font-medium mb-1 text-blue-100"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className={`w-full px-4 py-2 rounded-md bg-blue-900/20 border ${
                    errors.message ? "border-red-500" : "border-blue-700/50"
                  } text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Your message..."
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-400">{errors.message}</p>
                )}
              </div>

              <div className="form-element">
                <Button
                  type="submit"
                  className="w-full py-6 bg-blue-700 hover:bg-blue-600 text-white font-medium flex items-center justify-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Send Message
                    </>
                  )}
                </Button>

                {submitStatus === "success" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 bg-green-900/30 border border-green-500/30 text-green-300 rounded-md flex items-center gap-2"
                  >
                    <MessageSquare size={16} />
                    Thank you! Your message has been sent.
                  </motion.div>
                )}

                {submitStatus === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 bg-red-900/30 border border-red-500/30 text-red-300 rounded-md flex items-center gap-2"
                  >
                    <MessageSquare size={16} />
                    Something went wrong. Please try again.
                  </motion.div>
                )}
              </div>
            </form>
          </div>

          {/* Resume & Socials */}
          <div className="flex flex-col gap-8">
            <div className="resume-container bg-black/40 backdrop-blur-sm p-6 md:p-8 rounded-lg border border-blue-900/30 shadow-lg form-element">
              <h3 className="text-2xl font-semibold mb-6 text-white">Resume</h3>

              <p className="text-blue-100 mb-6">
                Download my resume to learn more about my experience, education,
                and skills.
              </p>

              <a
                className="flex items-center gap-2 text-blue-300 hover:text-blue-100 transition-colors"
                href="https://drive.google.com/file/d/16yu21BUIu0-om1OO3rV_BhfjQk_Feybs/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FileText size={18} />
                Download Resume
              </a>
            </div>

            <div
              ref={socialsRef}
              className="socials-container bg-black/40 backdrop-blur-sm p-6 md:p-8 rounded-lg border border-blue-900/30 shadow-lg form-element"
            >
              <h3 className="text-2xl font-semibold mb-6 text-white">
                Connect With Me
              </h3>

              <div className="grid grid-cols-1 gap-4">
                <a
                  href="https://github.com/FadyDMK"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-item flex items-center gap-4 p-3 rounded-md bg-blue-900/20 border border-blue-700/50 hover:bg-blue-800/30 transition-colors"
                >
                  <div className="bg-blue-800 p-2 rounded-full">
                    <Github size={20} className="text-white" />
                  </div>
                  <span className="text-blue-100">GitHub</span>
                  <ExternalLink size={16} className="ml-auto text-blue-300" />
                </a>

                <a
                  href="https://www.linkedin.com/in/fady-damak/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-item flex items-center gap-4 p-3 rounded-md bg-blue-900/20 border border-blue-700/50 hover:bg-blue-800/30 transition-colors"
                >
                  <div className="bg-blue-800 p-2 rounded-full">
                    <Linkedin size={20} className="text-white" />
                  </div>
                  <span className="text-blue-100">LinkedIn</span>
                  <ExternalLink size={16} className="ml-auto text-blue-300" />
                </a>

                <a
                  href="mailto:fady.damak@gmail.com"
                  className="social-item flex items-center gap-4 p-3 rounded-md bg-blue-900/20 border border-blue-700/50 hover:bg-blue-800/30 transition-colors"
                >
                  <div className="bg-blue-800 p-2 rounded-full">
                    <Mail size={20} className="text-white" />
                  </div>
                  <span className="text-blue-100">Email</span>
                  <ExternalLink size={16} className="ml-auto text-blue-300" />
                </a>
              </div>
            </div>

            <div className="additional-info form-element">
              <p className="text-blue-100/70">
                Based in Pécs, Hungary. Open to remote work and relocation
                opportunities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
