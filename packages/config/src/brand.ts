export interface BrandConfig {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  logo: {
    text: string;
    subtext: string;
    icon: string; // SVG path or symbol identifier
  };
  domain: string;
  url: string;
  email: {
    contact: string;
    editorial: string;
    newsletter: string;
    support: string;
  };
  social: {
    twitter: string;
    github: string;
    linkedin: string;
    youtube: string;
  };
  theme: {
    colors: {
      bg: string;
      bgSecondary: string;
      textPrimary: string;
      textSecondary: string;
      accentRed: string;
      accentRedHover: string;
      border: string;
      borderDark: string;
      cardBg: string;
      success: string;
      warning: string;
      danger: string;
      saffron?: string;
      saffronDark?: string;
      saffronLight?: string;
      indiaGreen?: string;
      indiaGreenDark?: string;
      indiaGreenLight?: string;
      chakraNavy?: string;
      chakraNavyLight?: string;
    };
    fonts: {
      serif: string;
      sans: string;
      mono: string;
    };
  };
}

export const brandConfig: BrandConfig = {
  name: "Orange-Chasma",
  shortName: "Orange-Chasma Bharat",
  tagline: "सत्यमेव जयते • Understand India through evidence, not noise.",
  description:
    "India's Interactive Civic Intelligence and Data-Visualization Platform. Explore schemes, public spending, audit reports, promises, and governance outcomes backed by verifiable evidence.",
  logo: {
    text: "ORANGE-CHASMA",
    subtext: "BHARAT CIVIC INTELLIGENCE ENGINE",
    icon: "glasses",
  },
  domain: "anaytech.in",
  url: "https://anaytech.in",
  email: {
    contact: "newsletter@anaytech.in",
    editorial: "newsletter@anaytech.in",
    newsletter: "newsletter@anaytech.in",
    support: "newsletter@anaytech.in",
  },
  social: {
    twitter: "https://x.com/civiclens_in",
    github: "https://github.com/civiclens/civiclens",
    linkedin: "https://linkedin.com/company/civiclens",
    youtube: "https://youtube.com/@civiclens",
  },
  theme: {
    colors: {
      saffron: "#FF671F", // Indian Saffron / Kesari
      saffronDark: "#D95300",
      saffronLight: "#FFF3E0",
      indiaGreen: "#046A38", // Indian Emerald Green / Harit
      indiaGreenDark: "#024B27",
      indiaGreenLight: "#E8F5E9",
      chakraNavy: "#06038D", // Ashoka Chakra Navy Blue
      chakraNavyLight: "#EEF2FF",
      bg: "#FAF7F0", // Warm Indian Khadi/Parchment off-white
      bgSecondary: "#F3EDE0",
      textPrimary: "#0F172A",
      textSecondary: "#475569",
      accentRed: "#D95300", // Saffron-orange highlight
      accentRedHover: "#B34000",
      border: "#E8DEC8",
      borderDark: "#D6C6A5",
      cardBg: "#FFFFFF",
      success: "#046A38",
      warning: "#D97706",
      danger: "#DC2626",
    },
    fonts: {
      serif: "'Cormorant Garamond', Georgia, serif",
      sans: "'Noto Serif', Georgia, serif",
      mono: "'JetBrains Mono', monospace",
    },
  },
};

export default brandConfig;
