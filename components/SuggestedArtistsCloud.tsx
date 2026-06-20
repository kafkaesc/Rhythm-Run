'use client';

import { useState, useEffect, useRef } from 'react';
import A from '@/components/elements/A';
import Button from '@/components/elements/Button';
import Label from '@/components/elements/Label';
import { useSpotifyTopArtists } from '@/hooks/useSpotifyTopArtists';
import { useSuggestedArtistCloudFocus } from '@/hooks/useSuggestedArtistCloudFocus';
import { MAX_SEARCH_ARTISTS } from '@/lib/constants';
import { fetchArtistByName } from '@/lib/lastfm';
import { LfmArtist } from '@/models/lastFm';
import { SpotifyArtist } from '@/models/spotify';

const CLOUD_SIZE = 8;

type ErrorDisplayProps = Readonly<{
	lookupError?: string | null;
	spotifyError?: string | boolean | null;
}>;

/**
 * Displays Spotify or lookup errors, holds space if none present
 *
 * @param lookupError - Optional, null if no error, string is an error message from the Last.fm artist lookup
 * @param spotifyError - Optional, null if no error, string is an error from the Spotify top artists fetch
 */
function ErrorDisplay({ spotifyError, lookupError }: ErrorDisplayProps) {
	const hasError = spotifyError || lookupError;
	return (
		<p aria-live="polite" className="text-xs leading-none text-danger py-0.5">
			{spotifyError && 'Could not load Spotify artists'}
			{lookupError}
			{!hasError && '\u00A0'}
		</p>
	);
}

type CallbackCloudItemProps = Readonly<{
	artist: SpotifyArtist;
	isDisabled?: boolean;
	isLoading?: boolean;
	label: string;
	onClick: () => void;
}>;

/**
 * Renders a suggested artist as a clickable button
 *
 * @param artist - The Spotify artist to display
 * @param isDisabled - Optional, true if the button is disabled
 * @param isLoading - Optional, true if the artist is mid-fetch; shows a wait cursor
 * @param label - The aria-label for the button
 * @param onClick - Callback invoked when the button is clicked
 */
function CallbackCloudItem({
	artist,
	isDisabled,
	isLoading,
	label,
	onClick,
}: CallbackCloudItemProps) {
	return (
		<li>
			<Button
				aria-label={label}
				buttonStyle="text"
				className={isLoading ? 'disabled:cursor-wait' : undefined}
				disabled={isDisabled}
				onClick={onClick}
				type="button"
			>
				{artist.name}
			</Button>
		</li>
	);
}

type SuggestedArtistsCloudProps = Readonly<{
	isFull?: boolean;
	onSelect?: (artist: LfmArtist) => void;
}>;

/**
 * Renders a random list of artists from the user's Spotify top 50.
 * Clicking an artist enriches it with Last.fm data and calls onSelect.
 * The selected artist is removed and replaced by a new one from
 * the remaining top 50.
 *
 * @param isFull - True if the max number of artists has been selected
 * @param onSelect - Callback invoked on the selected and enriched artist
 */
export default function SuggestedArtistsCloud({
	isFull,
	onSelect,
}: SuggestedArtistsCloudProps) {
	const {
		artists: allArtists,
		error: spotifyError,
		getRandomSpotifyTopArtists,
		loading,
	} = useSpotifyTopArtists();
	const [suggested, setSuggested] = useState<SpotifyArtist[]>([]);
	const [loadingIds, setLoadingIds] = useState<string[]>([]);
	const [lookupError, setLookupError] = useState<string | null>(null);
	const initialized = useRef(false);
	const { listRef, pendingFocusIndexRef } =
		useSuggestedArtistCloudFocus(suggested);

	useEffect(() => {
		// Initialize once when artists are available, otherwise skip out
		if (initialized.current || !allArtists || allArtists.length === 0) return;

		// Mark as initialized and populate with a random slice of the top artists
		initialized.current = true;
		setSuggested(getRandomSpotifyTopArtists(CLOUD_SIZE));
	}, [allArtists, getRandomSpotifyTopArtists]);

	// Avoid flashing an empty state while Spotify data loads
	if (loading) return null;
	// Hide the section entirely when the user has no Spotify connection
	if (!spotifyError && suggested.length === 0) return null;

	/**
	 * Returns the aria-label for an artist button based on the current state
	 *
	 * @param artist - The {@link SpotifyArtist} to build a label for
	 */
	function buildCloudArtistLabel(artist: SpotifyArtist): string {
		if (isFull)
			return `The maximum of ${MAX_SEARCH_ARTISTS} artists has already been selected`;

		if (loadingIds.includes(artist.id)) return `Loading ${artist.name}`;

		return `Add ${artist.name} to selected artists`;
	}

	/**
	 * Enriches the Spotify artist with Last.fm data.
	 * Then passes it to the onSelect function.
	 * Then replaces it with a new suggested artist in the cloud
	 *
	 * @param artist - The {@link SpotifyArtist} to enrich and select
	 */
	async function handleSelect(artist: SpotifyArtist) {
		// Don't run if this artist is mid-fetch, no callback function,
		// or the caller component is full
		if (!onSelect || isFull || loadingIds.includes(artist.id)) return;

		// Get future focus target before any state changes or async operations
		const selectedIndex = suggested.findIndex((ar) => ar.id === artist.id);
		pendingFocusIndexRef.current = Math.max(0, selectedIndex - 1);

		// Reset any errors from a previous call and mark the artist as loading
		setLookupError(null);
		setLoadingIds((prev) => [...prev, artist.id]);

		try {
			const lastFmArtist = await fetchArtistByName(artist.name);
			if (lastFmArtist) {
				onSelect(lastFmArtist);

				// Remove the selected artist and replace it with a random one from
				// a pool of unused artists from the user's top 50 favorites
				setSuggested((prev) => {
					const remaining = prev.filter((ar) => ar.id !== artist.id);
					const pool = (allArtists ?? []).filter(
						(ar) => !prev.some((ar2) => ar2.id === ar.id),
					);

					if (pool.length === 0) return remaining;

					const replacement = pool[Math.floor(Math.random() * pool.length)];
					return [...remaining, replacement];
				});
			} else {
				pendingFocusIndexRef.current = null;
				setLookupError('Artist details could not be found');
			}
		} catch {
			pendingFocusIndexRef.current = null;
			setLookupError('Search failed, please try again');
		} finally {
			// Success or error: remove the artist from the loading list
			setLoadingIds((prev) => prev.filter((i) => i !== artist.id));
		}
	}

	return (
		<div>
			<Label className="mb-0">Suggested artists</Label>
			<ErrorDisplay lookupError={lookupError} spotifyError={spotifyError} />
			{suggested.length > 0 && (
				<ul className="flex flex-wrap gap-x-3 gap-y-2" ref={listRef}>
					{suggested.map((artist) =>
						onSelect ? (
							<CallbackCloudItem
								artist={artist}
								isDisabled={isFull || loadingIds.includes(artist.id)}
								isLoading={loadingIds.includes(artist.id)}
								key={artist.id}
								label={buildCloudArtistLabel(artist)}
								onClick={() => handleSelect(artist)}
							/>
						) : (
							<li key={artist.id}>
								<A href={artist.external_urls.spotify}>{artist.name}</A>
							</li>
						),
					)}
				</ul>
			)}
		</div>
	);
}
