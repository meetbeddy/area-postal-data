import {
	getPostalCodeByAreaCouncil,
	getPostalCodeByTown,
	getTownsByPostalCode,
	getAllAreaCouncils,
	getDistrictsByAreaCouncil,
} from "./utils/postalCodeUtils";
import { PostalCodeData } from "./models/postalCodeTypes";

/**
 * An object containing methods to retrieve postal codes and related information.
 *
 * @module postalCode
 */
export const getPostalCode = {
	/**
	 * Retrieves the postal code(s) and districts for a given area council.
	 *
	 * @param areaCouncil - The name of the area council.
	 * @returns An object containing postal codes and districts, or an error message.
	 */
	byAreaCouncil: (
		areaCouncil: string
	): { postalCodes: string[]; districts: string[] } | string => {
		return getPostalCodeByAreaCouncil(areaCouncil);
	},

	/**
	 * Retrieves the postal code(s), districts, and area councils for a given town name.
	 *
	 * @param town - The name of the town.
	 * @returns An object containing postal codes, districts, and area councils, or an error message.
	 */
	byTown: (
		town: string
	):
		| { postalCodes: string[]; districts: string[]; areaCouncils: string[] }
		| string => {
		return getPostalCodeByTown(town);
	},

	/**
	 * Retrieves the towns, district, and area council for a given postal code.
	 *
	 * @param postalCode - The postal code to search for.
	 * @returns An object containing towns, district, and area council, or an error message.
	 */
	getTowns: (
		postalCode: string
	): { towns: string[]; district: string; areaCouncil: string } | string => {
		return getTownsByPostalCode(postalCode);
	},

	/**
	 * Retrieves all area councils.
	 *
	 * @returns An array of area council names.
	 */
	getAllAreaCouncils: (): string[] => {
		return getAllAreaCouncils();
	},

	/**
	 * Retrieves all districts for a given area council.
	 *
	 * @param areaCouncil - The name of the area council.
	 * @returns An array of district names, or an error message.
	 */
	getDistricts: (areaCouncil: string): string[] | string => {
		return getDistrictsByAreaCouncil(areaCouncil);
	},
};

/**
 * Loads postal code data from the JSON file.
 *
 * @returns The postal code data as defined by the PostalCodeData type.
 */
export const loadPostalCodeData = (): PostalCodeData => {
	return require("./data/postalCodes.json") as PostalCodeData;
};

// Export all functions from utils for easier access
export * from "./utils/postalCodeUtils";
