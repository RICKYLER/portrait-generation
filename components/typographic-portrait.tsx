"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import Link from "next/link"

const PHRASE = "I love you Guia "

interface ColorTheme {
  name: string
  textColor: [number, number, number]
  bgColor: string
  preview: string
  accent: string
}

const COLOR_THEMES: ColorTheme[] = [
  {
    name: "Classic Ink",
    textColor: [20, 15, 15],
    bgColor: "#ffffff",
    preview: "#140f0f",
    accent: "#3a3535",
  },
  {
    name: "Sepia Love",
    textColor: [90, 55, 30],
    bgColor: "#fdf8f0",
    preview: "#5a371e",
    accent: "#8a6a48",
  },
  {
    name: "Midnight Blue",
    textColor: [15, 30, 70],
    bgColor: "#f5f7fc",
    preview: "#0f1e46",
    accent: "#2a3f7a",
  },
  {
    name: "Rose Romance",
    textColor: [120, 25, 50],
    bgColor: "#fdf5f7",
    preview: "#781932",
    accent: "#a83050",
  },
  {
    name: "Forest Whisper",
    textColor: [20, 60, 40],
    bgColor: "#f5faf7",
    preview: "#143c28",
    accent: "#2a6648",
  },
  {
    name: "Royal Purple",
    textColor: [55, 20, 80],
    bgColor: "#f8f5fc",
    preview: "#371450",
    accent: "#5a2a80",
  },
  {
    name: "Warm Burgundy",
    textColor: [100, 20, 30],
    bgColor: "#fdf6f4",
    preview: "#64141e",
    accent: "#8a2a38",
  },
  {
    name: "Ocean Deep",
    textColor: [10, 55, 75],
    bgColor: "#f3f9fb",
    preview: "#0a374b",
    accent: "#1a6080",
  },
]

