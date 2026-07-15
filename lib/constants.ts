export const DEFAULT_BPM = 160;
export const DEFAULT_EPSILON = 4;
export const MAX_SEARCH_ARTISTS = 5;

export const CACHE_MAX_KEYS = 512;
export const CACHE_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days
export const NO_TEMPO_CACHE_MAX_KEYS = 4096;
export const NO_TEMPO_CACHE_TTL_SECONDS = 30 * 24 * 60 * 60; // 30 days

interface SiteMapEntry {
	display: boolean;
	href: string;
	name: string;
}

export const SITE_MAP: Record<string, SiteMapEntry> = {
	home: { display: true, href: '/', name: 'Home' },
	about: { display: true, href: '/about', name: 'About' },
};
