import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "./init";

import type { TRPCRouterRecord } from "@trpc/server";

const GitHubUserSchema = z.object({
	login: z.string(),
	id: z.number(),
	avatar_url: z.string(),
	html_url: z.string(),
	name: z.string().nullable(),
	company: z.string().nullable(),
	blog: z.string().nullable(),
	location: z.string().nullable(),
	email: z.string().nullable(),
	bio: z.string().nullable(),
	twitter_username: z.string().nullable(),
	public_repos: z.number(),
	public_gists: z.number(),
	followers: z.number(),
	following: z.number(),
	created_at: z.string(),
	updated_at: z.string(),
});

const GitHubRepoSchema = z.object({
	id: z.number(),
	name: z.string(),
	full_name: z.string(),
	html_url: z.string(),
	description: z.string().nullable(),
	fork: z.boolean(),
	created_at: z.string(),
	updated_at: z.string(),
	pushed_at: z.string(),
	stargazers_count: z.number(),
	watchers_count: z.number(),
	language: z.string().nullable(),
	forks_count: z.number(),
	open_issues_count: z.number(),
	topics: z.array(z.string()),
});

export type GitHubUser = z.infer<typeof GitHubUserSchema>;
export type GitHubRepo = z.infer<typeof GitHubRepoSchema>;

const githubRouter = {
	getUser: publicProcedure
		.input(z.object({ username: z.string().min(1) }))
		.query(async ({ input }) => {
			const response = await fetch(
				`https://api.github.com/users/${input.username}`,
				{
					headers: {
						Accept: "application/vnd.github.v3+json",
						"User-Agent": "TanStack-Start-App",
					},
				},
			);

			if (!response.ok) {
				if (response.status === 404) {
					throw new Error("User not found");
				}
				throw new Error("Failed to fetch user data");
			}

			const data = await response.json();
			return GitHubUserSchema.parse(data);
		}),

	getUserRepos: publicProcedure
		.input(
			z.object({
				username: z.string().min(1),
				sort: z.enum(["created", "updated", "pushed", "full_name"]).optional(),
				per_page: z.number().min(1).max(100).optional(),
			}),
		)
		.query(async ({ input }) => {
			const params = new URLSearchParams({
				sort: input.sort || "updated",
				per_page: String(input.per_page || 6),
			});

			const response = await fetch(
				`https://api.github.com/users/${input.username}/repos?${params}`,
				{
					headers: {
						Accept: "application/vnd.github.v3+json",
						"User-Agent": "TanStack-Start-App",
					},
				},
			);

			if (!response.ok) {
				if (response.status === 404) {
					throw new Error("User not found");
				}
				throw new Error("Failed to fetch repositories");
			}

			const data = await response.json();
			return z.array(GitHubRepoSchema).parse(data);
		}),
} satisfies TRPCRouterRecord;

export const trpcRouter = createTRPCRouter({
	github: githubRouter,
});
export type TRPCRouter = typeof trpcRouter;
