	"use client";

	import Link from "next/link";
	import Image from "next/image";
	import { useState } from "react";
	import ThemeToggle from "./ThemeToggle";

	export default function Header() {
		const [open, setOpen] = useState(false);

		return (
			<header className="w-full bg-white">
				<div className="border-b border-rose-100">
					<div className="container mx-auto px-6 py-3 flex items-center justify-between">
						<div className="flex items-center gap-4">
							<Link href="/" className="flex items-center gap-3">
								<div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-300 to-rose-100 flex items-center justify-center">
									<span className="text-white font-bold">🐾</span>
								</div>
								<span className="text-2xl font-semibold text-rose-600">Furry Friends</span>
							</Link>
						</div>

						<nav className="hidden lg:flex gap-8 text-sm text-rose-600 font-medium">
							<Link href="#">Adopt</Link>
							<Link href="#">Rehome</Link>
							<Link href="#">Care Guide</Link>
							<Link href="/about">About Us</Link>
						</nav>

						<div className="flex items-center gap-4">
							<input placeholder="search ..." className="hidden md:block px-3 py-1 border border-rose-200 rounded-md text-sm" />
							<ThemeToggle />

							<div className="relative">
								<button onClick={() => setOpen((s) => !s)} className="flex items-center gap-2 border border-rose-200 px-3 py-1 rounded-full">
									<div className="w-7 h-7 rounded-full bg-rose-200 flex items-center justify-center text-rose-600 font-semibold">SS</div>
									<span className="text-sm text-rose-600 hidden md:inline">Samanta Smith</span>
								</button>

								{open && (
									<div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg py-2">
										<Link href="#" className="block px-4 py-2 text-sm text-rose-600 hover:bg-rose-50">Overview</Link>
										<Link href="#" className="block px-4 py-2 text-sm text-rose-600 hover:bg-rose-50">Profile</Link>
										<Link href="#" className="block px-4 py-2 text-sm text-rose-600 hover:bg-rose-50">Favourites</Link>
										<Link href="#" className="block px-4 py-2 text-sm text-rose-600 hover:bg-rose-50">Messages</Link>
										<Link href="/login" className="block px-4 py-2 text-sm text-rose-600 hover:bg-rose-50">Log Out</Link>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>

				<div className="bg-rose-50 h-10 flex items-center">
					<div className="container mx-auto px-6 text-sm text-white/80">Home</div>
				</div>
			</header>
		);
	}
    