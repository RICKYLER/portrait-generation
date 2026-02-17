"use client"

import { useEffect, useRef, useState, useCallback } from "react"

const PHRASE = "I love you Guia "

export default function TypographicPortrait() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [fontSize, setFontSize] = useState(4)
  const [contrast, setContrast] = useState(1.4)
  const [isRendering, setIsRendering] = useState(false)

  const renderPortrait = useCallback(
    (customFontSize?: number, customContrast?: number) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      setIsRendering(true)
      setProgress(0)

      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        const targetWidth = 900
        const scale = targetWidth / img.width
        const targetHeight = Math.floor(img.height * scale)

        canvas.width = targetWidth
        canvas.height = targetHeight

        // Draw image to get pixel data
        const offscreen = document.createElement("canvas")
        offscreen.width = targetWidth
        offscreen.height = targetHeight
        const offCtx = offscreen.getContext("2d")!
        offCtx.drawImage(img, 0, 0, targetWidth, targetHeight)
        const imageData = offCtx.getImageData(0, 0, targetWidth, targetHeight)
        const pixels = imageData.data

        // Clear canvas with white
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, targetWidth, targetHeight)

        const currentFontSize = customFontSize ?? fontSize
        const currentContrast = customContrast ?? contrast
        const lineHeight = currentFontSize + 1
        ctx.font = `${currentFontSize}px 'Georgia', 'Times New Roman', serif`
        ctx.textBaseline = "top"

        let charIndex = 0
        const totalRows = Math.ceil(targetHeight / lineHeight)
        let rowsDone = 0

        // Process rows in batches for smooth rendering
        const batchSize = 8
        let currentY = 0

        const processBatch = () => {
          const batchEnd = Math.min(currentY + batchSize * lineHeight, targetHeight)

          while (currentY < batchEnd) {
            let x = 0
            while (x < targetWidth) {
              const char = PHRASE[charIndex % PHRASE.length]
              charIndex++

              // Sample pixel brightness at this position
              const sampleX = Math.min(Math.floor(x + currentFontSize / 2), targetWidth - 1)
              const sampleY = Math.min(Math.floor(currentY + lineHeight / 2), targetHeight - 1)
              const pixelIndex = (sampleY * targetWidth + sampleX) * 4

              const r = pixels[pixelIndex]
              const g = pixels[pixelIndex + 1]
              const b = pixels[pixelIndex + 2]

              // Convert to grayscale (luminance formula)
              const gray = 0.299 * r + 0.587 * g + 0.114 * b

              // Apply contrast curve - darker areas get more opaque text
              let brightness = gray / 255
              // Apply contrast enhancement
              brightness = Math.pow(brightness, currentContrast)

              // Invert: dark areas in photo = dark text (high opacity)
              const opacity = 1 - brightness

              // Skip very light areas for cleaner look
              if (opacity < 0.03) {
                const charWidth = ctx.measureText(char).width
                x += charWidth
                continue
              }

              // Use black text with varying opacity
              ctx.fillStyle = `rgba(20, 15, 15, ${Math.min(opacity * 1.2, 1)})`
              ctx.fillText(char, x, currentY)

              const charWidth = ctx.measureText(char).width
              x += charWidth
            }

            currentY += lineHeight
            rowsDone++
          }

          setProgress(Math.min(Math.floor((rowsDone / totalRows) * 100), 100))

          if (currentY < targetHeight) {
            requestAnimationFrame(processBatch)
          } else {
            setIsLoading(false)
            setIsRendering(false)
            setProgress(100)
          }
        }

        processBatch()
      }

      img.onerror = () => {
        setIsLoading(false)
        setIsRendering(false)
      }

      img.src = "/images/reference.png"
    },
    [fontSize, contrast]
  )

  useEffect(() => {
    renderPortrait()
  }, [renderPortrait])

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement("a")
    link.download = "i-love-you-guia-portrait.png"
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  const handleDownloadHD = () => {
    // Render at higher resolution for download
    const canvas = canvasRef.current
    if (!canvas) return

    const hdCanvas = document.createElement("canvas")
    const hdCtx = hdCanvas.getContext("2d")!

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      const targetWidth = 1800
      const scale = targetWidth / img.width
      const targetHeight = Math.floor(img.height * scale)

      hdCanvas.width = targetWidth
      hdCanvas.height = targetHeight

      const offscreen = document.createElement("canvas")
      offscreen.width = targetWidth
      offscreen.height = targetHeight
      const offCtx = offscreen.getContext("2d")!
      offCtx.drawImage(img, 0, 0, targetWidth, targetHeight)
      const imageData = offCtx.getImageData(0, 0, targetWidth, targetHeight)
      const pixels = imageData.data

      hdCtx.fillStyle = "#ffffff"
      hdCtx.fillRect(0, 0, targetWidth, targetHeight)

      const hdFontSize = fontSize * 2
      const lineHeight = hdFontSize + 2
      hdCtx.font = `${hdFontSize}px 'Georgia', 'Times New Roman', serif`
      hdCtx.textBaseline = "top"

      let charIndex = 0
      let y = 0

      while (y < targetHeight) {
        let x = 0
        while (x < targetWidth) {
          const char = PHRASE[charIndex % PHRASE.length]
          charIndex++

          const sampleX = Math.min(Math.floor(x + hdFontSize / 2), targetWidth - 1)
          const sampleY = Math.min(Math.floor(y + lineHeight / 2), targetHeight - 1)
          const pixelIndex = (sampleY * targetWidth + sampleX) * 4

          const r = pixels[pixelIndex]
          const g = pixels[pixelIndex + 1]
          const b = pixels[pixelIndex + 2]
          const gray = 0.299 * r + 0.587 * g + 0.114 * b
          let brightness = gray / 255
          brightness = Math.pow(brightness, contrast)
          const opacity = 1 - brightness

          if (opacity < 0.03) {
            const charWidth = hdCtx.measureText(char).width
            x += charWidth
            continue
          }

          hdCtx.fillStyle = `rgba(20, 15, 15, ${Math.min(opacity * 1.2, 1)})`
          hdCtx.fillText(char, x, y)

          const charWidth = hdCtx.measureText(char).width
          x += charWidth
        }
        y += lineHeight
      }

      const link = document.createElement("a")
      link.download = "i-love-you-guia-portrait-HD.png"
      link.href = hdCanvas.toDataURL("image/png")
      link.click()
    }
    img.src = "/images/reference.png"
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#faf8f5]">
      {/* Header */}
      <header className="w-full py-8 text-center">
        <h1
          className="text-3xl md:text-4xl tracking-wide text-[#2a2320]"
          style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
        >
          I Love You, Guia
        </h1>
        <p className="text-sm text-[#8a7e74] mt-2 tracking-widest uppercase" style={{ fontFamily: "'Georgia', serif" }}>
          A Portrait Made of Words
        </p>
      </header>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-center gap-6 mb-6 px-4">
        <div className="flex items-center gap-3">
          <label className="text-xs text-[#8a7e74] uppercase tracking-wider" style={{ fontFamily: "'Georgia', serif" }}>
            Text Size
          </label>
          <input
            type="range"
            min="2"
            max="8"
            step="0.5"
            value={fontSize}
            onChange={(e) => {
              setFontSize(Number(e.target.value))
            }}
            className="w-28 accent-[#2a2320]"
          />
          <span className="text-xs text-[#5a4e44] w-6 tabular-nums">{fontSize}</span>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs text-[#8a7e74] uppercase tracking-wider" style={{ fontFamily: "'Georgia', serif" }}>
            Contrast
          </label>
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.1"
            value={contrast}
            onChange={(e) => {
              setContrast(Number(e.target.value))
            }}
            className="w-28 accent-[#2a2320]"
          />
          <span className="text-xs text-[#5a4e44] w-8 tabular-nums">{contrast.toFixed(1)}</span>
        </div>

        <button
          onClick={() => renderPortrait()}
          disabled={isRendering}
          className="px-5 py-2 text-xs uppercase tracking-wider bg-[#2a2320] text-[#faf8f5] hover:bg-[#3d3430] transition-colors disabled:opacity-50"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          {isRendering ? "Rendering..." : "Regenerate"}
        </button>
      </div>

      {/* Loading state */}
      {(isLoading || isRendering) && (
        <div className="flex flex-col items-center gap-3 mb-4">
          <div className="w-64 h-1.5 bg-[#e8e2da] overflow-hidden">
            <div
              className="h-full bg-[#2a2320] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-[#8a7e74]" style={{ fontFamily: "'Georgia', serif" }}>
            Writing love into every pixel... {progress}%
          </p>
        </div>
      )}

      {/* Canvas */}
      <div className="relative shadow-2xl border border-[#e8e2da] bg-[#ffffff]">
        <canvas
          ref={canvasRef}
          className="block max-w-full h-auto"
          style={{ maxHeight: "75vh" }}
        />
      </div>

      {/* Download buttons */}
      {!isLoading && !isRendering && (
        <div className="flex gap-4 mt-6 mb-10">
          <button
            onClick={handleDownload}
            className="px-6 py-2.5 text-xs uppercase tracking-wider border border-[#2a2320] text-[#2a2320] hover:bg-[#2a2320] hover:text-[#faf8f5] transition-colors"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Download PNG
          </button>
          <button
            onClick={handleDownloadHD}
            className="px-6 py-2.5 text-xs uppercase tracking-wider bg-[#2a2320] text-[#faf8f5] hover:bg-[#3d3430] transition-colors"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Download HD
          </button>
        </div>
      )}

      {/* Footer note */}
      <footer className="pb-8 text-center">
        <p
          className="text-xs text-[#b5aa9e] italic"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          Every word whispers &ldquo;I love you Guia&rdquo;
        </p>
      </footer>
    </div>
  )
}
