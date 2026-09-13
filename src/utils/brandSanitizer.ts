/**
 * QAVELLE Brand Sanitization Engine
 * 
 * Automatically intercepts, sanitizes, and replaces all third-party marketplace,
 * supplier, dropshipper, and manufacturer brand names (such as Meesho, Allure,
 * GlowRoad, Shopsy, Flipkart, Amazon, IndiaMART, etc.) across the entire website
 * to prevent reselling conflicts and protect QAVELLE brand exclusivity.
 */

export interface BrandReplacementRule {
  pattern: RegExp;
  replacement: string | ((match: string, ...args: any[]) => string);
  description: string;
}

// Comprehensive brand registry of prohibited supplier, marketplace, and competitor names
export const PROHIBITED_BRAND_PATTERNS: BrandReplacementRule[] = [
  // Allure variants -> Royal
  {
    pattern: /\bAllure\s+Elegant\b/gi,
    replacement: (match) => {
      if (match === match.toUpperCase()) return 'ROYAL ELEGANT';
      return 'Royal Elegant';
    },
    description: 'Allure Elegant to Royal Elegant',
  },
  {
    pattern: /\bAllure\s+Gold\b/gi,
    replacement: (match) => {
      if (match === match.toUpperCase()) return 'ROYAL GOLD';
      return 'Royal Gold';
    },
    description: 'Allure Gold to Royal Gold',
  },
  {
    pattern: /\bAllure\s+Jewell?ery\b/gi,
    replacement: (match) => {
      if (match === match.toUpperCase()) return 'QAVELLE ROYAL JEWELLERY';
      return 'QAVELLE Royal Jewellery';
    },
    description: 'Allure Jewellery to QAVELLE Royal Jewellery',
  },
  {
    pattern: /\bAllure\s+Jewels?\b/gi,
    replacement: 'QAVELLE Jewels',
    description: 'Allure Jewels to QAVELLE Jewels',
  },
  {
    pattern: /\bAllure\b/gi,
    replacement: (match) => {
      if (match === match.toUpperCase()) return 'ROYAL';
      return 'Royal';
    },
    description: 'Allure to Royal',
  },

  // Meesho and Meesho-affiliated supplier terminology -> QAVELLE / Direct Atelier
  {
    pattern: /\bmeesho\.com\b/gi,
    replacement: 'qavelle.com',
    description: 'Meesho domain to Qavelle domain',
  },
  {
    pattern: /\bmeesho\s+reseller\b/gi,
    replacement: 'Authorized QAVELLE Store',
    description: 'Meesho reseller to Authorized QAVELLE Store',
  },
  {
    pattern: /\bmeesho\s+supplier\b/gi,
    replacement: 'QAVELLE Master Artisan',
    description: 'Meesho supplier to QAVELLE Master Artisan',
  },
  {
    pattern: /\bmeesho\s+delivery\b/gi,
    replacement: 'QAVELLE Express Courier',
    description: 'Meesho delivery to QAVELLE Express Courier',
  },
  {
    pattern: /\bmeesho\s+order\b/gi,
    replacement: 'QAVELLE Order',
    description: 'Meesho order to QAVELLE Order',
  },
  {
    pattern: /\bmeesho\s+app\b/gi,
    replacement: 'QAVELLE Official Store',
    description: 'Meesho app to QAVELLE Official Store',
  },
  {
    pattern: /\bmeesho\b/gi,
    replacement: (match) => {
      if (match === match.toUpperCase()) return 'QAVELLE';
      return 'QAVELLE';
    },
    description: 'Meesho to QAVELLE',
  },
  {
    pattern: /\bfashnear\s*(technologies)?\b/gi,
    replacement: 'QAVELLE Artisans',
    description: 'Fashnear to QAVELLE Artisans',
  },

  // Other Reselling & Wholesale Platforms
  {
    pattern: /\bglowroad\b/gi,
    replacement: 'QAVELLE',
    description: 'GlowRoad to QAVELLE',
  },
  {
    pattern: /\bshopsy\b/gi,
    replacement: 'QAVELLE',
    description: 'Shopsy to QAVELLE',
  },
  {
    pattern: /\bindiamart\b/gi,
    replacement: 'Certified Artisan Network',
    description: 'IndiaMART to Certified Artisan Network',
  },
  {
    pattern: /\btradeindia\b/gi,
    replacement: 'Artisan Workshop',
    description: 'TradeIndia to Artisan Workshop',
  },
  {
    pattern: /\budaan\b/gi,
    replacement: 'Direct Foundry',
    description: 'Udaan to Direct Foundry',
  },
  {
    pattern: /\bshopclues\b/gi,
    replacement: 'QAVELLE',
    description: 'ShopClues to QAVELLE',
  },
  {
    pattern: /\bsnapdeal\b/gi,
    replacement: 'QAVELLE',
    description: 'Snapdeal to QAVELLE',
  },
  {
    pattern: /\baliexpress\b/gi,
    replacement: 'International Atelier',
    description: 'AliExpress to International Atelier',
  },
  {
    pattern: /\bdhgate\b/gi,
    replacement: 'Direct Artisan',
    description: 'DHgate to Direct Artisan',
  },
  {
    pattern: /\btemu\b/gi,
    replacement: 'Direct Studio',
    description: 'Temu to Direct Studio',
  },
  {
    pattern: /\bshein\b/gi,
    replacement: 'QAVELLE Couture',
    description: 'Shein to QAVELLE Couture',
  },

  // Generic Supplier & Reseller terms in product descriptions / reviews that leak dropshipping
  {
    pattern: /\b(supplier|vendor)\s+packaging\b/gi,
    replacement: 'Luxury QAVELLE Velvet Box',
    description: 'Supplier packaging to Luxury QAVELLE Velvet Box',
  },
  {
    pattern: /\bmanufacturer\s+warranty\b/gi,
    replacement: 'QAVELLE Anti-Tarnish Lifetime Guarantee',
    description: 'Manufacturer warranty to QAVELLE Guarantee',
  },
  {
    pattern: /\b(dropship|drop-ship|reseller|reselling)\b/gi,
    replacement: 'Official Brand Store',
    description: 'Dropship references to Official Brand Store',
  },

  // Competing Indian artificial jewellery manufacturer brands that might appear in copied product copy
  {
    pattern: /\bsukkhi\b/gi,
    replacement: 'QAVELLE Royal',
    description: 'Sukkhi to QAVELLE Royal',
  },
  {
    pattern: /\bzaveri\s+pearls\b/gi,
    replacement: 'QAVELLE Heritage Pearls',
    description: 'Zaveri Pearls to QAVELLE Heritage Pearls',
  },
  {
    pattern: /\byoubella\b/gi,
    replacement: 'QAVELLE',
    description: 'YouBella to QAVELLE',
  },
  {
    pattern: /\byellow\s+chimes\b/gi,
    replacement: 'QAVELLE Fine Craft',
    description: 'Yellow Chimes to QAVELLE Fine Craft',
  },
  {
    pattern: /\bvoylla\b/gi,
    replacement: 'QAVELLE',
    description: 'Voylla to QAVELLE',
  },
  {
    pattern: /\bshining\s+diva\b/gi,
    replacement: 'QAVELLE Lustre',
    description: 'Shining Diva to QAVELLE Lustre',
  },
  {
    pattern: /\bzeneme\b/gi,
    replacement: 'QAVELLE',
    description: 'Zeneme to QAVELLE',
  },
  {
    pattern: /\bi\s*jewels\b/gi,
    replacement: 'QAVELLE Jewels',
    description: 'I Jewels to QAVELLE Jewels',
  },
];

