import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ArrowLeft,
	ArrowRight,
	BookOpen,
	Building,
	ExternalLink,
	GitFork,
	Globe,
	Mail,
	MapPin,
	ShieldCheck,
	Star,
} from "lucide-react";

import { useTRPC } from "@/integrations/trpc/react";
import type { GitHubRepo } from "@/types/github.types";

export const Route = createFileRoute("/details/$username")({
	component: UserDetails,
	ssr: false,
	errorComponent: ({ error }) => (
		<div className="min-h-screen flex items-center justify-center p-4">
			<div className="max-w-md w-full glass-card rounded-2xl p-8 text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
				<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 text-red-400">
					<ShieldCheck className="w-8 h-8" />
				</div>
				<div>
					<h2 className="text-2xl font-bold text-white mb-2">User Not Found</h2>
					<p className="text-zinc-500 leading-relaxed">{error.message}</p>
				</div>
				<Link
					to="/"
					className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl hover:scale-105 active:scale-95 transition-all duration-200 font-medium shadow-lg shadow-white/10"
				>
					<ArrowLeft className="w-4 h-4" />
					Back to Search
				</Link>
			</div>
		</div>
	),
});

const getLanguageColor = (language: string | null) => {
	const colors: Record<string, string> = {
		TypeScript: "bg-blue-500",
		JavaScript: "bg-yellow-400",
		Python: "bg-green-500",
		Java: "bg-orange-500",
		Go: "bg-cyan-500",
		Rust: "bg-orange-200",
		PHP: "bg-purple-500",
		HTML: "bg-orange-600",
		CSS: "bg-blue-600",
		Vue: "bg-green-400",
		Swift: "bg-orange-400",
	};
	return colors[language || ""] || "bg-zinc-400";
};

