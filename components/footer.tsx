"use client"
import type React from "react"
import type { ComponentProps, ReactNode } from "react"
import { motion, useReducedMotion } from "framer-motion"

interface FooterLink {
  title: string
  href: string
}

interface FooterSection {
  label: string
  links: FooterLink[]
}

const footerLinks: FooterSection[] = [
  {
    label: "Services",
    links: [
      { title: "Courses", href: "#courses" },
      { title: "Mentorship", href: "#mentors" },
      { title: "Dashboard", href: "#dashboard" },
    ],
  },
  {
    label: "Contact",
    links: [
      { title: "Email: hamzahikma9@gmail.com", href: "mailto:hamzahikma9@gmail.com" },
      { title: "Phone: +250794414171", href: "tel:+250794414171" },
    ],
  },
]

function DSHLogo() {
  return (
    <div className="relative w-16 h-16 flex items-center justify-center">
      <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-yellow-400 to-amber-500 rounded-lg transform -rotate-45">
        <span className="font-bold text-white text-xl relative z-10">DSH</span>
      </div>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="md:rounded-t-6xl relative w-full max-w-6xl mx-auto flex flex-col items-center justify-center rounded-t-4xl border-t bg-[radial-gradient(35%_128px_at_50%_0%,theme(backgroundColor.white/8%),transparent)] px-6 py-12 lg:py-16">
      <div className="bg-foreground/20 absolute top-0 right-1/2 left-1/2 h-px w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full blur" />

      <div className="grid w-full gap-8 xl:grid-cols-3 xl:gap-8">
        <AnimatedContainer className="space-y-4">
          <DSHLogo />
          <div className="text-muted-foreground mt-8 text-sm md:mt-0 md:block hidden">
            <p>© {new Date().getFullYear()} Digital Skills Hub. All rights reserved.</p>
          </div>
        </AnimatedContainer>

        <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-2 xl:col-span-2 xl:mt-0">
          {footerLinks.map((section, index) => (
            <AnimatedContainer key={section.label} delay={0.1 + index * 0.1}>
              <div className="mb-10 md:mb-0">
                <h3 className="text-xs font-semibold text-white">{section.label}</h3>
                <ul className="text-muted-foreground mt-4 space-y-2 text-sm">
                  {section.links.map((link) => (
                    <li key={link.title}>
                      <a href={link.href} className="hover:text-foreground inline-flex items-center transition-all duration-300">
                        {link.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedContainer>
          ))}
        </div>
      </div>

      <div className="md:hidden mt-8 text-center space-y-2">
        <p className="text-muted-foreground text-sm">© {new Date().getFullYear()} Digital Skills Hub. All rights reserved.</p>
        <p className="text-muted-foreground text-xs">Developed by Hikma Hamza</p>
      </div>

      <div className="hidden md:block mt-8 pt-6 border-t border-foreground/10 w-full">
        <p className="text-muted-foreground text-xs text-center">Developed by Hikma Hamza</p>
      </div>
    </footer>
  )
}

type ViewAnimationProps = {
  delay?: number
  className?: ComponentProps<typeof motion.div>["className"]
  children: ReactNode
}

function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return children
  }

  return (
    <motion.div
      initial={{ filter: "blur(4px)", translateY: -8, opacity: 0 }}
      whileInView={{ filter: "blur(0px)", translateY: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
