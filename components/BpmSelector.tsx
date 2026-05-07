'use client';

import { useState } from 'react';
import Input from '@/components/elements/Input';

const DEFAULT_BPM = 160;
const MAX_BPM = 220;
const MIN_BPM = 60;

// https://www.youtube.com/watch?v=sVOpqbJYXp8
function clamp(value: number) {
	return Math.min(MAX_BPM, Math.max(MIN_BPM, value));
}

type BpmSelectorProps = {
	onChange?: (bpm: number) => void;
	title?: string;
};

/**
 * Slider and number input for selecting a target BPM within a fixed range.
 *
 * @param onChange - Callback fired when the BPM value changes
 * @param title - Overrides the default fieldset legend
 */
export default function BpmSelector({ onChange, title }: BpmSelectorProps) {
	const [bpm, setBpm] = useState(DEFAULT_BPM);

	// Native range input uses CSS accent-color which delegates rendering
	// to the browser, so the color won't match other UI elements. Instead
	// we pass the fillPercent as a CSS variable and use it in a gradient
	// on the track.
	const fillPercent = ((bpm - MIN_BPM) / (MAX_BPM - MIN_BPM)) * 100;

	function handleChange(value: number) {
		const clampValue = clamp(value);
		setBpm(clampValue);
		onChange?.(clampValue);
	}

	return (
		<fieldset className="border-0 m-0 min-w-0 p-0">
			<legend className="text-2xl font-bold">
				{title || 'Select target tempo'}
			</legend>
			<div className="flex items-center gap-3">
				{/* The draggable slider for BPM */}
				<label htmlFor="bpm-range" className="sr-only">
					BPM slider
				</label>
				<input
					aria-controls="bpm-input"
					aria-valuetext={`${bpm} BPM`}
					className="flex-1 cursor-pointer"
					id="bpm-range"
					max={MAX_BPM}
					min={MIN_BPM}
					onChange={(e) => handleChange(Number(e.target.value))}
					// Is this worth it for the slider to match the rest of the UI? Maybe
					style={
						{
							['--range-fill' as string]: `${fillPercent}%`,
						} as React.CSSProperties
					}
					type="range"
					value={bpm}
				/>
				{/* Number input with up/down buttons */}
				<label htmlFor="bpm-input" className="sr-only">
					BPM value
				</label>
				<Input
					className="w-20"
					id="bpm-input"
					max={MAX_BPM}
					min={MIN_BPM}
					onChange={(e) => handleChange(Number(e.target.value))}
					type="number"
					value={bpm}
				/>
			</div>
		</fieldset>
	);
}
