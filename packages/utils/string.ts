export function capitalize(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatFirstname(input: string): string {
	return input
		.trim()
		.toLowerCase()
		.replace(/["]/g, "'") // Normalize quotes to single quote
		.replace(/\s*(['\-])\s*/g, "$1") // Remove spaces around apostrophes and hyphens
		.split(/([ '\-])/g) // Split and keep separators
		.map((part) => capitalize(part)) // Capitalize first letter of each part
		.join("");
}

export function formatLastname(input: string): string {
	return input
		.trim()
		.replace(/\s+/g, " ") // Collapse multiple spaces
		.replace(/\s*(['\-])\s*/g, "$1") // Remove spaces around apostrophes and hyphens
		.toUpperCase();
}
