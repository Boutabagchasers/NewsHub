/**
 * International Sources Utilities
 *
 * Helper functions for working with international news outlets
 */

/**
 * International Outlet Interface
 */
export interface InternationalOutlet {
  name: string;
  language: string;
  url: string;
  description: string;
  category: string;
}

/**
 * Country Interface
 */
export interface Country {
  name: string;
  code: string;
  flag: string;
  outlets: InternationalOutlet[];
}

/**
 * Region Interface
 */
export interface Region {
  name: string;
  countries: Country[];
}

/**
 * International Sources Data Structure
 */
export interface InternationalSourcesData {
  regions: Region[];
}

/**
 * Flattened outlet with country and region information
 */
export interface FlattenedOutlet extends InternationalOutlet {
  country: string;
  countryCode: string;
  countryFlag: string;
  region: string;
}

/**
 * Groups sources by region
 * @param data - International sources data
 * @returns Array of regions with their countries and outlets
 */
export function groupSourcesByRegion(data: InternationalSourcesData): Region[] {
  return data.regions;
}

/**
 * Filters sources by country
 * @param data - International sources data
 * @param countryCode - ISO country code (e.g., 'US', 'GB', 'JP')
 * @returns Array of outlets from the specified country
 */
export function filterByCountry(
  data: InternationalSourcesData,
  countryCode: string
): FlattenedOutlet[] {
  const results: FlattenedOutlet[] = [];

  data.regions.forEach((region) => {
    region.countries.forEach((country) => {
      if (country.code === countryCode) {
        country.outlets.forEach((outlet) => {
          results.push({
            ...outlet,
            country: country.name,
            countryCode: country.code,
            countryFlag: country.flag,
            region: region.name,
          });
        });
      }
    });
  });

  return results;
}

/**
 * Filters sources by language
 * @param data - International sources data
 * @param language - Language to filter by (e.g., 'English', 'Spanish')
 * @returns Array of outlets in the specified language
 */
export function filterByLanguage(
  data: InternationalSourcesData,
  language: string
): FlattenedOutlet[] {
  const results: FlattenedOutlet[] = [];

  data.regions.forEach((region) => {
    region.countries.forEach((country) => {
      country.outlets.forEach((outlet) => {
        if (outlet.language.toLowerCase() === language.toLowerCase()) {
          results.push({
            ...outlet,
            country: country.name,
            countryCode: country.code,
            countryFlag: country.flag,
            region: region.name,
          });
        }
      });
    });
  });

  return results;
}

/**
 * Filters sources by category
 * @param data - International sources data
 * @param category - Category to filter by (e.g., 'news', 'business', 'politics')
 * @returns Array of outlets in the specified category
 */
export function filterByCategory(
  data: InternationalSourcesData,
  category: string
): FlattenedOutlet[] {
  const results: FlattenedOutlet[] = [];

  data.regions.forEach((region) => {
    region.countries.forEach((country) => {
      country.outlets.forEach((outlet) => {
        if (outlet.category.toLowerCase() === category.toLowerCase()) {
          results.push({
            ...outlet,
            country: country.name,
            countryCode: country.code,
            countryFlag: country.flag,
            region: region.name,
          });
        }
      });
    });
  });

  return results;
}

/**
 * Searches international sources by name or description
 * @param data - International sources data
 * @param query - Search query string
 * @returns Array of matching outlets
 */
export function searchInternationalSources(
  data: InternationalSourcesData,
  query: string
): FlattenedOutlet[] {
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) return getAllSources(data);

  const results: FlattenedOutlet[] = [];

  data.regions.forEach((region) => {
    region.countries.forEach((country) => {
      country.outlets.forEach((outlet) => {
        const matchesName = outlet.name.toLowerCase().includes(lowerQuery);
        const matchesDescription = outlet.description.toLowerCase().includes(lowerQuery);
        const matchesCountry = country.name.toLowerCase().includes(lowerQuery);

        if (matchesName || matchesDescription || matchesCountry) {
          results.push({
            ...outlet,
            country: country.name,
            countryCode: country.code,
            countryFlag: country.flag,
            region: region.name,
          });
        }
      });
    });
  });

  return results;
}

