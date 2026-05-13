'use client';

import { useEffect, useState } from 'react';

// DOT_INTERVAL should always be 1/4th the MESSAGE_INTERVAL
// Not calculating to avoid any potential floaty business
const DOT_INTERVAL = 512;
const MESSAGE_INTERVAL = 2048;

const dots = [' ', '.', '..', '...'];

const messages = [
	'Lacing up',
	'Running the track',
	'Feeding the hunger artist',
	'Following the metronome',
];

/**
 * Animates through a set of loading messages with an animated ... indicator
 */
export default function LoadingMessages() {
	const [msgIndex, setMsgIndex] = useState(0);
	const [dotIndex, setDotIndex] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setMsgIndex((i) => (i + 1) % messages.length);
		}, MESSAGE_INTERVAL);
		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		const interval = setInterval(() => {
			setDotIndex((i) => (i + 1) % dots.length);
		}, DOT_INTERVAL);
		return () => clearInterval(interval);
	}, []);

	return (
		<span>
			<span key={msgIndex} className="animate-slide-in inline-block">
				{messages[msgIndex]}
				<span className="inline-block w-[2ch] text-left">{dots[dotIndex]}</span>
			</span>
		</span>
	);
}
