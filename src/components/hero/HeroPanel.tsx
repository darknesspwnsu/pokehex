import './HeroPanel.css'
import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'

import { TYPE_COLORS } from '../../lib/constants'
import { formatDex, getContrastColor, toRgba } from '../../lib/ui'
import type { PaletteMode, PokemonEntry } from '../../lib/types'
import { ShinySparkle } from '../shared/ShinySparkle'
import missingNo from '../../assets/missingno.webp'
import shareIcon from '../../assets/share-ios.svg'
import downloadIcon from '../../assets/download.svg'

type HeroPanelProps = {
  entry: PokemonEntry
  paletteMode: PaletteMode
  dominantHex: string
  dominantText: string
  dominantMuted: string
  shareUrl?: string
  onShare?: (url: string) => void
  onExport?: () => void
  isExporting?: boolean
}

type ArtTransform = {
  scale: number
  offsetX: number
  offsetY: number
}

const heroArtCache = new Map<string, ArtTransform>()

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

const computeArtTransform = (img: HTMLImageElement): ArtTransform | null => {
  const width = img.naturalWidth
  const height = img.naturalHeight

  if (!width || !height) {
    return null
  }

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) {
    return null
  }

  ctx.clearRect(0, 0, width, height)
  ctx.drawImage(img, 0, 0, width, height)

  let minX = width
  let minY = height
  let maxX = 0
  let maxY = 0

  const alphaThreshold = 12
  const stride = Math.max(1, Math.floor(Math.min(width, height) / 300))
  const imageData = ctx.getImageData(0, 0, width, height)
  const { data } = imageData

  for (let y = 0; y < height; y += stride) {
    for (let x = 0; x < width; x += stride) {
      const alpha = data[(y * width + x) * 4 + 3]
      if (alpha > alphaThreshold) {
        if (x < minX) minX = x
        if (x > maxX) maxX = x
        if (y < minY) minY = y
        if (y > maxY) maxY = y
      }
    }
  }

  if (maxX <= minX || maxY <= minY) {
    return null
  }

  const bboxWidth = maxX - minX
  const bboxHeight = maxY - minY
  const bboxRatio = Math.max(bboxWidth / width, bboxHeight / height)
  const targetFill = 0.9
  const scale = clamp(targetFill / bboxRatio, 1, 1.25)
  const centerX = (minX + maxX) / 2
  const centerY = (minY + maxY) / 2
  const offsetX = ((width / 2 - centerX) / width) * 100
  const offsetY = ((height / 2 - centerY) / height) * 100

  return {
    scale: Number(scale.toFixed(3)),
    offsetX: Number(offsetX.toFixed(2)),
    offsetY: Number(offsetY.toFixed(2)),
  }
}

