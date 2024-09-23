import * as postalData from "../data/postalCodes.json";
import { PostalCodeData } from "../models/postalCodeTypes";

// Type assertion for the imported JSON data
const data: PostalCodeData = postalData;

/**
 * Fuzzy match utility function
 * @param input - The search input string
 * @param target - The target string to match
 * @returns A boolean indicating whether the query is a fuzzy match
 */

// Utility function to calculate Levenshtein distance between two strings
const levenshteinDistance = (a: string, b: string): number => {
	const matrix: number[][] = Array(a.length + 1)
		.fill(null)
		.map(() => Array(b.length + 1).fill(null));

	for (let i = 0; i <= a.length; i++) {
		matrix[i][0] = i;
	}

	for (let j = 0; j <= b.length; j++) {
		matrix[0][j] = j;
	}

	for (let i = 1; i <= a.length; i++) {
		for (let j = 1; j <= b.length; j++) {
			const cost = a[i - 1] === b[j - 1] ? 0 : 1;
			matrix[i][j] = Math.min(
				matrix[i - 1][j] + 1,
				matrix[i][j - 1] + 1,
				matrix[i - 1][j - 1] + cost
			);
		}
	}

	return matrix[a.length][b.length];
};

const fuzzyMatch = (input: string, target: string): boolean => {
	input = input.toLowerCase();
	target = target.toLowerCase();

	// First, check if input is a substring of target
	if (target.includes(input)) {
		return true;
	}

	// Special case for very short inputs (substring matching is enough here)
	if (input.length <= 3) {
		return target.startsWith(input);
	}

	// Apply Levenshtein distance for typo tolerance
	const maxDistance = Math.max(input.length, target.length) * 0.3;
	const distance = levenshteinDistance(input, target);

	return distance <= maxDistance;
};

/**
 * Retrieves the postal code(s) for a given area council name using fuzzy matching.
 * @param areaCouncilName - The name of the area council to search for.
 * @returns An object containing the postal codes and districts, or an error message.
 */
export const getPostalCodeByAreaCouncil = (
	areaCouncilName: string
): { postalCodes: string[]; districts: string[] } | string => {
	const areaCouncil = data.areaCouncils.find((ac) =>
		fuzzyMatch(areaCouncilName, ac.name)
	);

	if (!areaCouncil) {
		return `Area council "${areaCouncilName}" not found.`;
	}

	const result = areaCouncil.districts.reduce(
		(acc, district) => {
			if (district.postalCode) {
				acc.postalCodes.push(district.postalCode);
				acc.districts.push(district.name);
			}
			return acc;
		},
		{ postalCodes: [] as string[], districts: [] as string[] }
	);

	return result.postalCodes.length > 0
		? result
		: `No postal codes found for "${areaCouncilName}".`;
};

/**
 * Retrieves the postal code(s) for a given town name using fuzzy matching.
 * @param townName - The name of the town to search for.
 * @returns An object containing the postal codes, districts, and area councils, or an error message.
 */
export const getPostalCodeByTown = (
	townName: string
):
	| { postalCodes: string[]; districts: string[]; areaCouncils: string[] }
	| string => {
	const result = {
		postalCodes: [] as string[],
		districts: [] as string[],
		areaCouncils: [] as string[],
	};

	data.areaCouncils.forEach((areaCouncil) => {
		areaCouncil.districts.forEach((district) => {
			if (
				district.settlements.some((settlement) =>
					fuzzyMatch(townName, settlement)
				)
			) {
				if (district.postalCode) {
					result.postalCodes.push(district.postalCode);
					result.districts.push(district.name);
					result.areaCouncils.push(areaCouncil.name);
				}
			}
		});
	});

	return result.postalCodes.length > 0
		? result
		: `Town "${townName}" not found.`;
};

/**
 * Retrieves all towns for a given postal code.
 * @param postalCode - The postal code to search for.
 * @returns An object containing the towns, district, and area council, or an error message.
 */
export const getTownsByPostalCode = (
	postalCode: string
): { towns: string[]; district: string; areaCouncil: string } | string => {
	for (const areaCouncil of data.areaCouncils) {
		const district = areaCouncil.districts.find(
			(d) => d.postalCode === postalCode
		);
		if (district) {
			return {
				towns: district.settlements,
				district: district.name,
				areaCouncil: areaCouncil.name,
			};
		}
	}
	return `Postal code "${postalCode}" not found.`;
};