export default function TypographicPortrait() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [fontSize, setFontSize] = useState(4)
  const [contrast, setContrast] = useState(1.4)
  const [isRendering, setIsRendering] = useState(false)
  const [selectedTheme, setSelectedTheme] = useState(0)
  const [customColor, setCustomColor] = useState("#140f0f")
  const [customBg, setCustomBg] = useState("#ffffff")
  const [useCustom, setUseCustom] = useState(false)

  const getActiveColors = useCallback(() => {
    if (useCustom) {
      const hex = customColor.replace("#", "")
      const r = parseInt(hex.substring(0, 2), 16)
      const g = parseInt(hex.substring(2, 4), 16)
      const b = parseInt(hex.substring(4, 6), 16)
      return { textColor: [r, g, b] as [number, number, number], bgColor: customBg }
    }
    const theme = COLOR_THEMES[selectedTheme]
    return { textColor: theme.textColor, bgColor: theme.bgColor }
  }, [useCustom, customColor, customBg, selectedTheme])

  const renderPortrait = useCallback(
    (customFontSize?: number, customContrast?: number) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      setIsRendering(true)
      setProgress(0)

      const { textColor, bgColor } = getActiveColors()

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

        // Clear canvas with background color
        ctx.fillStyle = bgColor
        ctx.fillRect(0, 0, targetWidth, targetHeight)

        const currentFontSize = customFontSize ?? fontSize
        const currentContrast = customContrast ?? contrast
        const lineHeight = currentFontSize + 1
        ctx.font = `${currentFontSize}px 'Georgia', 'Times New Roman', serif`
        ctx.textBaseline = "top"

        let charIndex = 0
        const totalRows = Math.ceil(targetHeight / lineHeight)
        let rowsDone = 0

        const batchSize = 8
        let currentY = 0

        const processBatch = () => {
          const batchEnd = Math.min(currentY + batchSize * lineHeight, targetHeight)

          while (currentY < batchEnd) {
            let x = 0
            while (x < targetWidth) {
              const char = PHRASE[charIndex % PHRASE.length]
              charIndex++

              const sampleX = Math.min(Math.floor(x + currentFontSize / 2), targetWidth - 1)
              const sampleY = Math.min(Math.floor(currentY + lineHeight / 2), targetHeight - 1)
              const pixelIndex = (sampleY * targetWidth + sampleX) * 4

              const r = pixels[pixelIndex]
              const g = pixels[pixelIndex + 1]
              const b = pixels[pixelIndex + 2]

              const gray = 0.299 * r + 0.587 * g + 0.114 * b

              let brightness = gray / 255
              brightness = Math.pow(brightness, currentContrast)

              const opacity = 1 - brightness

              if (opacity < 0.03) {
                const charWidth = ctx.measureText(char).width
                x += charWidth
                continue
              }

              ctx.fillStyle = `rgba(${textColor[0]}, ${textColor[1]}, ${textColor[2]}, ${Math.min(opacity * 1.2, 1)})`
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
    [fontSize, contrast, getActiveColors]
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
    const canvas = canvasRef.current
    if (!canvas) return

    const { textColor, bgColor } = getActiveColors()

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

      hdCtx.fillStyle = bgColor
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

          hdCtx.fillStyle = `rgba(${textColor[0]}, ${textColor[1]}, ${textColor[2]}, ${Math.min(opacity * 1.2, 1)})`
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

  const activeColors = getActiveColors()

  return (
    <div className="min-h-screen flex flex-col items-center bg-background">
      {/* Header */}
      <header className="w-full py-8 flex items-center justify-center relative px-4">
        <Link
          href="/"
          className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors tracking-wider uppercase font-sans"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
          Back
        </Link>
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl tracking-wide text-foreground font-sans">
            I Love You, Guia
          </h1>
          <p className="text-sm text-muted-foreground mt-2 tracking-widest uppercase font-sans">
            A Portrait Made of Words
          </p>
        </div>
      </header>

      {/* Color Theme Selector */}
      <div className="w-full max-w-3xl px-4 mb-6">
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-sans text-center mb-4">
          Choose a Color Theme
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {COLOR_THEMES.map((theme, index) => (
            <button
              key={theme.name}
              onClick={() => {
                setSelectedTheme(index)
                setUseCustom(false)
              }}
              disabled={isRendering}
              className="group flex flex-col items-center gap-1.5 disabled:opacity-40 transition-all"
              aria-label={`Select ${theme.name} theme`}
            >
              <div
                className="relative w-10 h-10 rounded-full border-2 transition-all duration-200 flex items-center justify-center"
                style={{
                  backgroundColor: theme.bgColor,
                  borderColor: !useCustom && selectedTheme === index ? theme.preview : "transparent",
                  boxShadow: !useCustom && selectedTheme === index ? `0 0 0 2px ${theme.accent}40` : "none",
                }}
              >
                <div
                  className="w-5 h-5 rounded-full"
                  style={{ backgroundColor: theme.preview }}
                />
                {!useCustom && selectedTheme === index && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-foreground flex items-center justify-center">
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-background">
                      <path d="M20 6 9 17l-5-5"/>
                    </svg>
                  </div>
                )}
              </div>
              <span
                className="text-[10px] tracking-wide font-sans transition-colors"
                style={{
                  color: !useCustom && selectedTheme === index ? theme.preview : undefined,
                }}
              >
                {!useCustom && selectedTheme === index ? (
                  <span className="font-medium">{theme.name}</span>
                ) : (
                  <span className="text-muted-foreground">{theme.name}</span>
                )}
              </span>
            </button>
          ))}

          {/* Custom color option */}
          <button
            onClick={() => setUseCustom(true)}
            disabled={isRendering}
            className="group flex flex-col items-center gap-1.5 disabled:opacity-40 transition-all"
            aria-label="Use custom color"
          >
            <div
              className="relative w-10 h-10 rounded-full border-2 transition-all duration-200 overflow-hidden"
              style={{
                borderColor: useCustom ? customColor : "transparent",
                boxShadow: useCustom ? `0 0 0 2px ${customColor}40` : "none",
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background: `conic-gradient(
                    #ff0000, #ff8000, #ffff00, #00ff00, #0080ff, #8000ff, #ff0080, #ff0000
                  )`,
                }}
              />
              {useCustom && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-foreground flex items-center justify-center z-10">
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-background">
                    <path d="M20 6 9 17l-5-5"/>
                  </svg>
                </div>
              )}
            </div>
            <span className={`text-[10px] tracking-wide font-sans ${useCustom ? "text-foreground font-medium" : "text-muted-foreground"}`}>
              Custom
            </span>
          </button>
        </div>

        {/* Custom color pickers */}
        {useCustom && (
          <div className="flex items-center justify-center gap-6 mt-4 p-4 border border-border rounded-lg bg-card">
            <div className="flex items-center gap-2">
              <label className="text-xs text-muted-foreground uppercase tracking-wider font-sans">
                Text
              </label>
              <div className="relative">
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className="w-8 h-8 rounded-full cursor-pointer border border-border overflow-hidden appearance-none bg-transparent [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-full [&::-webkit-color-swatch]:border-none"
                />
              </div>
              <span className="text-xs text-muted-foreground font-mono">{customColor}</span>
            </div>
            <div className="w-px h-6 bg-border" />
            <div className="flex items-center gap-2">
              <label className="text-xs text-muted-foreground uppercase tracking-wider font-sans">
                Background
              </label>
              <div className="relative">
                <input
                  type="color"
                  value={customBg}
                  onChange={(e) => setCustomBg(e.target.value)}
                  className="w-8 h-8 rounded-full cursor-pointer border border-border overflow-hidden appearance-none bg-transparent [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-full [&::-webkit-color-swatch]:border-none"
                />
              </div>
              <span className="text-xs text-muted-foreground font-mono">{customBg}</span>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-center gap-6 mb-6 px-4">
        <div className="flex items-center gap-3">
          <label className="text-xs text-muted-foreground uppercase tracking-wider font-sans">
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
            className="w-28 accent-primary"
          />
          <span className="text-xs text-foreground w-6 tabular-nums">{fontSize}</span>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs text-muted-foreground uppercase tracking-wider font-sans">
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
            className="w-28 accent-primary"
          />
          <span className="text-xs text-foreground w-8 tabular-nums">{contrast.toFixed(1)}</span>
        </div>

        <button
          onClick={() => renderPortrait()}
          disabled={isRendering}
          className="px-5 py-2 text-xs uppercase tracking-wider bg-primary text-primary-foreground hover:opacity-90 transition-all disabled:opacity-50 font-sans"
        >
          {isRendering ? "Rendering..." : "Regenerate"}
        </button>
      </div>

      {/* Loading state */}
      {(isLoading || isRendering) && (
        <div className="flex flex-col items-center gap-3 mb-4">
          <div className="w-64 h-1.5 bg-border overflow-hidden">
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${progress}%`,
                backgroundColor: useCustom ? customColor : COLOR_THEMES[selectedTheme].preview,
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground font-sans italic">
            Writing love into every pixel... {progress}%
          </p>
        </div>
      )}

      {/* Canvas */}
      <div
        className="relative shadow-2xl border border-border"
        style={{ backgroundColor: activeColors.bgColor }}
      >
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
            className="px-6 py-2.5 text-xs uppercase tracking-wider border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors font-sans"
          >
            Download PNG
          </button>
          <button
            onClick={handleDownloadHD}
            className="px-6 py-2.5 text-xs uppercase tracking-wider bg-primary text-primary-foreground hover:opacity-90 transition-all font-sans"
          >
            Download HD
          </button>
        </div>
      )}

      {/* Footer note */}
      <footer className="pb-8 text-center">
        <p className="text-xs text-muted-foreground italic font-sans">
          Every word whispers &ldquo;I love you Guia&rdquo;
        </p>
      </footer>
    </div>
  )
}
