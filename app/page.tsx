import { GlassmorphismNav } from "@/components/glassmorphism-nav"
import { HeroSection } from "@/components/hero-section"
import { CoursesSection } from "@/components/courses-section"
import { MentorsSection } from "@/components/mentors-section"
import { FeedbackSection } from "@/components/feedback-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black overflow-hidden">
      <main className="min-h-screen relative overflow-hidden">
        <div className="relative z-10">
          <GlassmorphismNav />
          <HeroSection />
          <CoursesSection />
          <MentorsSection />
          <FeedbackSection />
          <Footer />
        </div>
      </main>
    </div>
  )
}
