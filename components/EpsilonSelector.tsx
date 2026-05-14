'use client';

import { useState } from 'react';
import Input from '@/components/elements/Input';
import { DEFAULT_EPSILON } from '@/lib/constants';
import { clamp } from '@/lib/math';

const MAX_EPSILON = 20;
const MIN_EPSILON = 0;

type EpsilonSelectorProps = {
	onChange?: (epsilon: number) => void;
	title?: string;
};

export default function EpsilonSelector({
	onChange,
	title,
}: EpsilonSelectorProps) {
	const [epsilon, setEpsilon] = useState(DEFAULT_EPSILON);

	function handleChange(value: number) {
		const clampValue = clamp(value, MIN_EPSILON, MAX_EPSILON);
		setEpsilon(clampValue);
		onChange?.(clampValue);
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
					onChange={(e) => handleChange(Number(e.target.value))}
					type="number"
					value={epsilon}
				/>
			</div>
		</fieldset>
	);
}