/**
 * Sanitizes any raw string by replacing all prohibited third-party brand names.
 */
export function sanitizeText(text: string | undefined | null): string {
  if (!text) return '';
  let sanitized = String(text);

  for (const rule of PROHIBITED_BRAND_PATTERNS) {
    if (typeof rule.replacement === 'function') {
      sanitized = sanitized.replace(rule.pattern, rule.replacement as any);
    } else {
      sanitized = sanitized.replace(rule.pattern, rule.replacement);
    }
  }

  // Clean up any double spaces or awkward spacing created by substitutions
  return sanitized.replace(/\s{2,}/g, ' ').trim();
}

/**
 * Checks if a string contains any prohibited brand or supplier name.
 */
export function containsProhibitedBrand(text: string | undefined | null): boolean {
  if (!text) return false;
  const str = String(text);
  return PROHIBITED_BRAND_PATTERNS.some((rule) => rule.pattern.test(str));
}

/**
 * Sanitizes search queries so typing "meesho" or "allure" gracefully matches
 * relevant royal jewellery products without displaying the competitor brand name.
 */
export function sanitizeSearchQuery(query: string): {
  sanitizedQuery: string;
  originalQuery: string;
  isAliased: boolean;
} {
  const trimmed = (query || '').trim();
  const lower = trimmed.toLowerCase();
  
  if (lower.includes('allure')) {
    return {
      sanitizedQuery: trimmed.replace(/allure/gi, 'Royal'),
      originalQuery: trimmed,
      isAliased: true,
    };
  }

  if (lower.includes('meesho')) {
    return {
      sanitizedQuery: trimmed.replace(/meesho/gi, 'Qavelle'),
      originalQuery: trimmed,
      isAliased: true,
    };
  }

  return {
    sanitizedQuery: trimmed,
    originalQuery: trimmed,
    isAliased: false,
  };
}

/**
 * Deeply traverses any object, array, or primitive to sanitize all strings.
 */
export function sanitizeDeep<T>(item: T): T {
  if (item === null || item === undefined) return item;

  if (typeof item === 'string') {
    return sanitizeText(item) as unknown as T;
  }

  if (Array.isArray(item)) {
    return item.map((el) => sanitizeDeep(el)) as unknown as T;
  }

  if (typeof item === 'object') {
    const copy: Record<string, any> = {};
    for (const [key, value] of Object.entries(item)) {
      // Don't modify keys, only values
      copy[key] = sanitizeDeep(value);
    }
    return copy as T;
  }

  return item;
}
