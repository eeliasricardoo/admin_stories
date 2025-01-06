"use client"

import { useEffect, useRef } from "react"

interface VideoPlayerProps {
  src: string
  poster?: string
  className?: string
}

export function HLSPlayer({ src, poster, className }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const playVideo = () => {
      video.play().catch(error => {
        console.log('Playback prevented:', error)
      })
    }

    video.addEventListener('loadedmetadata', playVideo)
    return () => {
      video.removeEventListener('loadedmetadata', playVideo)
    }
  }, [])

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      className={className}
      playsInline
      muted
      loop
      autoPlay
    />
  )
} 