import { Helmet } from "react-helmet-async";

interface MetaTagsProps {
  title: string;
  description: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  noindex?: boolean;
  hreflang?: Array<{ lang: string; url: string }>;
  jsonLd?: object | object[];
}

const SITE_URL = "https://typex.arkio.in";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

export const MetaTags = ({
  title,
  description,
  canonical,
  ogTitle,
  ogDescription,
  ogImage = DEFAULT_OG_IMAGE,
  ogUrl,
  ogType = "website",
  twitterCard = "summary_large_image",
  twitterTitle,
  twitterDescription,
  twitterImage = DEFAULT_OG_IMAGE,
  noindex = false,
  hreflang,
  jsonLd,
}: MetaTagsProps) => {
  const fullCanonical = canonical ? `${SITE_URL}${canonical}` : SITE_URL;
  const fullOgUrl = ogUrl ? `${SITE_URL}${ogUrl}` : fullCanonical;

  // Format JSON-LD
  const jsonLdScripts = jsonLd
    ? Array.isArray(jsonLd)
      ? jsonLd.map((item, index) => (
          <script key={index} type="application/ld+json">
            {JSON.stringify(item)}
          </script>
        ))
      : [
          <script key="jsonld" type="application/ld+json">
            {JSON.stringify(jsonLd)}
          </script>,
        ]
    : null;

  return (
    <Helmet>
      {/* Basic Meta */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="author" content="Typex Team" />
      <meta name="theme-color" content="#09090f" />

      {/* Canonical */}
      <link rel="canonical" href={fullCanonical} />

      {/* Open Graph */}
      <meta property="og:title" content={ogTitle || title} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullOgUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Typex" />

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={twitterTitle || title} />
      <meta name="twitter:description" content={twitterDescription || description} />
      <meta name="twitter:image" content={twitterImage} />

      {/* Robots */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Hreflang */}
      {hreflang?.map(({ lang, url }) => (
        <link key={lang} rel="alternate" href={`${SITE_URL}${url}`} hrefLang={lang} />
      ))}

      {/* JSON-LD Structured Data */}
      {jsonLdScripts}
    </Helmet>
  );
};

// Predefined schemas
export const createWebApplicationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Typex — Free Typing Speed Test",
  url: "https://typex.arkio.in",
  description: "Free online typing speed test. Measure your WPM and accuracy.",
  applicationCategory: "EducationApplication",
  operatingSystem: "All",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "1240",
  },
});

export const createOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Typex",
  url: "https://typex.arkio.in",
  logo: "https://typex.arkio.in/logo.png",
});

export const createBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: `${SITE_URL}${item.url}`,
  })),
});

export const createArticleSchema = ({
  headline,
  author,
  datePublished,
  dateModified,
  image,
  publisher = "Typex",
}: {
  headline: string;
  author: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  publisher?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline,
  author: {
    "@type": "Person",
    name: author,
  },
  datePublished,
  dateModified: dateModified || datePublished,
  image: image || DEFAULT_OG_IMAGE,
  publisher: {
    "@type": "Organization",
    name: publisher,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/logo.png`,
    },
  },
});

export const createFAQSchema = (questions: Array<{ question: string; answer: string }>) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: questions.map((q) => ({
    "@type": "Question",
    name: q.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: q.answer,
    },
  })),
});

export default MetaTags;
