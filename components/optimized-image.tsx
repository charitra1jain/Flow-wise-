"use client"

import { useState, useEffect } from "react"

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  fallbackSrc?: string
  loading?: "lazy" | "eager"
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = "",
  fallbackSrc = "/placeholder.svg",
  loading = "lazy",
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(src)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    setImgSrc(src)
    setIsLoading(true)
    setError(false)
  }, [src])

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setError(true)
    setIsLoading(false)
    setImgSrc(fallbackSrc)
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 animate-pulse">
          <span className="sr-only">Loading image...</span>
        </div>
      )}
      <img
        src={imgSrc || "/placeholder.svg"}
        alt={alt}
        width={width}
        height={height}
        onLoad={handleLoad}
        onError={handleError}
        loading={loading}
        className={`${className} ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
      />
    </div>
  )
}
