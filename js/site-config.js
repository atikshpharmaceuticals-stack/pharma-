/**
 * ATIKSH PHARMA - Default Website Content Master Config
 * Full customizable registry for headings, body copy, images, and contact information.
 */

const ATIKSH_DEFAULT_CONFIG = {
  // Brand & Global
  companyName: "Atiksh Pharma",
  tagline: "Committed to Quality. Driven by Healthcare.",
  phone: "+91 98765 43210",
  phoneOffice: "+91 11 2345 6789",
  email: "info@atikshpharma.com",
  emailSales: "sales@atikshpharma.com",
  emailInstitutional: "exports@atikshpharma.com",
  address: "Atiksh Pharma Tower, Plot No. 42, Sector 62, Industrial Area, New Delhi / NCR, Pin - 110092, India",
  operatingHours: "Monday – Saturday: 9:30 AM – 6:30 PM IST",
  footerStandards: "ISO 9001:2015 Standards • Certified Pharmaceutical Formulations",

  // Homepage: Hero Section
  homeHeroBadge: "Pan-India & Global Pharmaceutical Supply",
  homeHeroTitlePart1: "ATIKSH",
  homeHeroTitlePart2: "PHARMA",
  homeHeroSubtitlePart1: "Committed to Quality.",
  homeHeroSubtitlePart2: "Driven by Healthcare.",
  homeHeroDescription: "Delivering reliable pharmaceutical solutions with a commitment to quality, innovation and better healthcare across essential formulations, institutional hospital supplies.",
  homeHeroCta1Text: "Explore Products",
  homeHeroCta2Text: "Contact Us",

  // Homepage: Trust Metrics
  homeMetric1Num: "500+",
  homeMetric1Label: "Approved Formulations",
  homeMetric2Num: "100%",
  homeMetric2Label: "Quality Assurance Standards",
  homeMetric3Num: "28+",
  homeMetric3Label: "States Distribution Reach",
  homeMetric4Num: "Quality",
  homeMetric4Label: "Batch Tested Purity",

  // Homepage: About Preview
  homeAboutBadge: "About Our Enterprise",
  homeAboutTitle: "Advancing Healthcare Through Quality",
  homeAboutParagraph1: "Atiksh Pharma is an established pharmaceutical enterprise committed to the highest standards of scientific formulation, regulatory compliance, and reliable healthcare distribution. We collaborate with medical institutions, healthcare providers, and distributors across India.",
  homeAboutParagraph2: "Our portfolio spans essential formulations engineered to treat critical conditions. Every batch adheres to rigorous Quality Control and Quality Assurance protocols to ensure uncompromised therapeutic efficacy.",
  homeAboutImage: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80",
  homeAboutImageBadge: "Scientific Discipline",
  homeAboutImageCaption: "Delivering clinical efficacy through certified manufacturing and stringent QA/QC oversight.",

  // Homepage: Quality Section
  homeQualityBadge: "Scientific Rigor",
  homeQualityTitle: "Quality at Every Step",
  homeQualityDescription: "From raw active pharmaceutical ingredient (API) inspection to finished batch distribution, quality compliance is built into every phase of our operations.",

  // Homepage: Why Choose Us
  homeWhyBadge: "Corporate Advantage",
  homeWhyTitle: "Why Atiksh Pharma",
  homeWhyDescription: "A dedicated pharmaceutical partner delivering reliability, clinical efficacy, and collaborative commercial value.",

  // About Page: Overview
  aboutHeroBadge: "Corporate Identity & Philosophy",
  aboutHeroTitle: "Advancing Healthcare Through Quality",
  aboutHeroDescription: "Atiksh Pharma is dedicated to building trustworthy, science-led pharmaceutical relationships through uncompromising quality, dependable supply, and clinical integrity.",
  aboutWhoBadge: "Who We Are",
  aboutWhoTitle: "A Committed Pharmaceutical Enterprise",
  aboutWhoParagraph1: "Atiksh Pharma was founded with a singular commitment: to deliver reliable, high-efficacy pharmaceutical medicines across critical therapeutic domains. We understand that healthcare providers and institutions rely on consistency, safety, and strict regulatory compliance.",
  aboutWhoParagraph2: "Headquartered in India with a wide-ranging distribution network, Atiksh Pharma bridges patient therapeutic requirements with modern, certified manufacturing capabilities.",
  aboutWhoQuote: "We measure our success not just by volume, but by the trust healthcare professionals place in every tablet, capsule, injection, and liquid formulation bearing our name.",
  aboutWhoImage: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=800&auto=format&fit=crop&q=80",

  // About Page: Mission & Vision
  aboutMissionTitle: "Our Mission",
  aboutMissionText: "To enhance patient outcomes by providing consistently high-quality, scientifically validated pharmaceuticals at accessible costs across hospital, institutional, and retail channels.",
  aboutVisionTitle: "Our Vision",
  aboutVisionText: "To be recognized as one of India's most dependable, ethically governed pharmaceutical partners, revered for clinical precision and supply excellence.",
  aboutValuesTitle: "Core Values",
  aboutValuesText: "Scientific Integrity, Transparency, Zero Quality Compromise, Customer Centricity, and Continuous Improvement in all operations.",

  // Contact Page:
  contactHeroBadge: "Commercial Inquiries & Support",
  contactHeroTitle: "Contact Atiksh Pharma",
  contactHeroDescription: "Connect with our distribution managers, institutional supply teams, and commercial support desks across India."
};

/**
 * Helper to get current config from localStorage, falling back to defaults.
 */
function getSiteConfig() {
  try {
    const saved = localStorage.getItem('atiksh_site_config');
    if (saved) {
      return { ...ATIKSH_DEFAULT_CONFIG, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error("Error reading site config:", e);
  }
  return { ...ATIKSH_DEFAULT_CONFIG };
}

/**
 * Helper to save site config to localStorage and central server.
 */
function saveSiteConfig(config) {
  try {
    localStorage.setItem('atiksh_site_config', JSON.stringify(config));
    if (window.AtikshAPI && typeof window.AtikshAPI.saveConfig === 'function') {
      window.AtikshAPI.saveConfig(config);
    }
    return true;
  } catch (e) {
    console.error("Error saving site config:", e);
    return false;
  }
}
