import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useCallback } from "react";
import { ArrowRight, Search, Command, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	const navigate = useNavigate();
	const [githubUrl, setGithubUrl] = useState("");
	const [error, setError] = useState("");
	const [isFocused, setIsFocused] = useState(false);

	const extractUsername = useCallback((url: string): string | null => {
		const trimmed = url.trim();
		if (trimmed && !trimmed.includes("/") && !trimmed.includes(".")) {
			return trimmed;
		}

		const patterns = [
			/github\.com\/([^\/\?#]+)/i,
			/^@?([a-z0-9](?:[a-z0-9]|-(?=[a-z0-9])){0,38})$/i,
		];
		for (const pattern of patterns) {
			const match = trimmed.match(pattern);
			if (match && match[1]) {
				return match[1];
			}
		}

		return null;
	}, []);

	const handleSubmit = useCallback(
		(e?: React.FormEvent) => {
			e?.preventDefault();
			setError("");

			const username = extractUsername(githubUrl);
			if (!username) {
				setError("Please enter a valid GitHub username");
				return;
			}

			navigate({ to: "/details/$username", params: { username } });
		},
		[githubUrl, extractUsername, navigate],
	);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.key === "Enter") {
				handleSubmit();
			}
		},
		[handleSubmit],
	);

	return (
		<div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
			<div className="relative z-10 w-full max-w-[600px] flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
				<div className="mb-8 animate-bounce duration-[3000ms]">
					<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-lg shadow-black/20">
						<Sparkles className="w-3.5 h-3.5 text-white" />
						<span className="text-xs font-medium text-white tracking-wide uppercase">
							Next-Gen Viewer
						</span>
					</div>
				</div>

				<h1 className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 mb-6 text-center tracking-tight leading-none">
					GitHub <br />
					Explorer.
				</h1>

				<p className="text-zinc-400 text-lg md:text-xl text-center max-w-md mb-12 leading-relaxed">
					Navigate the GitHub universe with
					<span className="text-white font-medium"> zero latency</span>.
					Designed for power users.
				</p>

				<div className="w-full relative group perspective-1000">
					<div
						className={`absolute -inset-1 bg-gradient-to-r from-white/20 via-white/10 to-white/20 rounded-2xl blur-xl transition-opacity duration-500 ${isFocused ? "opacity-100" : "opacity-0"}`}
					/>

					<form
						onSubmit={handleSubmit}
						className={`relative w-full glass-card rounded-2xl p-1 transition-transform duration-300 ${isFocused ? "scale-[1.02]" : ""}`}
					>
						<div className="relative flex items-center">
							<div className="absolute left-4 text-zinc-500">
								<Search
									className={`w-5 h-5 transition-colors duration-300 ${isFocused ? "text-white" : ""}`}
								/>
							</div>

							<input
								type="text"
								value={githubUrl}
								onChange={(e) => {
									setGithubUrl(e.target.value);
									setError("");
								}}
								onFocus={() => setIsFocused(true)}
								onBlur={() => setIsFocused(false)}
								onKeyDown={handleKeyDown}
								placeholder="Search by username or URL..."
								className="w-full h-14 pl-12 pr-14 bg-transparent text-white placeholder-zinc-600 focus:outline-none text-lg font-medium rounded-xl"
								autoFocus
							/>

							<div className="absolute right-2">
								{githubUrl.trim() ? (
									<button
										type="submit"
										className="p-2 bg-white text-black rounded-lg hover:scale-95 active:scale-90 transition-transform duration-200 shadow-lg shadow-white/20"
									>
										<ArrowRight className="w-4 h-4" />
									</button>
								) : (
									<div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-zinc-800/50 border border-zinc-700/50 text-zinc-500 text-xs font-mono">
										<Command className="w-3 h-3" />
										<span>K</span>
									</div>
								)}
							</div>
						</div>
					</form>
				</div>

				<div className="h-8 mt-4 flex items-center justify-center">
					{error && (
						<div className="flex items-center gap-2 text-red-400 text-sm animate-in fade-in slide-in-from-top-2 duration-300">
							<div className="w-1.5 h-1.5 rounded-full bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.5)]" />
							{error}
						</div>
					)}
				</div>

				<div className="mt-8 flex flex-wrap justify-center gap-3">
					{["tannerlinsley", "tj", "sindresorhus", "shadcn"].map(
						(username, i) => (
							<button
								key={username}
								type="button"
								onClick={() => {
									setGithubUrl(username);
									setError("");
								}}
								className="group relative px-4 py-2 rounded-full bg-zinc-900/30 border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800/50 transition-all duration-300"
								style={{ animationDelay: `${i * 100}ms` }}
							>
								<div className="flex items-center gap-2">
									<img
										src={`https://github.com/${username}.png`}
										alt={username}
										className="w-4 h-4 rounded-full grayscale group-hover:grayscale-0 transition-all duration-300"
									/>
									<span className="text-sm text-zinc-400 group-hover:text-white transition-colors">
										{username}
									</span>
								</div>
							</button>
						),
					)}
				</div>
			</div>

			<div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none z-20" />
		</div>
	);
}
