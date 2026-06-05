'use client';

import { useState } from 'react';
import Input from '@/components/elements/Input';
import { DEFAULT_EPSILON } from '@/lib/constants';
import { clamp } from '@/lib/math';

const MAX_EPSILON = 20;
const MIN_EPSILON = 0;

type EpsilonSelectorProps = {
	initialVal?: number;
	onChange?: (epsilon: number) => void;
	title?: string;
};

export default function EpsilonSelector({
	initialVal = DEFAULT_EPSILON,
	onChange,
	title,
}: EpsilonSelectorProps) {
	const [inputValue, setInputValue] = useState(String(initialVal));

	// String state lets the field go empty while typing and
	// avoids leading zeros from an empty string becoming 0
	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const raw = e.target.value;
		setInputValue(raw);

		if (raw === '') return;

		const clamped = clamp(Number(raw), MIN_EPSILON, MAX_EPSILON);
		if (clamped !== Number(raw)) setInputValue(String(clamped));
		if (onChange) onChange(clamped);
	}

	// Commit a non-empty value when the user leaves an empty field
	function handleBlur() {
		if (inputValue === '') {
			const fallback = clamp(initialVal, MIN_EPSILON, MAX_EPSILON);
			setInputValue(String(fallback));
			if (onChange) onChange(fallback);
		}
	}

	return (
		<fieldset className="border-0 m-0 min-w-0 p-0">
			<legend className="text-xl font-bold md:text-2xl">
				{title || 'Tempo range'}
			</legend>
			<label htmlFor="epsilon-input" className="sr-only">
				Plus or minus
			</label>
			<div className="relative">
				<span
					aria-hidden="true"
					className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none select-none"
				>
					±
				</span>
				<Input
					className="w-full pl-6"
					id="epsilon-input"
					max={MAX_EPSILON}
					min={MIN_EPSILON}
					onBlur={handleBlur}
					onChange={handleChange}
					type="number"
					value={inputValue}
				/>
			</div>
		</fieldset>
	);
}
