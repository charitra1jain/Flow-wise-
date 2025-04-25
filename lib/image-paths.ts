/**
 * FlowWise Image Paths
 *
 * This file contains the paths for all images used in the FlowWise app.
 * Replace the placeholder paths with your actual image files.
 */

export const imagePaths = {
  // Hero and general images
  hero: {
    main: "/images/hero/main-hero.jpg", // Main hero image on homepage
    adolescent: "/images/hero/adolescent-mode.jpg", // Adolescent mode hero
    adult: "/images/hero/adult-mode.jpg", // Adult mode hero
  },

  // Educational content images
  educational: {
    adolescent: {
      basics: "/images/educational/adolescent/basics.jpg",
      puberty: "/images/educational/adolescent/puberty.jpg",
      products: "/images/educational/adolescent/products.jpg",
      myths: "/images/educational/adolescent/myths.jpg",
      calendar: "/images/educational/adolescent/calendar.jpg",
      selfCare: "/images/educational/adolescent/self-care.jpg",
      talking: "/images/educational/adolescent/talking.jpg",
      problems: "/images/educational/adolescent/problems.jpg",
      activities: "/images/educational/adolescent/activities.jpg",
    },
    adult: {
      science: "/images/educational/adult/science.jpg",
      conditions: "/images/educational/adult/conditions.jpg",
      sustainable: "/images/educational/adult/sustainable.jpg",
      research: "/images/educational/adult/research.jpg",
      hormones: "/images/educational/adult/hormones.jpg",
      nutrition: "/images/educational/adult/nutrition.jpg",
      mentalHealth: "/images/educational/adult/mental-health.jpg",
      fertility: "/images/educational/adult/fertility.jpg",
      menopause: "/images/educational/adult/menopause.jpg",
    },
    comics: [
      "/images/educational/comics/comic-1.jpg",
      "/images/educational/comics/comic-2.jpg",
      "/images/educational/comics/comic-3.jpg",
    ],
  },

  // Product images
  products: {
    bamboo: "/images/products/bamboo-pads.jpg",
    cup: "/images/products/menstrual-cup.jpg",
    underwear: "/images/products/period-underwear.jpg",
    tampons: "/images/products/organic-tampons.jpg",
    cloth: "/images/products/cloth-pads.jpg",
    vending: "/images/products/vending-machine.jpg",
  },

  // Blog images
  blog: {
    myths: "/images/blog/myths.jpg",
    endometriosis: "/images/blog/endometriosis.jpg",
    cycle: "/images/blog/cycle-phases.jpg",
    pms: "/images/blog/pms.jpg",
    sustainable: "/images/blog/sustainable.jpg",
    poverty: "/images/blog/period-poverty.jpg",
    tampon: "/images/blog/tampon-myths.jpg",
    pain: "/images/blog/period-pain.jpg",
  },

  // Integration app logos
  integrations: {
    googleFit: "/images/integrations/google-fit.png",
    appleHealth: "/images/integrations/apple-health.png",
    fitbit: "/images/integrations/fitbit.png",
    samsungHealth: "/images/integrations/samsung-health.png",
    garmin: "/images/integrations/garmin.png",
    strava: "/images/integrations/strava.png",
  },

  // User avatars
  avatars: {
    default: "/images/avatars/default.png",
    testimonials: {
      sarah: "/images/avatars/testimonials/sarah.png",
      michael: "/images/avatars/testimonials/michael.png",
      priya: "/images/avatars/testimonials/priya.png",
    },
  },

  // Icons and UI elements
  icons: {
    logo: "/images/icons/flowwise-logo.png",
    favicon: "/images/icons/favicon.ico",
  },

  // Feature illustrations
  features: {
    chatbot: "/images/features/chatbot.jpg",
    tracker: "/images/features/tracker.jpg",
    integrations: "/images/features/integrations.jpg",
    products: "/images/features/products.jpg",
    education: "/images/features/education.jpg",
    community: "/images/features/community.jpg",
  },
}

/**
 * How to use:
 *
 * 1. Import this file:
 *    import { imagePaths } from '@/lib/image-paths'
 *
 * 2. Use the paths in your components:
 *    <img src={imagePaths.hero.main || "/placeholder.svg"} alt="Hero image" />
 *
 * 3. Replace the placeholder paths with your actual image files
 *    by placing them in the public directory with the same structure
 */

export default imagePaths
