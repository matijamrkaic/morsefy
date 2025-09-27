import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
	base: "/morsefy/",
	build: {
		outDir: "dist",
		assetsDir: "assets",
		sourcemap: true,
	},
	server: {
		port: 3000,
		open: true,
	},
});
