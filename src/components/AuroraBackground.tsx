export function AuroraBackground() {
	return (
		<div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
			<div className="absolute inset-0 bg-black" />

			{/* Gradient Orbs */}
			<div
				className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-white/[0.02] blur-[120px] animate-pulse"
				style={{ animationDuration: "8s" }}
			/>
			<div
				className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-white/[0.02] blur-[100px] animate-pulse"
				style={{ animationDuration: "10s", animationDelay: "1s" }}
			/>

			{/* Center Glow */}
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] rounded-full bg-zinc-800/[0.03] blur-[80px]" />

			{/* Grid Overlay */}
			<div
				className="absolute inset-0 opacity-[0.02]"
				style={{
					backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
					backgroundSize: "60px 60px",
				}}
			/>
		</div>
	);
}
