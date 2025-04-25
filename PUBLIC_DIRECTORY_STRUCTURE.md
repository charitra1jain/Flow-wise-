# FlowWise App - Public Directory Structure

This document outlines the structure for organizing images and other static assets in the public directory.

## Directory Structure

\`\`\`
public/
├── images/
│   ├── hero/
│   │   ├── main-hero.jpg
│   │   ├── adolescent-mode.jpg
│   │   └── adult-mode.jpg
│   │
│   ├── educational/
│   │   ├── adolescent/
│   │   │   ├── basics.jpg
│   │   │   ├── puberty.jpg
│   │   │   ├── products.jpg
│   │   │   ├── myths.jpg
│   │   │   ├── calendar.jpg
│   │   │   ├── self-care.jpg
│   │   │   ├── talking.jpg
│   │   │   ├── problems.jpg
│   │   │   └── activities.jpg
│   │   │
│   │   ├── adult/
│   │   │   ├── science.jpg
│   │   │   ├── conditions.jpg
│   │   │   ├── sustainable.jpg
│   │   │   ├── research.jpg
│   │   │   ├── hormones.jpg
│   │   │   ├── nutrition.jpg
│   │   │   ├── mental-health.jpg
│   │   │   ├── fertility.jpg
│   │   │   └── menopause.jpg
│   │   │
│   │   └── comics/
│   │       ├── comic-1.jpg
│   │       ├── comic-2.jpg
│   │       └── comic-3.jpg
│   │
│   ├── products/
│   │   ├── bamboo-pads.jpg
│   │   ├── menstrual-cup.jpg
│   │   ├── period-underwear.jpg
│   │   ├── organic-tampons.jpg
│   │   ├── cloth-pads.jpg
│   │   └── vending-machine.jpg
│   │
│   ├── blog/
│   │   ├── myths.jpg
│   │   ├── endometriosis.jpg
│   │   ├── cycle-phases.jpg
│   │   ├── pms.jpg
│   │   ├── sustainable.jpg
│   │   ├── period-poverty.jpg
│   │   ├── tampon-myths.jpg
│   │   └── period-pain.jpg
│   │
│   ├── integrations/
│   │   ├── google-fit.png
│   │   ├── apple-health.png
│   │   ├── fitbit.png
│   │   ├── samsung-health.png
│   │   ├── garmin.png
│   │   └── strava.png
│   │
│   ├── avatars/
│   │   ├── default.png
│   │   └── testimonials/
│   │       ├── sarah.png
│   │       ├── michael.png
│   │       └── priya.png
│   │
│   ├── icons/
│   │   ├── flowwise-logo.png
│   │   └── favicon.ico
│   │
│   └── features/
│       ├── chatbot.jpg
│       ├── tracker.jpg
│       ├── integrations.jpg
│       ├── products.jpg
│       ├── education.jpg
│       └── community.jpg
│
└── placeholder.svg
\`\`\`

## Image Guidelines

1. **Format**: Use `.jpg` for photographs and complex images, `.png` for logos and images requiring transparency, and `.svg` for icons and simple graphics.

2. **Size**: 
   - Hero images: 1920x1080px (16:9 ratio)
   - Feature images: 800x600px
   - Product images: 600x600px (1:1 ratio)
   - Blog thumbnails: 800x450px (16:9 ratio)
   - Icons: 64x64px or vector SVG

3. **Optimization**: Compress all images to reduce file size while maintaining quality.

4. **Naming Convention**: Use kebab-case (lowercase with hyphens) for all file names.

## How to Use

1. Create the directory structure in your public folder
2. Place your images in the appropriate directories
3. Update the image paths in the `lib/image-paths.ts` file if needed
4. Use the `OptimizedImage` component for better loading experience:

\`\`\`jsx
import OptimizedImage from '@/components/optimized-image'
import { imagePaths } from '@/lib/image-paths'

// In your component
<OptimizedImage 
  src={imagePaths.hero.main} 
  alt="Hero image" 
  className="w-full h-64"
/>
\`\`\`

## Placeholder Images

Until you have your own images, you can use placeholder services like:
- `https://placehold.co/600x400?text=FlowWise`
- `https://picsum.photos/600/400`
- Or the included `/placeholder.svg` file
\`\`\`

Now, let's create a simple script to help with image optimization:
