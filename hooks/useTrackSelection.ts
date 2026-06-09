'use client';

import { useState, useCallback } from 'react';
import { Track } from '@/models/rhythmRun';

/**
 * Manages a toggleable set of selected track IDs and derives the
 * selected tracks from a given track list.
 *
 * @param tracks - The full track list to derive selected tracks from
 */
export function useTrackSelection(tracks: Track[] | null) {
	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

	const clear = useCallback(() => setSelectedIds(new Set()), []);

	const toggle = useCallback((id: string) => {
		setSelectedIds((prev) => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});
	}, []);

	const selectedTracks = (tracks ?? []).filter((t) => selectedIds.has(t.id));

	return { selectedIds, selectedTracks, toggle, clear };
}
