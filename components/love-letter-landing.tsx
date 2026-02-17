"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

const LETTER_PARAGRAPHS = [
  {
    text: `Sometimes I look at you and wonder how much pain you carry that no one else sees. You smile, you laugh, you show strength — but I know there are quiet battles inside you that you fight alone. And the fact that you still wake up every day and keep going… that is a kind of bravery most people will never understand.`,
  },
  {
    text: `If I could take even a small part of your pain and carry it for you, I would. If I could give your heart one day of complete rest, I would choose that over anything. Because it hurts to see someone who gives so much love to others feel so tired inside.`,
  },
  {
    text: `I want you to know something you might forget on your hardest days: you are not alone. You never have been. You don't have to pretend to be strong with me. You are allowed to be tired. You are allowed to cry. You are allowed to fall apart. And when you do, I will still be here. I won't leave. I won't get tired of you. Loving you is not only for your bright days — it is for your darkest nights too.`,
  },
  {
    text: `I am proud of you in ways you don't even realize. Proud of the way you keep standing when life pushes you down. Proud that your heart is still gentle in a world that tries to harden people. Proud that after everything you've been through, you still choose kindness. That is rare. That is beautiful. That is you.`,
  },
  {
    text: `Please don't measure your life by your struggles. You are bigger than your fears. Stronger than your doubts. And your future is brighter than the sadness you feel right now. Every tear you cried is proof that you cared deeply. Every scar is proof that you survived. And surviving is not weakness — it is strength.`,
  },
  {
    text: `And if one day you feel like you can't carry the weight anymore… rest in my love. You don't always have to be the strong one. You can lean on me. You can cry in my arms. Here, you are safe. Here, you are understood. Here, you are loved exactly as you are.`,
  },
  {
    text: `Chumchum, I don't love you because you are perfect. I love you because you are real. Because your heart is honest. Because your soul is soft. And no matter what comes, I will keep choosing you — every day, in every version of life.`,
  },
]

function FloatingWord({ delay, duration, left }: { delay: number; duration: number; left: number }) {
  return (
    <span
      className="absolute text-border/60 text-xs tracking-widest select-none pointer-events-none whitespace-nowrap font-sans"
      style={{
        left: `${left}%`,
        animation: `floatUp ${duration}s ease-in-out ${delay}s infinite`,
        opacity: 0,
      }}
    >
      I love you Guia
    </span>
  )
}

