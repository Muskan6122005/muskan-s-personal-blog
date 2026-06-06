import { useEffect, useRef } from "react"
import { WebGLHero } from "./components/WebGLHero"
import { HorizonHeroSection } from "./components/ui/horizon-hero-section"
import { ProjectShowcase } from "./components/ProjectShowcase"
import { JourneySection } from "./components/JourneySection"
import { Navbar } from "./components/Navbar"
import { ConnectWithMe } from "./components/ui/connect-with-me"





function App() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const followerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 1. Custom Cursor Movement
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`
        cursorRef.current.style.top = `${e.clientY}px`
      }
      if (followerRef.current) {
        const follower = followerRef.current
        setTimeout(() => {
          follower.style.left = `${e.clientX}px`
          follower.style.top = `${e.clientY}px`
        }, 80)
      }
    }
    document.addEventListener("mousemove", handleMouseMove)

    // 2. Hover Expansion on Cursors
    const addHoverClass = () => {
      followerRef.current?.classList.add("cursor-hovering")
    }
    const removeHoverClass = () => {
      followerRef.current?.classList.remove("cursor-hovering")
    }

    const updateCursorListeners = () => {
      const interactives = document.querySelectorAll("a, button, .crazy-card, .webgl-hero-img-box")
      interactives.forEach((el) => {
        el.addEventListener("mouseenter", addHoverClass)
        el.addEventListener("mouseleave", removeHoverClass)
      })
    }
    updateCursorListeners()

    // 3. Card Glow tracking
    const handleCardGlow = (e: MouseEvent) => {
      const cards = document.querySelectorAll(".crazy-card")
      cards.forEach((card) => {
        const htmlCard = card as HTMLElement
        const rect = htmlCard.getBoundingClientRect()
        htmlCard.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`)
        htmlCard.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`)
      })
    }
    document.addEventListener("mousemove", handleCardGlow)

    // 4. Magnetic Hover Effect
    const handleMagneticMove = function (this: HTMLElement, e: MouseEvent) {
      const rect = this.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      this.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`
    }
    const handleMagneticLeave = function (this: HTMLElement) {
      this.style.transform = "translate(0px, 0px)"
    }
    const magneticElements = document.querySelectorAll(".magnetic")
    magneticElements.forEach((el) => {
      el.addEventListener("mousemove", handleMagneticMove as any)
      el.addEventListener("mouseleave", handleMagneticLeave as any)
    })

    // 5. Scroll Reveal Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-active")
          }
        })
      },
      { threshold: 0.15 }
    )
    const reveals = document.querySelectorAll(".reveal")
    reveals.forEach((el) => observer.observe(el))

    // Cleanup listeners
    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mousemove", handleCardGlow)
      magneticElements.forEach((el) => {
        el.removeEventListener("mousemove", handleMagneticMove as any)
        el.removeEventListener("mouseleave", handleMagneticLeave as any)
      })
      const interactives = document.querySelectorAll("a, button, .crazy-card, .webgl-hero-img-box")
      interactives.forEach((el) => {
        el.removeEventListener("mouseenter", addHoverClass)
        el.removeEventListener("mouseleave", removeHoverClass)
      })
      observer.disconnect()
    }
  }, [])

  return (
    <>
      {/* Ambient glowing blobs */}
      <div className="ambient-glow glow-1"></div>
      <div className="ambient-glow glow-2"></div>

      {/* Custom Neon Cursor */}
      <div ref={cursorRef} className="custom-cursor"></div>
      <div ref={followerRef} className="custom-cursor-follower"></div>

      {/* Navigation */}
      <Navbar />

      {/* Interactive WebGL Shader Hero Section */}
      <WebGLHero />

      {/* Three.js space horizon section for About, Education, and Skills */}
      <HorizonHeroSection />

      {/* Projects Section */}
      <ProjectShowcase />

      {/* Journey Section (Experience & Certifications) */}
      <JourneySection />

      {/* Contact Section */}
      <ConnectWithMe
        id="contact"
        className="reveal border-t border-dashed border-zinc-800"
      />
    </>
  )
}

export default App
