import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useCallback } from "react";
import { Github, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	const navigate = useNavigate();
	const [githubUrl, setGithubUrl] = useState("");
	const [error, setError] = useState("");

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
				setError("Please enter a valid GitHub username or URL");
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
		<div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black flex items-center justify-center p-4 relative overflow-hidden">
			<div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 animate-pulse" />
			<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />

			<div className="relative z-10 w-full max-w-2xl">
				<div className="text-center mb-12">
					<div className="flex items-center justify-center gap-3 mb-6">
						<Github className="w-16 h-16 text-white" strokeWidth={1.5} />
					</div>
					<h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
						GitHub User
						<span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
							{" "}
							Viewer
						</span>
					</h1>
				</div>

				<form onSubmit={handleSubmit}>
						<div className="space-y-4">
							<div className="relative">
								<input
									type="text"
									value={githubUrl}
									onChange={(e) => {
										setGithubUrl(e.target.value);
										setError("");
									}}
									onKeyDown={handleKeyDown}
									placeholder="Enter GitHub username or URL..."
									className="w-full px-6 py-4 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
									autoFocus
								/>
								<button
									type="submit"
									className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
									disabled={!githubUrl.trim()}
								>
									<ArrowRight className="w-6 h-6" />
								</button>
							</div>

							{error && (
								<p className="text-red-400 text-sm flex items-center gap-2">
									<span className="inline-block w-1 h-1 rounded-full bg-red-400" />
									{error}
								</p>
							)}
						</div>
					</form>
			</div>
		</div>
	);
}
