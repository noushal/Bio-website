"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import {
  Volume2,
  VolumeX,
  Instagram,
  Github,
  Eye,
  Music,
} from "lucide-react"
import { FaSteam, FaGlobe } from "react-icons/fa";
import { useLanyardWS } from "use-lanyard"

const DISCORD_ID = "844446272273383425"

export default function BioPage() {
  const [hasEntered, setHasEntered] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [volume, setVolume] = useState(0.5)
  const [viewCount, setViewCount] = useState<number | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const [mounted, setMounted] = useState(false)
  const status = useLanyardWS(DISCORD_ID)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    fetch("/api/views")
      .then((r) => r.json())
      .then((d) => setViewCount(d.count))
      .catch(() => setViewCount(0))
  }, [])

  useEffect(() => {
    if (hasEntered && audioRef.current) {
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.currentTime = 0
          audioRef.current.volume = 0.5
          audioRef.current.muted = false
          setIsMuted(false)
          setVolume(0.5)
          audioRef.current.play().catch(() => {})
        }
      }, 100)
      fetch("/api/views", { method: "POST" })
        .then((r) => r.json())
        .then((d) => setViewCount(d.count))
        .catch(() => {})
    }
  }, [hasEntered])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  const toggleMute = () => {
    if (audioRef.current) {
      const nextMute = !audioRef.current.muted
      audioRef.current.muted = nextMute
      setIsMuted(nextMute)

      if (!nextMute) {
        audioRef.current.play().catch(() => {})
      }
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number.parseFloat(e.target.value)
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
      if (newVolume > 0 && isMuted) {
        audioRef.current.muted = false
        setIsMuted(false)
      } else if (newVolume === 0 && !isMuted) {
        audioRef.current.muted = true
        setIsMuted(true)
      }
    }
  }

  const getDecorationUrl = () => {
    const decorationData = status?.discord_user?.avatar_decoration_data
    if (!decorationData?.asset) return null
    return `https://cdn.discordapp.com/avatar-decoration-presets/${decorationData.asset}.png`
  }

  const getRPCActivity = () => {
    const activity = status?.activities?.find((a) => a.type === 0)
    if (!activity) return null
    return activity
  }

  const getStatusIcon = () => {
    const status_value = status?.discord_status
    if (status_value === "online") {
      return (
        <svg className="w-5 h-5" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="7" fill="#31a24c" />
        </svg>
      )
    }
    if (status_value === "idle") {
      return (
        <svg className="w-5 h-5" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="7" fill="#f0b232" />
          <circle cx="8" cy="8" r="4" fill="#faa61a" />
        </svg>
      )
    }
    if (status_value === "dnd") {
      return (
        <svg className="w-5 h-5" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="7" fill="#f04747" />
          <rect x="5" y="7" width="6" height="2" fill="black" rx="1" />
        </svg>
      )
    }
    return (
      <svg className="w-5 h-5" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="7" fill="#747f8d" />
      </svg>
    )
  }

  const getStatusText = () => {
    const status_value = status?.discord_status
    if (status_value === "online") return "Online"
    if (status_value === "idle") return "Idle"
    if (status_value === "dnd") return "Do Not Disturb"
    return "Offline"
  }

  const getGuildTag = () => {
    const user = status?.discord_user as any
    return user?.primary_guild?.tag || null
  }

  if (!mounted) return null

  return (
    <main className="relative min-h-screen w-full bg-black text-white overflow-hidden font-sans">
      {!hasEntered && (
        <div 
          onClick={() => setHasEntered(true)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in cursor-pointer"
        >
          <h1 className="text-6xl font-black tracking-tight text-white select-none animate-neon-glow-white">
            click to enter
          </h1>
        </div>
      )}

      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 z-0 w-full h-full object-cover opacity-50"
      >
        <source
          src="https://r2.guns.lol/230d826e-e86a-4424-b169-084ad452ef8d.mp4"
          type="video/mp4"
        />
      </video>

      <audio ref={audioRef} loop>
        <source src="./audio.mp3" type="audio/mpeg" />
      </audio>

      <div className="absolute top-6 left-6 z-20 flex items-center gap-3 bg-black/60 backdrop-blur-md p-2.5 rounded-2xl border border-white/10 shadow-xl group">
        <button onClick={toggleMute} className="p-1.5 hover:bg-white/10 rounded-xl transition-all active:scale-90">
          {isMuted || volume === 0 ? (
            <VolumeX className="w-5 h-5 text-red-500/80" />
          ) : (
            <Volume2 className="w-5 h-5 text-white/80" />
          )}
        </button>
        <div className="flex items-center gap-2 overflow-hidden w-0 group-hover:w-24 transition-all duration-500 ease-in-out">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-20 h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-white/80"
          />
        </div>
        <Music className={`w-4 h-4 text-white/30 animate-spin-slow ${isMuted ? "hidden" : "block"}`} />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20">
        <div className={`w-full max-w-2xl bg-black/40 backdrop-blur-3xl border border-white/20 rounded-3xl p-12 flex flex-col items-center gap-8 shadow-[0_0_60px_rgba(255,255,255,0.1)] relative overflow-hidden transition-all ${hasEntered ? "animate-fade-in" : "opacity-0"}`}>
          <div className="flex flex-col items-center gap-6 relative z-10">
            <div className="relative group">
              <div className="absolute -inset-3 bg-gradient-to-br from-white/20 to-pink-500/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500" />

              <div className="relative w-36 h-36">
                <div className="absolute inset-0 rounded-full overflow-hidden border border-white/30 shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] transition-shadow">
                  <img
                    src={
                      status?.discord_user?.avatar
                        ? `https://cdn.discordapp.com/avatars/${status.discord_user.id}/${status.discord_user.avatar}.${status.discord_user.avatar.startsWith("a_") ? "gif" : "png"}?size=512`
                        : "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJqZ3R4Z3R4Z3R4Z3R4Z3R4Z3R4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/LXLgiN2R8OtMc/giphy.gif"
                    }
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>

                {getDecorationUrl() && (
                  <img
                    src={getDecorationUrl()}
                    alt="Avatar Decoration"
                    className="absolute inset-[-25%] w-[150%] h-[150%] pointer-events-none z-10 max-w-none object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      const asset = status?.discord_user?.avatar_decoration_data?.asset
                      if (asset && !target.src.includes("avatar-decorations")) {
                        target.src = `https://cdn.discordapp.com/avatar-decorations/${status.discord_user.id}/${asset}.webp`
                      }
                    }}
                  />
                )}
              </div>
            </div>

            <div className="text-center space-y-2">
              <h1 className="text-5xl font-black tracking-tight animate-neon-glow-white text-white">
                noushal
              </h1>
              <p className="text-sm text-white/60 font-medium tracking-widest uppercase">Full Stack Developer</p>
            </div>
          </div>

          <div className="w-80 bg-black/50 backdrop-blur-xl border border-white/10 rounded-xl p-3.5 hover:border-white/20 transition-all group/card relative z-10">
            <div className="flex items-start gap-3">
              <div className="relative flex-shrink-0">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/20 shadow-lg">
                  <img
                    src={
                      status?.discord_user?.avatar
                        ? `https://cdn.discordapp.com/avatars/${status.discord_user.id}/${status.discord_user.avatar}.png`
                        : "/placeholder.svg"
                    }
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 border-2 border-black rounded-full shadow-lg bg-black/50">
                  {getStatusIcon()}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span 
                    className="font-bold text-sm animate-neon-glow-white"
                  >
                    {status?.discord_user?.username || "noushal"}
                  </span>
                  {getGuildTag() && (
                    <span className="text-[9px] font-bold bg-gray-700/80 text-white/90 border border-gray-600/60 px-2 py-0.5 rounded-sm">
                      {getGuildTag()}
                    </span>
                  )}
                </div>
                
                {getRPCActivity() ? (
                  <div className="text-xs text-white/70">
                    <div className="font-semibold text-white text-xs mb-0.5">
                      {getRPCActivity()!.name}
                    </div>
                    {getRPCActivity()!.state && (
                      <div className="text-[11px] text-white/60">
                        {getRPCActivity()!.state}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-xs text-white/70 font-medium">
                    {getStatusText()}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 relative z-10">
            {[
              { icon: Instagram, href: "https://www.instagram.com/ag.nt47_/" },
              { icon: Github, href: "https://github.com/noushal" },
              { icon: FaSteam, href: "https://steamcommunity.com/id/noushal/" },
              { icon: FaGlobe, href: "https://noushal.in" },
            ].map((social, i) => (
              <a
                key={i}
                href={social.href}
                className="group/icon relative p-3 bg-black/20 border border-white/20 rounded-lg hover:border-white/60 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                <social.icon className="w-5 h-5 text-white/60 group-hover/icon:text-white transition-colors relative z-10" />
              </a>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-8 z-10 flex items-center gap-2 text-white/40 text-xs font-bold tracking-widest uppercase bg-black/30 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/20">
          <Eye className="w-4 h-4" />
          <span>{viewCount ?? "—"}</span>
        </div>
      </div>
    </main>
  )
}