function UserDetails() {
	const { username } = Route.useParams();
	const trpc = useTRPC();
	const userQuery = useQuery({
		...trpc.github.getUser.queryOptions({ username }),
		staleTime: 1000 * 60 * 5,
		gcTime: 1000 * 60 * 30,
		retry: 1,
	});

	const reposQuery = useQuery({
		...trpc.github.getUserRepos.queryOptions({
			username,
			sort: "updated",
			per_page: 6,
		}),
		staleTime: 1000 * 60 * 5,
		gcTime: 1000 * 60 * 30,
		retry: 1,
	});

	const user = userQuery.data;
	const repos = reposQuery.data;

	const isLoading = userQuery.isLoading || reposQuery.isLoading;
	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="flex flex-col items-center gap-6">
					<div className="relative w-16 h-16">
						<div className="absolute inset-0 rounded-full border-t-2 border-white animate-spin" />
						<div
							className="absolute inset-2 rounded-full border-t-2 border-white/40 animate-spin reverse"
							style={{ animationDirection: "reverse", animationDuration: "1s" }}
						/>
					</div>
					<p className="text-zinc-500 text-sm font-medium tracking-wide animate-pulse uppercase">
						Fetching Data...
					</p>
				</div>
			</div>
		);
	}

	if (!user) return null;

	return (
		<div className="min-h-screen p-6 md:p-12 lg:p-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
			<div className="max-w-7xl mx-auto">
				<div className="mb-12 flex items-center justify-between">
					<Link
						to="/"
						className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-zinc-400 hover:text-white transition-all duration-300 backdrop-blur-md"
					>
						<ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
						<span className="text-sm font-medium">Back</span>
					</Link>

					<div className="text-xs font-mono text-zinc-600">ID: {user.id}</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
					<div className="lg:col-span-4 space-y-8">
						<div className="glass-card rounded-3xl p-8 sticky top-8 transition-all duration-500 hover:shadow-[0_8px_40px_rgba(255,255,255,0.05)]">
							<div className="relative mx-auto w-40 h-40 mb-8 group">
								<div className="absolute inset-0 rounded-full bg-white/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
								<img
									src={user.avatar_url}
									alt={user.login}
									className="relative w-full h-full rounded-full border-2 border-white/10 shadow-2xl transform transition-transform duration-500 group-hover:scale-105"
								/>
								<div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 border-4 border-black rounded-full" />
							</div>

							<div className="text-center space-y-6">
								<div>
									<h1 className="text-3xl font-bold text-white tracking-tight mb-2">
										{user.name || user.login}
									</h1>
									<a
										href={user.html_url}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors duration-200"
									>
										@{user.login}
										<ExternalLink className="w-3 h-3" />
									</a>
								</div>

								{user.bio && (
									<p className="text-zinc-400 leading-relaxed text-sm border-t border-white/5 pt-6">
										{user.bio}
									</p>
								)}

								<div className="grid grid-cols-3 gap-2 py-6 border-y border-white/5">
									<div className="text-center p-2 rounded-lg hover:bg-white/5 transition-colors cursor-default">
										<div className="text-lg font-bold text-white">
											{user.followers.toLocaleString()}
										</div>
										<div className="text-[10px] uppercase tracking-wider text-zinc-500">
											Followers
										</div>
									</div>
									<div className="text-center p-2 rounded-lg hover:bg-white/5 transition-colors cursor-default">
										<div className="text-lg font-bold text-white">
											{user.following.toLocaleString()}
										</div>
										<div className="text-[10px] uppercase tracking-wider text-zinc-500">
											Following
										</div>
									</div>
									<div className="text-center p-2 rounded-lg hover:bg-white/5 transition-colors cursor-default">
										<div className="text-lg font-bold text-white">
											{user.public_repos}
										</div>
										<div className="text-[10px] uppercase tracking-wider text-zinc-500">
											Repos
										</div>
									</div>
								</div>

								<div className="space-y-4 text-sm text-left">
									{user.company && (
										<div className="flex items-center gap-3 text-zinc-400">
											<Building className="w-4 h-4 text-zinc-500" />
											<span className="truncate">{user.company}</span>
										</div>
									)}
									{user.location && (
										<div className="flex items-center gap-3 text-zinc-400">
											<MapPin className="w-4 h-4 text-zinc-500" />
											<span>{user.location}</span>
										</div>
									)}
									{user.email && (
										<div className="flex items-center gap-3 text-zinc-400">
											<Mail className="w-4 h-4 text-zinc-500" />
											<a
												href={`mailto:${user.email}`}
												className="hover:text-white transition-colors truncate"
											>
												{user.email}
											</a>
										</div>
									)}
									{user.blog && (
										<div className="flex items-center gap-3 text-zinc-400">
											<Globe className="w-4 h-4 text-zinc-500" />
											<a
												href={
													user.blog.startsWith("http")
														? user.blog
														: `https://${user.blog}`
												}
												target="_blank"
												rel="noreferrer"
												className="hover:text-white transition-colors truncate"
											>
												{user.blog}
											</a>
										</div>
									)}
								</div>
							</div>
						</div>
					</div>

					<div className="lg:col-span-8 space-y-6">
						<div className="flex items-end justify-between mb-8">
							<div>
								<h2 className="text-2xl font-bold text-white mb-1">
									Latest Activity
								</h2>
								<p className="text-zinc-500 text-sm">
									Recently updated repositories
								</p>
							</div>
							<a
								href={`${user.html_url}?tab=repositories`}
								target="_blank"
								rel="noopener noreferrer"
								className="group flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
							>
								View All
								<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
							</a>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{repos && repos.length > 0 ? (
								repos.map((repo: GitHubRepo, i) => (
									<a
										key={repo.id}
										href={repo.html_url}
										target="_blank"
										rel="noopener noreferrer"
										className="group glass-card rounded-xl p-5 hover:border-blue-500/30 hover:bg-blue-500/[0.02] transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between h-full"
										style={{ animationDelay: `${i * 100}ms` }}
									>
										<div className="mb-4">
											<div className="flex items-center justify-between mb-2">
												<h3 className="text-lg font-semibold text-blue-400 group-hover:text-blue-300 transition-colors line-clamp-1 tracking-tight">
													{repo.name}
												</h3>
												<div className="text-[10px] text-zinc-600 font-mono uppercase tracking-wider whitespace-nowrap">
													{new Date(repo.updated_at).toLocaleDateString(
														undefined,
														{ month: "short", day: "numeric" },
													)}
												</div>
											</div>

											<p className="text-sm text-zinc-400 line-clamp-2 leading-relaxed h-10">
												{repo.description || "No description provided."}
											</p>
										</div>

										<div className="flex items-center gap-4 text-xs font-medium text-zinc-500 pt-4 border-t border-white/5 mt-auto">
											{repo.language && (
												<div className="flex items-center gap-1.5 text-zinc-300">
													<span
														className={`w-2 h-2 rounded-full ${getLanguageColor(repo.language)}`}
													/>
													{repo.language}
												</div>
											)}
											<div className="flex items-center gap-1.5 hover:text-zinc-300 transition-colors">
												<Star className="w-3.5 h-3.5" />
												{repo.stargazers_count}
											</div>
											<div className="flex items-center gap-1.5 hover:text-zinc-300 transition-colors">
												<GitFork className="w-3.5 h-3.5" />
												{repo.forks_count}
											</div>
										</div>
									</a>
								))
							) : (
								<div className="col-span-full flex flex-col items-center justify-center py-24 glass-card rounded-2xl border-dashed">
									<BookOpen className="w-12 h-12 text-zinc-700 mb-4" />
									<p className="text-zinc-500">No public repositories found</p>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
