import type { TRPCRouterRecord } from "@trpc/server";
import axios from "axios";
import { z } from "zod";

import { GitHubRepoSchema, GitHubUserSchema } from "@/types/github.types";
import { createTRPCRouter, publicProcedure } from "./init";

const githubAPI = axios.create({
	baseURL: "https://api.github.com",
	headers: {
		Accept: "application/vnd.github.v3+json",
		"User-Agent": "TanStack-Start-App",
	},
});

const githubRouter = {
	getUser: publicProcedure
		.input(z.object({ username: z.string().min(1) }))
		.query(async ({ input }) => {
			try {
				const response = await githubAPI.get(`/users/${input.username}`);
				return GitHubUserSchema.parse(response.data);
			} catch (error) {
				if (axios.isAxiosError(error)) {
					if (error.response?.status === 404) {
						throw new Error("User not found");
					}
				}
				throw new Error("Failed to fetch user data");
			}
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
			try {
				const response = await githubAPI.get(`/users/${input.username}/repos`, {
					params: {
						sort: input.sort || "updated",
						per_page: input.per_page || 6,
					},
				});
				return z.array(GitHubRepoSchema).parse(response.data);
			} catch (error) {
				if (axios.isAxiosError(error)) {
					if (error.response?.status === 404) {
						throw new Error("User not found");
					}
				}
				throw new Error("Failed to fetch repositories");
			}
		}),
} satisfies TRPCRouterRecord;

export const trpcRouter = createTRPCRouter({
	github: githubRouter,
});
export type TRPCRouter = typeof trpcRouter;
