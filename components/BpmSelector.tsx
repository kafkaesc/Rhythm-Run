'use client';

import { useRef, useState } from 'react';
import Input from '@/components/elements/Input';
import { DEFAULT_BPM } from '@/lib/constants';
import { clamp } from '@/lib/math';

const MAX_BPM = 220;
const MIN_BPM = 60;

type BpmSelectorProps = {
	initialVal?: number;
	onChange?: (bpm: number) => void;
	title?: string;
};

/**
 * Slider and number input for selecting a target BPM within a fixed range.
 *
 * @param initialVal - Optional initial BPM value, defaults to DEFAULT_BPM
 * @param onChange - Callback fired when the BPM value changes
 * @param title - Overrides the default fieldset legend
 */
export default function BpmSelector({
	initialVal = DEFAULT_BPM,
	onChange,
	title,
}: BpmSelectorProps) {
	const [bpm, setBpm] = useState(initialVal);
	const [inputValue, setInputValue] = useState(String(initialVal));
	const commitNextChangeRef = useRef(false);

	// Native range input uses CSS accent-color which delegates rendering
	// to the browser, so the color won't match other UI elements. Instead
	// we pass the fillPercent as a CSS variable and use it in a gradient
	// on the track.
	const fillPercent = ((bpm - MIN_BPM) / (MAX_BPM - MIN_BPM)) * 100;

	// Clamps value to the valid BPM range, then syncs
	// the slider, number input, and onChange callback
	function commitValue(value: number) {
		const clamped = clamp(value, MIN_BPM, MAX_BPM);
		setBpm(clamped);
		setInputValue(String(clamped));
		onChange?.(clamped);
	}

	// Commits the typed value on blur, or resets the input to
	// the last valid BPM if the blur value is invalid
	function handleInputBlur() {
		const parsed = Number(inputValue);
		if (!isNaN(parsed) && inputValue !== '') {
			commitValue(parsed);
		} else {
			setInputValue(String(bpm));
		}
	}

	// Updates the display value on every keystroke, and
	// commits immediately if the change was triggered by an arrow key
	function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
		setInputValue(e.target.value);
		if (commitNextChangeRef.current) {
			commitNextChangeRef.current = false;
			const parsed = Number(e.target.value);
			if (!isNaN(parsed) && e.target.value !== '') {
				commitValue(parsed);
			}
		}
	}

	// Flags arrow key presses so the next change event commits,
	// and triggers a commit immediately on Enter
	function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
			commitNextChangeRef.current = true;
		} else if (e.key === 'Enter') {
			handleInputBlur();
		}
	}

	return (
		<fieldset className="border-0 m-0 min-w-0 p-0">
			<legend className="text-xl font-bold md:text-2xl">
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
					onChange={(e) => commitValue(Number(e.target.value))}
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
					onBlur={handleInputBlur}
					onChange={handleInputChange}
					onKeyDown={handleInputKeyDown}
					type="number"
					value={inputValue}
				/>
			</div>
		</fieldset>
	);
}