/**
 * Retrieves all area councils.
 * @returns An array of area council names.
 */
export const getAllAreaCouncils = (): string[] => {
	return data.areaCouncils.map((ac) => ac.name);
};

/**
 * Retrieves all districts for a given area council using fuzzy matching.
 * @param areaCouncilName - The name of the area council.
 * @returns An array of district names, or an error message.
 */
export const getDistrictsByAreaCouncil = (
	areaCouncilName: string
): string[] | string => {
	const areaCouncil = data.areaCouncils.find((ac) =>
		fuzzyMatch(areaCouncilName, ac.name)
	);

	if (!areaCouncil) {
		return `Area council "${areaCouncilName}" not found.`;
	}

	return areaCouncil.districts.map((d) => d.name);
};

/**
 * Fuzzy search across LGA, District, and Town.
 * @param lga - The name of the LGA (e.g., Municipal)
 * @param district - The name of the district (e.g., Garki)
 * @param town - The name of the town or settlement (e.g., Area 1)
 * @returns Matching result, or an error message if no match is found
 */
export const searchPostalCode = (
	lga: string,
	district: string,
	town: string
): { postalCode: string; district: string; lga: string } | string => {
	// Loop through all LGAs
	for (const areaCouncil of data.areaCouncils) {
		if (fuzzyMatch(lga, areaCouncil.name)) {
			// Loop through all districts within the matching LGA
			for (const dist of areaCouncil.districts) {
				if (fuzzyMatch(district, dist.name)) {
					// Loop through settlements to find a fuzzy town match
					for (const settlement of dist.settlements) {
						if (fuzzyMatch(town, settlement)) {
							return {
								postalCode: dist.postalCode,
								district: dist.name,
								lga: areaCouncil.name,
							};
						}
					}
				}
			}
		}
	}

	return `No match found for LGA: "${lga}", District: "${district}", and Town: "${town}".`;
};

/**
 * Flexible postal code search based on LGA, District, and optional Town.
 *
 * The function allows for a flexible search where only the LGA is compulsory.
 * Optionally, you can also specify the district and/or the town for more accurate results.
 *
 * @param {string} lga - The name of the LGA (e.g., Municipal). This is a required field.
 * @param {string} [district] - The name of the district (e.g., Garki). This is optional.
 * @param {string} [town] - The name of the town or settlement (e.g., Area 1). This is optional.
 * @returns {{ postalCode: string; district: string; lga: string } | string} -
 *          Returns an object with the postal code, district, and LGA if a match is found,
 *          or an error message string if no match is found.
 */
export const flexiblePostalSearch = (
	lga: string,
	district?: string, // optional
	town?: string // optional
): { postalCode: string; district: string; lga: string } | string => {
	for (const areaCouncil of data.areaCouncils) {
		if (fuzzyMatch(lga, areaCouncil.name)) {
			let bestMatch: { lga: string; district?: string; postalCode?: string } = {
				lga: areaCouncil.name,
			};

			// District check (optional)
			if (district) {
				for (const dist of areaCouncil.districts) {
					if (fuzzyMatch(district, dist.name)) {
						bestMatch = {
							...bestMatch,
							district: dist.name,
							postalCode: dist.postalCode,
						};

						// Town check (optional)
						if (town) {
							for (const settlement of dist.settlements) {
								if (fuzzyMatch(town, settlement)) {
									return {
										lga: areaCouncil.name,
										district: dist.name,
										postalCode: dist.postalCode,
									};
								}
							}
						}

						// If no town was matched, return district-level match
						if (bestMatch.district && bestMatch.postalCode) {
							return bestMatch as {
								postalCode: string;
								district: string;
								lga: string;
							};
						}
					}
				}
			} else {
				// If no district provided, return LGA-level match
				for (const dist of areaCouncil.districts) {
					if (
						!town ||
						dist.settlements.some((settlement) => fuzzyMatch(town, settlement))
					) {
						return {
							lga: areaCouncil.name,
							district: dist.name,
							postalCode: dist.postalCode,
						};
					}
				}
			}
		}
	}

	return `No match found for LGA: "${lga}", District: "${
		district || ""
	}", and Town: "${town || ""}".`;
};
