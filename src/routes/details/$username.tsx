import { createFileRoute, Link } from "@tanstack/react-router";
import {
	MapPin,
	Link2,
	Twitter,
	Building,
	Users,
	BookOpen,
	Star,
	GitFork,
	Calendar,
	ArrowLeft,
	ExternalLink,
	Mail,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/integrations/trpc/react";
import { GitHubRepo } from "@/types/github.types";

export const Route = createFileRoute("/details/$username")({
	component: UserDetails,
	ssr: false,
	errorComponent: ({ error }) => (
		<div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black flex items-center justify-center p-4">
			<div className="max-w-md w-full bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-8 text-center">
				<div className="text-red-400 text-5xl mb-4">⚠️</div>
				<h2 className="text-2xl font-bold text-white mb-2">User Not Found</h2>
				<p className="text-zinc-400 mb-6">{error.message}</p>
				<Link
					to="/"
					className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
				>
					<ArrowLeft className="w-4 h-4" />
					Back to Home
				</Link>
			</div>
		</div>
	),
});

function UserDetails() {
	const { username } = Route.useParams();
	const trpc = useTRPC();
	const userQuery = useQuery({
		...trpc.github.getUser.queryOptions({ username }),
		staleTime: 1000 * 60 * 5, // 5 minutes
		gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
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
			<div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black flex items-center justify-center p-4">
				<div className="text-center">
					<div className="inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
					<p className="text-zinc-400">Loading user data...</p>
				</div>
			</div>
		);
	}

	if (!user) return null;

	return (
		<div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black p-4 md:p-8">
			<div className="max-w-6xl mx-auto mb-6">
				<Link
					to="/"
					className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
				>
					<ArrowLeft className="w-4 h-4" />
					Back to Search
				</Link>
			</div>

			<div className="max-w-6xl mx-auto space-y-6">
				<div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-8 shadow-2xl">
					<div className="flex flex-col md:flex-row gap-8">
						<div className="flex-shrink-0">
							<img
								src={user.avatar_url}
								alt={user.login}
								className="w-32 h-32 md:w-40 md:h-40 rounded-2xl border-4 border-zinc-800 shadow-xl"
							/>
						</div>

						<div className="flex-1 space-y-4">
							<div>
								<h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
									{user.name || user.login}
								</h1>
								<a
									href={user.html_url}
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
								>
									@{user.login}
									<ExternalLink className="w-4 h-4" />
								</a>
							</div>

							{user.bio && (
								<p className="text-zinc-300 text-lg leading-relaxed">
									{user.bio}
								</p>
							)}

							<div className="flex flex-wrap gap-4 text-sm text-zinc-400">
								{user.company && (
									<div className="flex items-center gap-2">
										<Building className="w-4 h-4" />
										<span>{user.company}</span>
									</div>
								)}
								{user.location && (
									<div className="flex items-center gap-2">
										<MapPin className="w-4 h-4" />
										<span>{user.location}</span>
									</div>
								)}
								{user.email && (
									<div className="flex items-center gap-2">
										<Mail className="w-4 h-4" />
										<a
											href={`mailto:${user.email}`}
											className="hover:text-white transition-colors"
										>
											{user.email}
										</a>
									</div>
								)}
								{user.blog && (
									<div className="flex items-center gap-2">
										<Link2 className="w-4 h-4" />
										<a
											href={
												user.blog.startsWith("http")
													? user.blog
													: `https://${user.blog}`
											}
											target="_blank"
											rel="noopener noreferrer"
											className="hover:text-white transition-colors"
										>
											{user.blog}
										</a>
									</div>
								)}
								{user.twitter_username && (
									<div className="flex items-center gap-2">
										<Twitter className="w-4 h-4" />
										<a
											href={`https://x.com/${user.twitter_username}`}
											target="_blank"
											rel="noopener noreferrer"
											className="hover:text-white transition-colors"
										>
											@{user.twitter_username}
										</a>
									</div>
								)}
							</div>

							<div className="flex flex-wrap gap-6 pt-4 border-t border-zinc-800">
								<div className="flex items-center gap-2">
									<Users className="w-5 h-5 text-blue-400" />
									<span className="text-white font-semibold">
										{user.followers.toLocaleString()}
									</span>
									<span className="text-zinc-400">followers</span>
								</div>
								<div className="flex items-center gap-2">
									<Users className="w-5 h-5 text-green-400" />
									<span className="text-white font-semibold">
										{user.following.toLocaleString()}
									</span>
									<span className="text-zinc-400">following</span>
								</div>
								<div className="flex items-center gap-2">
									<BookOpen className="w-5 h-5 text-purple-400" />
									<span className="text-white font-semibold">
										{user.public_repos.toLocaleString()}
									</span>
									<span className="text-zinc-400">repositories</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-8 shadow-2xl">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-2xl font-bold text-white flex items-center gap-2">
							<BookOpen className="w-6 h-6 text-purple-400" />
							Recent Repositories
						</h2>
						<a
							href={`${user.html_url}?tab=repositories`}
							target="_blank"
							rel="noopener noreferrer"
							className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
						>
							View all
							<ExternalLink className="w-3 h-3" />
						</a>
					</div>

					{reposQuery.isLoading ? (
						<div className="text-center py-8">
							<div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-2" />
							<p className="text-zinc-400 text-sm">Loading repositories...</p>
						</div>
					) : repos && repos.length > 0 ? (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{repos.map((repo: GitHubRepo) => (
								<a
									key={repo.id}
									href={repo.html_url}
									target="_blank"
									rel="noopener noreferrer"
									className="bg-zinc-800/50 border border-zinc-700 hover:border-zinc-600 rounded-xl p-5 transition-all hover:shadow-lg hover:shadow-blue-500/10 group"
								>
									<div className="flex items-start justify-between mb-3">
										<h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors flex items-center gap-2">
											{repo.name}
											{repo.fork && (
												<span className="text-xs bg-zinc-700 px-2 py-0.5 rounded text-zinc-400">
													Fork
												</span>
											)}
										</h3>
									</div>

									{repo.description && (
										<p className="text-zinc-400 text-sm mb-3 line-clamp-2">
											{repo.description}
										</p>
									)}

									<div className="flex items-center gap-4 text-xs text-zinc-500">
										{repo.language && (
											<div className="flex items-center gap-1">
												<span className="w-3 h-3 rounded-full bg-blue-400" />
												<span>{repo.language}</span>
											</div>
										)}
										<div className="flex items-center gap-1">
											<Star className="w-3 h-3" />
											<span>{repo.stargazers_count.toLocaleString()}</span>
										</div>
										<div className="flex items-center gap-1">
											<GitFork className="w-3 h-3" />
											<span>{repo.forks_count.toLocaleString()}</span>
										</div>
										<div className="flex items-center gap-1">
											<Calendar className="w-3 h-3" />
											<span>
												Updated {new Date(repo.updated_at).toLocaleDateString()}
											</span>
										</div>
									</div>

									{repo.topics && repo.topics.length > 0 && (
										<div className="flex flex-wrap gap-1 mt-3">
											{repo.topics.slice(0, 3).map((topic: string) => (
												<span
													key={topic}
													className="text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded"
												>
													{topic}
												</span>
											))}
										</div>
									)}
								</a>
							))}
						</div>
					) : (
						<p className="text-zinc-400 text-center py-8">
							No public repositories found
						</p>
					)}
				</div>

				<div className="text-center text-zinc-500 text-sm">
					<div className="flex items-center justify-center gap-2">
						<Calendar className="w-4 h-4" />
						<span>
							Joined GitHub on{" "}
							{new Date(user.created_at).toLocaleDateString("en-US", {
								year: "numeric",
								month: "long",
								day: "numeric",
							})}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
