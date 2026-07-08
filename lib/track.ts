import { Track } from '@/models/rhythmRun';

/**
 * Type guard that verifies an unknown value matches the {@link Track} shape.
 * Use it to validate data parsed from an untrusted source (e.g., a JSON stream)
 * before treating it as a Track. Checks the required fields only: a string id,
 * a string title, and an artists array of strings.
 *
 * @param value - A parsed but unverified value
 * @returns True if value has the required Track fields
 */
export function isTrack(value: unknown): value is Track {
	if (typeof value !== 'object' || value === null) return false;

	const record = value as Record<string, unknown>;
	if (typeof record.id !== 'string') return false;
	if (typeof record.title !== 'string') return false;
	if (!Array.isArray(record.artists)) return false;

	return record.artists.every((artist) => typeof artist === 'string');
}
