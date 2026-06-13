import { act, renderHook } from '@testing-library/react';
import { Track } from '@/models/rhythmRun';
import { useTrackSelection } from './useTrackSelection';

function makeTrack(id: string): Track {
	return { artists: [], id, title: id };
}

const TRACKS = ['00', '01', '02'].map(makeTrack);

it('Starts with no selected IDs', () => {
	const { result } = renderHook(() => useTrackSelection(TRACKS));
	expect(result.current.selectedIds.size).toBe(0);
});

it('Starts with no selected tracks', () => {
	const { result } = renderHook(() => useTrackSelection(TRACKS));
	expect(result.current.selectedTracks).toEqual([]);
});

it('Toggles a track ID into the selected set', () => {
	const { result } = renderHook(() => useTrackSelection(TRACKS));
	act(() => result.current.toggle('00'));
	expect(result.current.selectedIds.has('00')).toBe(true);
});

it('Toggles a track ID back out of the selected set', () => {
	const { result } = renderHook(() => useTrackSelection(TRACKS));
	act(() => result.current.toggle('00'));
	act(() => result.current.toggle('00'));
	expect(result.current.selectedIds.has('00')).toBe(false);
});

it('Derives selectedTracks from selectedIds', () => {
	const { result } = renderHook(() => useTrackSelection(TRACKS));
	act(() => result.current.toggle('01'));
	expect(result.current.selectedTracks).toEqual([makeTrack('01')]);
});

it('Clears all selected IDs', () => {
	const { result } = renderHook(() => useTrackSelection(TRACKS));
	act(() => result.current.toggle('00'));
	act(() => result.current.toggle('01'));
	act(() => result.current.clear());
	expect(result.current.selectedIds.size).toBe(0);
});

it('Clears derived selectedTracks when cleared', () => {
	const { result } = renderHook(() => useTrackSelection(TRACKS));
	act(() => result.current.toggle('00'));
	act(() => result.current.clear());
	expect(result.current.selectedTracks).toEqual([]);
});

it('Returns empty selectedTracks when tracks is null', () => {
	const { result } = renderHook(() => useTrackSelection(null));
	act(() => result.current.toggle('00'));
	expect(result.current.selectedTracks).toEqual([]);
});