export const HeroPanel = ({
  entry,
  paletteMode,
  dominantHex,
  dominantText,
  dominantMuted,
  shareUrl,
  onShare,
  onExport,
  isExporting = false,
}: HeroPanelProps) => {
  const stats = [
    { label: 'HP', value: entry.baseStats?.hp ?? 0 },
    { label: 'ATK', value: entry.baseStats?.attack ?? 0 },
    { label: 'DEF', value: entry.baseStats?.defense ?? 0 },
    { label: 'SP.ATK', value: entry.baseStats?.specialAttack ?? 0 },
    { label: 'SP.DEF', value: entry.baseStats?.specialDefense ?? 0 },
    { label: 'SPD', value: entry.baseStats?.speed ?? 0 },
  ]
  const hasArt = Boolean(entry.images[paletteMode])
  const artUrl = hasArt ? entry.images[paletteMode] : missingNo
  const cachedTransform = useMemo(
    () => (artUrl ? heroArtCache.get(artUrl) ?? null : null),
    [artUrl],
  )
  const [artTransform, setArtTransform] = useState<ArtTransform | null>(cachedTransform)

  useEffect(() => {
    setArtTransform(cachedTransform)
  }, [cachedTransform])

  const handleShare = () => {
    if (shareUrl && onShare) {
      onShare(shareUrl)
    }
  }

  return (
    <motion.div
      key={entry.name}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="hero-panel hero-shell rounded-none shadow-float"
      style={{
        backgroundColor: dominantHex,
        color: dominantText,
        backgroundImage:
          'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.35), transparent 55%), radial-gradient(circle at 80% 20%, rgba(0,0,0,0.2), transparent 60%)',
      }}
    >
      <div className="hero-actions">
        <button
          type="button"
          className="hero-action-button"
          onClick={handleShare}
          aria-label="Copy share link"
          disabled={!shareUrl}
        >
          <img
            src={shareIcon}
            alt=""
            aria-hidden="true"
            className="hero-action-icon"
          />
        </button>
        {onExport ? (
          <button
            type="button"
            className="hero-action-button"
            onClick={onExport}
            aria-label="Export hero panel"
            disabled={isExporting}
          >
            <img
              src={downloadIcon}
              alt=""
              aria-hidden="true"
              className="hero-action-icon"
            />
          </button>
        ) : null}
      </div>
      <div className="hero-content flex items-center justify-between gap-6 layout-hero">
        <div className="hero-info hero-copy flex-1 space-y-4">
          {hasArt ? (
            <p className="hero-kicker text-xs uppercase tracking-[0.35em]" style={{ color: dominantMuted }}>
              Dominant color
            </p>
          ) : null}
          <h2 className="hero-title font-display text-4xl sm:text-5xl">
            <span className="hero-title-text inline-flex items-center gap-2">
              {entry.displayName}
              {paletteMode === 'shiny' ? <ShinySparkle className="hero-title-sparkle" /> : null}
            </span>
          </h2>
          <p className="hero-meta text-sm sm:text-base" style={{ color: dominantMuted }}>
            #{formatDex(entry.speciesId)} · Gen {entry.generation} · {paletteMode}
          </p>
          <div className="hero-types flex flex-wrap gap-2">
            {entry.types.map((type) => (
              <span
                key={`${entry.name}-${type}`}
                className="hero-type rounded-none px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em]"
                style={{
                  backgroundColor: TYPE_COLORS[type] ?? '#64748B',
                  color: getContrastColor(TYPE_COLORS[type] ?? '#64748B'),
                }}
              >
                {type}
              </span>
            ))}
          </div>
          {hasArt ? (
            <div
              className="hero-chip mt-4 inline-flex items-center gap-3 rounded-none px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em]"
              style={{
                backgroundColor: toRgba(dominantText, 0.18),
                borderColor: toRgba(dominantText, 0.25),
              }}
            >
              <span className="hero-chip-hex">{dominantHex}</span>
              <span className="hero-chip-label" style={{ color: dominantMuted }}>
                dominant
              </span>
            </div>
          ) : null}
          <div className="hero-stats grid grid-cols-3 gap-3">
            {stats.map((stat) => {
              const fill = Math.min(100, Math.round((stat.value / 255) * 100))
              return (
                <div key={`${entry.name}-${stat.label}`} className="hero-stat">
                  <div className="hero-stat-row">
                    <span className="hero-stat-label" style={{ color: dominantMuted }}>
                      {stat.label}
                    </span>
                    <span className="hero-stat-value">{stat.value}</span>
                  </div>
                  <div
                    className="hero-stat-bar"
                    style={{ backgroundColor: toRgba(dominantText, 0.2) }}
                  >
                    <span
                      className="hero-stat-fill"
                      style={{
                        width: `${fill}%`,
                        backgroundColor: toRgba(dominantText, 0.7),
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <div className="hero-art flex flex-1 flex-col items-center justify-center">
          <img
            key={artUrl}
            src={artUrl}
            alt={hasArt ? entry.displayName : `${entry.displayName} (missing art)`}
            className="hero-art-image drop-shadow-[0_30px_45px_rgba(0,0,0,0.25)]"
            loading="lazy"
            decoding="async"
            crossOrigin="anonymous"
            onLoad={(event) => {
              if (!artUrl || heroArtCache.has(artUrl)) {
                return
              }

              try {
                const computed = computeArtTransform(event.currentTarget)
                if (computed) {
                  heroArtCache.set(artUrl, computed)
                  setArtTransform(computed)
                }
              } catch {
                // Ignore CORS-tainted images.
              }
            }}
            style={
              artTransform
                ? {
                    transform: `translate(${artTransform.offsetX}%, ${artTransform.offsetY}%) scale(${artTransform.scale})`,
                  }
                : undefined
            }
          />
          {!hasArt ? (
            <p className="hero-art-caption text-xs uppercase tracking-[0.2em]" style={{ color: dominantMuted }}>
              (no official artwork)
            </p>
          ) : null}
        </div>
      </div>
    </motion.div>
  )
}