export default function LoveLetterLanding() {
  const [isVisible, setIsVisible] = useState(false)
  const [revealedParagraphs, setRevealedParagraphs] = useState<number[]>([])

  useEffect(() => {
    setIsVisible(true)

    // Reveal paragraphs one by one
    LETTER_PARAGRAPHS.forEach((_, index) => {
      setTimeout(() => {
        setRevealedParagraphs((prev) => [...prev, index])
      }, 800 + index * 400)
    })
  }, [])

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Floating text background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {Array.from({ length: 12 }).map((_, i) => (
          <FloatingWord
            key={i}
            delay={i * 2.5}
            duration={18 + (i % 4) * 3}
            left={5 + (i * 8) % 90}
          />
        ))}
      </div>

      {/* Decorative top line */}
      <div className="w-full flex justify-center pt-8">
        <div
          className="h-px bg-border transition-all duration-[2000ms] ease-out"
          style={{ width: isVisible ? "120px" : "0px" }}
        />
      </div>

      {/* Main content */}
      <main className="relative z-10 flex flex-col items-center px-6 pb-20">
        {/* Title section */}
        <section
          className="mt-12 md:mt-20 text-center transition-all duration-1000 ease-out"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(30px)",
          }}
        >
          <p className="text-xs text-muted-foreground uppercase tracking-[0.3em] mb-6 font-sans">
            A Letter Written From The Heart
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-sans font-semibold text-foreground tracking-tight text-balance leading-tight">
            For Chumchum
          </h1>
          <div className="mt-6 flex justify-center">
            <div
              className="h-px bg-accent transition-all duration-[2500ms] ease-out delay-500"
              style={{ width: isVisible ? "80px" : "0px" }}
            />
          </div>
        </section>

        {/* Greeting */}
        <section
          className="mt-14 md:mt-20 w-full max-w-2xl transition-all duration-1000 ease-out delay-300"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(20px)",
          }}
        >
          <p className="text-xl md:text-2xl text-foreground font-sans italic text-center">
            Chumchum,
          </p>
        </section>

        {/* Letter paragraphs */}
        <section className="mt-10 w-full max-w-2xl flex flex-col gap-8">
          {LETTER_PARAGRAPHS.map((para, index) => (
            <p
              key={index}
              className="text-base md:text-lg leading-relaxed text-foreground/85 transition-all duration-700 ease-out"
              style={{
                fontFamily: "var(--font-body), 'Lora', 'Georgia', serif",
                opacity: revealedParagraphs.includes(index) ? 1 : 0,
                transform: revealedParagraphs.includes(index)
                  ? "translateY(0)"
                  : "translateY(16px)",
              }}
            >
              {para.text}
            </p>
          ))}
        </section>

        {/* Closing */}
        <section
          className="mt-12 w-full max-w-2xl text-right transition-all duration-700 ease-out"
          style={{
            opacity: revealedParagraphs.length >= LETTER_PARAGRAPHS.length ? 1 : 0,
            transform:
              revealedParagraphs.length >= LETTER_PARAGRAPHS.length
                ? "translateY(0)"
                : "translateY(16px)",
          }}
        >
          <p className="text-xl md:text-2xl font-sans italic text-foreground">
            Always.
          </p>
        </section>

        {/* Divider */}
        <div className="mt-16 md:mt-24 flex flex-col items-center gap-4">
          <div
            className="w-px h-16 bg-border transition-all duration-[2000ms] ease-out"
            style={{
              opacity: revealedParagraphs.length >= LETTER_PARAGRAPHS.length ? 1 : 0,
            }}
          />
          <div
            className="w-1.5 h-1.5 rounded-full bg-accent transition-all duration-[2000ms] ease-out"
            style={{
              opacity: revealedParagraphs.length >= LETTER_PARAGRAPHS.length ? 1 : 0,
            }}
          />
        </div>

        {/* CTA Section */}
        <section
          className="mt-12 flex flex-col items-center text-center transition-all duration-700 ease-out"
          style={{
            opacity: revealedParagraphs.length >= LETTER_PARAGRAPHS.length ? 1 : 0,
            transform:
              revealedParagraphs.length >= LETTER_PARAGRAPHS.length
                ? "translateY(0)"
                : "translateY(20px)",
          }}
        >
          <p className="text-sm text-muted-foreground tracking-widest uppercase mb-3 font-sans">
            A Special Gift
          </p>
          <h2 className="text-2xl md:text-3xl font-sans font-medium text-foreground text-balance">
            Your Portrait, Made of Love
          </h2>
          <p
            className="mt-4 text-base text-muted-foreground max-w-md"
            style={{ fontFamily: "var(--font-body), 'Lora', 'Georgia', serif" }}
          >
            Every line, every shadow, every detail of your face — drawn entirely from the
            words {'"'}I love you Guia.{'"'}
          </p>

          <Link
            href="/portrait"
            className="mt-8 group relative inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground text-sm uppercase tracking-[0.2em] font-sans hover:opacity-90 transition-all duration-300"
          >
            <span>See Your Portrait</span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </section>

        {/* Footer */}
        <footer className="mt-20 md:mt-28 text-center">
          <p className="text-xs text-muted-foreground/60 tracking-widest uppercase font-sans">
            With all my love, always
          </p>
        </footer>
      </main>

      <style jsx>{`
        @keyframes floatUp {
          0% {
            transform: translateY(100vh);
            opacity: 0;
          }
          10% {
            opacity: 0.15;
          }
          90% {
            opacity: 0.15;
          }
          100% {
            transform: translateY(-20vh);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
