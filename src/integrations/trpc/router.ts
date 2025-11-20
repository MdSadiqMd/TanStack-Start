import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "./init";

import type { TRPCRouterRecord } from "@trpc/server";
import { GitHubUserSchema, GitHubRepoSchema } from "@/types/github.types";

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
