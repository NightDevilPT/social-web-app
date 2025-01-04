const fs = require("fs");
const path = require("path");

/**
 * Recursively find all files named `route.ts` in a directory.
 */
const findRouteFiles = (dir) => {
	const result = [];
	const files = fs.readdirSync(dir);

	files.forEach((file) => {
		const filePath = path.join(dir, file);
		const stat = fs.statSync(filePath);

		if (stat.isDirectory()) {
			result.push(...findRouteFiles(filePath)); // Recurse into subdirectory
		} else if (file === "route.ts") {
			result.push(filePath); // Add `route.ts` file to the result
		}
	});

	return result;
};

/**
 * Extract the required data from a `route.ts` file.
 */
const parseApiFile = (filePath) => {
	const fileContent = fs.readFileSync(filePath, "utf-8");
	const fileName = path.basename(filePath);
	const apiDetails = {
		file: fileName,
		description: "",
		endpoints: [],
	};

	// Regex to identify API endpoints
	const endpointRegex =
		/router\.(get|post|put|delete|patch)\(['"]([^'"]+)['"],\s*(async\s)?\((req, res)\).*?\{([\s\S]*?)\}/g;
	const matches = fileContent.matchAll(endpointRegex);

	for (const match of matches) {
		const [_, method, route, , , body] = match;

		// Extract possible request requirements
		const requirements = {
			body: body.includes("req.body") ? "Expected `req.body` structure (Add details manually)" : "None",
			query: body.includes("req.query") ? "Expected `req.query` parameters (Add details manually)" : "None",
			params: body.includes("req.params") ? "Expected `req.params` parameters (Add details manually)" : "None",
			headers: body.includes("req.headers") ? "Expected headers (Add details manually)" : "None",
		};

		apiDetails.endpoints.push({
			method: method.toUpperCase(),
			route,
			description: "Endpoint description (Add manually if known)",
			requirements,
			response: "Expected response structure (Add details manually)",
		});
	}

	// Attempt to extract a description (e.g., from comments at the top of the file)
	const descriptionMatch = fileContent.match(/\/\*\*([\s\S]*?)\*\//);
	if (descriptionMatch) {
		apiDetails.description = descriptionMatch[1].trim();
	}

	return apiDetails;
};

/**
 * Generate a detailed README file for API routes.
 */
const generateReadme = (routeFiles, outputPath) => {
	const readmeContent = ["# API Documentation", ""];

	routeFiles.forEach((filePath) => {
		const apiDetails = parseApiFile(filePath);
		const relativePath = path.relative(process.cwd(), filePath);

		readmeContent.push(`## File: ${relativePath}`, "");
		if (apiDetails.description) {
			readmeContent.push(`**Description:** ${apiDetails.description}`, "");
		} else {
			readmeContent.push("**Description:** No description provided", "");
		}

		apiDetails.endpoints.forEach((endpoint, index) => {
			readmeContent.push(
				`### Endpoint ${index + 1}: ${endpoint.method} ${endpoint.route}`,
				"",
				`**Description:** ${endpoint.description}`,
				"",
				`**Requirements:**`,
				`- **Body:** ${endpoint.requirements.body}`,
				`- **Query Parameters:** ${endpoint.requirements.query}`,
				`- **Route Parameters:** ${endpoint.requirements.params}`,
				`- **Headers:** ${endpoint.requirements.headers}`,
				"",
				`**Expected Response:**`,
				`${endpoint.response}`,
				""
			);
		});

		if (apiDetails.endpoints.length === 0) {
			readmeContent.push("No endpoints defined in this file.", "");
		}
	});

	fs.writeFileSync(outputPath, readmeContent.join("\n"));
	console.log(`README.md generated at ${outputPath}`);
};

// Adjust paths dynamically to ensure script runs correctly
const scriptDir = path.dirname(__filename); // Path to the `scripts` folder
const projectRoot = path.resolve(scriptDir, ".."); // Navigate back to the root directory
const apiFolderPath = path.join(projectRoot, "src", "app", "api"); // Path to the `api` folder
const outputReadmePath = path.join(projectRoot, "README.md"); // Path to output README

// Find all `route.ts` files
const routeFiles = findRouteFiles(apiFolderPath);
if (routeFiles.length === 0) {
	console.error("No route.ts files found.");
	process.exit(1);
}

// Generate README
generateReadme(routeFiles, outputReadmePath);