/**
 * Gets all sources as a flattened array
 * @param data - International sources data
 * @returns Array of all outlets with country and region information
 */
export function getAllSources(data: InternationalSourcesData): FlattenedOutlet[] {
  const results: FlattenedOutlet[] = [];

  data.regions.forEach((region) => {
    region.countries.forEach((country) => {
      country.outlets.forEach((outlet) => {
        results.push({
          ...outlet,
          country: country.name,
          countryCode: country.code,
          countryFlag: country.flag,
          region: region.name,
        });
      });
    });
  });

  return results;
}

/**
 * Gets all unique languages available
 * @param data - International sources data
 * @returns Array of unique languages
 */
export function getAvailableLanguages(data: InternationalSourcesData): string[] {
  const languages = new Set<string>();

  data.regions.forEach((region) => {
    region.countries.forEach((country) => {
      country.outlets.forEach((outlet) => {
        languages.add(outlet.language);
      });
    });
  });

  return Array.from(languages).sort();
}

/**
 * Gets all unique categories available
 * @param data - International sources data
 * @returns Array of unique categories
 */
export function getAvailableCategories(data: InternationalSourcesData): string[] {
  const categories = new Set<string>();

  data.regions.forEach((region) => {
    region.countries.forEach((country) => {
      country.outlets.forEach((outlet) => {
        categories.add(outlet.category);
      });
    });
  });

  return Array.from(categories).sort();
}

/**
 * Gets all countries as a flattened array
 * @param data - International sources data
 * @returns Array of all countries with region information
 */
export function getAllCountries(
  data: InternationalSourcesData
): Array<Country & { region: string }> {
  const results: Array<Country & { region: string }> = [];

  data.regions.forEach((region) => {
    region.countries.forEach((country) => {
      results.push({
        ...country,
        region: region.name,
      });
    });
  });

  return results;
}

/**
 * Sorts outlets alphabetically by name
 * @param outlets - Array of outlets to sort
 * @returns Sorted array of outlets
 */
export function sortAlphabetically(outlets: FlattenedOutlet[]): FlattenedOutlet[] {
  return [...outlets].sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Sorts outlets by region then country
 * @param outlets - Array of outlets to sort
 * @returns Sorted array of outlets
 */
export function sortByRegion(outlets: FlattenedOutlet[]): FlattenedOutlet[] {
  return [...outlets].sort((a, b) => {
    const regionCompare = a.region.localeCompare(b.region);
    if (regionCompare !== 0) return regionCompare;

    const countryCompare = a.country.localeCompare(b.country);
    if (countryCompare !== 0) return countryCompare;

    return a.name.localeCompare(b.name);
  });
}

/**
 * Gets statistics about the international sources
 * @param data - International sources data
 * @returns Object with statistics
 */
export function getSourceStatistics(data: InternationalSourcesData): {
  totalRegions: number;
  totalCountries: number;
  totalOutlets: number;
  outletsByRegion: Record<string, number>;
  outletsByLanguage: Record<string, number>;
  outletsByCategory: Record<string, number>;
} {
  const stats = {
    totalRegions: data.regions.length,
    totalCountries: 0,
    totalOutlets: 0,
    outletsByRegion: {} as Record<string, number>,
    outletsByLanguage: {} as Record<string, number>,
    outletsByCategory: {} as Record<string, number>,
  };

  data.regions.forEach((region) => {
    stats.totalCountries += region.countries.length;
    stats.outletsByRegion[region.name] = 0;

    region.countries.forEach((country) => {
      stats.totalOutlets += country.outlets.length;
      stats.outletsByRegion[region.name] += country.outlets.length;

      country.outlets.forEach((outlet) => {
        // Count by language
        stats.outletsByLanguage[outlet.language] =
          (stats.outletsByLanguage[outlet.language] || 0) + 1;

        // Count by category
        stats.outletsByCategory[outlet.category] =
          (stats.outletsByCategory[outlet.category] || 0) + 1;
      });
    });
  });

  return stats;
}
