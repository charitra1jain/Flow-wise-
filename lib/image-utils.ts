/**
 * Utility functions for image handling
 */

/**
 * Checks if an image URL is in a modern format (WebP, AVIF)
 * @param url The image URL to check
 * @returns Boolean indicating if the image is in a modern format
 */
export function isModernImageFormat(url: string): boolean {
  const extension = url.split(".").pop()?.toLowerCase()
  return extension === "webp" || extension === "avif"
}

/**
 * Converts a JPEG/PNG image URL to WebP format
 * @param url The original image URL
 * @returns The WebP version of the URL
 */
export function getWebPVersion(url: string): string {
  if (isModernImageFormat(url)) return url

  const extension = url.split(".").pop()?.toLowerCase()
  if (!extension) return url

  // Replace the extension with webp
  return url.replace(new RegExp(`\\.${extension}$`), ".webp")
}

/**
 * Gets the appropriate image size based on the device
 * @param sizes Available image sizes
 * @param defaultSize Default size to use
 * @returns The appropriate image size
 */
export function getResponsiveImageSize(
  sizes: { sm: string; md: string; lg: string },
  defaultSize: "sm" | "md" | "lg" = "md",
): string {
  // In a real implementation, this would check the device/screen size
  // For now, we'll just return the default
  return sizes[defaultSize]
}
