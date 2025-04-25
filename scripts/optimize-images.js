/**
 * Image Optimization Script
 *
 * This script helps optimize images in the public directory.
 * To use it, install the required packages:
 *
 * npm install sharp glob fs-extra
 *
 * Then run:
 * node scripts/optimize-images.js
 */

const sharp = require("sharp")
const glob = require("glob")
const fs = require("fs-extra")
const path = require("path")

// Configuration
const config = {
  inputDir: "public/images",
  outputDir: "public/images-optimized",
  quality: 80, // JPEG quality (0-100)
  maxWidth: 1920, // Maximum width for any image
  formats: {
    jpg: { quality: 80 },
    jpeg: { quality: 80 },
    png: { quality: 80 },
    webp: { quality: 80 },
  },
}

// Create output directory if it doesn't exist
fs.ensureDirSync(config.outputDir)

// Find all images
glob(`${config.inputDir}/**/*.{jpg,jpeg,png}`, {}, (err, files) => {
  if (err) {
    console.error("Error finding files:", err)
    return
  }

  console.log(`Found ${files.length} images to optimize`)

  // Process each file
  files.forEach((file) => {
    const relativePath = file.replace(config.inputDir, "")
    const outputPath = path.join(config.outputDir, relativePath)
    const outputDir = path.dirname(outputPath)
    const ext = path.extname(file).toLowerCase().substring(1)

    // Create output directory if it doesn't exist
    fs.ensureDirSync(outputDir)

    // Get format options
    const formatOptions = config.formats[ext] || config.formats.jpg

    // Optimize image
    sharp(file)
      .resize({ width: config.maxWidth, withoutEnlargement: true })
      .jpeg({ quality: formatOptions.quality })
      .toFile(outputPath)
      .then(() => {
        console.log(`Optimized: ${relativePath}`)
      })
      .catch((err) => {
        console.error(`Error optimizing ${relativePath}:`, err)
      })
  })
})

console.log("Image optimization started. This may take a while...")
