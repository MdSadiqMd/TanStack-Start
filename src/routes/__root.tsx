import {
	HeadContent,
	Scripts,
	createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { AuroraBackground } from "@/components/AuroraBackground";

import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";

import appCss from "../styles.css?url";

import type { QueryClient } from "@tanstack/react-query";

import type { TRPCRouter } from "@/integrations/trpc/router";
import type { TRPCOptionsProxy } from "@trpc/tanstack-react-query";

interface MyRouterContext {
	queryClient: QueryClient;

	trpc: TRPCOptionsProxy<TRPCRouter>;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "GitHub User Viewer",
			},
			{
				name: "description",
				content: "Fast GitHub user profile viewer built with TanStack Start",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),

	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className="dark">
			<head>
				<HeadContent />
			</head>
			<body className="bg-black text-zinc-100 min-h-screen antialiased selection:bg-white/20 selection:text-white overflow-x-hidden">
				<div className="noise-bg" />
				<AuroraBackground />
				<div className="relative z-10 min-h-screen flex flex-col">
					{children}
				</div>
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
						TanStackQueryDevtools,
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}
