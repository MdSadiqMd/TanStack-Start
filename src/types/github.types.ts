import { z } from "zod";

export const GitHubUserSchema = z.object({
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

export const GitHubRepoSchema = z.object({
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
