"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
	const [dark, setDark] = useState<boolean>(false);

	useEffect(() => {
		const isDark = document.documentElement.classList.contains("dark");
		setDark(isDark);
	}, []);

	function toggle() {
		const root = document.documentElement;
		if (root.classList.contains("dark")) {
			root.classList.remove("dark");
			setDark(false);
		} else {
			root.classList.add("dark");
			setDark(true);
		}
	}

	return (
		<button onClick={toggle} className="p-2 rounded-md border border-rose-100">
			{dark ? (
				<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-300" viewBox="0 0 20 20" fill="currentColor">
					<path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zM4.22 4.22a1 1 0 011.42 0l.71.7a1 1 0 11-1.42 1.42l-.71-.7a1 1 0 010-1.42zM2 10a1 1 0 011-1h1a1 1 0 110 2H3a1 1 0 01-1-1z" />
				</svg>
			) : (
				<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rose-400" viewBox="0 0 20 20" fill="currentColor">
					<path d="M17.293 13.293A8 8 0 116.707 2.707a7 7 0 0010.586 10.586z" />
				</svg>
			)}
		</button>
	);
}
