export const SPOTIFY_ACCOUNTS_ENDPOINT =
	'https://accounts.spotify.com/api/token';

// https://developer.spotify.com/documentation/web-api
export const SPOTIFY_BASE_URL = 'https://api.spotify.com/v1';
export const SPOTIFY_RECOMMENDATIONS_ENDPOINT = `${SPOTIFY_BASE_URL}/recommendations`;
export const SPOTIFY_SEARCH_ENDPOINT = `${SPOTIFY_BASE_URL}/search`;
export const SPOTIFY_TOP_ARTISTS_ENDPOINT = `${SPOTIFY_BASE_URL}/me/top/artists`;

export const SPOTIFY_RECOMMENDATIONS_LIMIT = '10';
export const SPOTIFY_SEARCH_LIMIT = '10'; // Spotify API won't allow more than 10
export const SPOTIFY_TOP_ARTIST_LIMIT = 50;
