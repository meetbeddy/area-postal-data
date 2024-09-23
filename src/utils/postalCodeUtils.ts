import * as postalData from "../data/postalCodes.json";
import {
	PostalCodeData,
	AreaCouncil,
	District,
} from "../models/postalCodeTypes";

// Type assertion for the imported JSON data
const data: PostalCodeData = postalData as PostalCodeData;

/**
 * Retrieves the postal code(s) for a given area council name.
 * @param areaCouncilName - The name of the area council to search for.
 * @returns An object containing the postal codes and districts, or an error message.
 */
export const getPostalCodeByAreaCouncil = (
	areaCouncilName: string
): { postalCodes: string[]; districts: string[] } | string => {
	const areaCouncil = data.areaCouncils.find(
		(ac) => ac.name.toLowerCase() === areaCouncilName.toLowerCase()
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
 * Retrieves the postal code(s) for a given town name.
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
				district.settlements.some(
					(settlement) => settlement.toLowerCase() === townName.toLowerCase()
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
 * Retrieves all districts for a given area council.
 * @param areaCouncilName - The name of the area council.
 * @returns An array of district names, or an error message.
 */
export const getDistrictsByAreaCouncil = (
	areaCouncilName: string
): string[] | string => {
	const areaCouncil = data.areaCouncils.find(
		(ac) => ac.name.toLowerCase() === areaCouncilName.toLowerCase()
	);

	if (!areaCouncil) {
		return `Area council "${areaCouncilName}" not found.`;
	}

	return areaCouncil.districts.map((d) => d.name);
};
