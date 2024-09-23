import {
	getPostalCodeByAreaCouncil,
	getPostalCodeByTown,
	getTownsByPostalCode,
	getAllAreaCouncils,
	getDistrictsByAreaCouncil,
	searchPostalCode,
	flexiblePostalSearch,
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

	/**
	 * Fuzzy search across LGA, district, and town names to retrieve postal codes.
	 *
	 * @param lga - The name of the LGA.
	 * @param district - The name of the district.
	 * @param town - The name of the town or settlement.
	 * @returns An object containing the postal code, district, and LGA, or an error message.
	 */
	searchPostalCode: (
		lga: string,
		district: string,
		town: string
	): { postalCode: string; district: string; lga: string } | string => {
		return searchPostalCode(lga, district, town);
	},

	/**
	 * Flexible postal code search based on LGA, District, and optional Town.
	 *
	 * @param lga - The name of the LGA (e.g., Municipal). This is a required field.
	 * @param district - The name of the district (optional).
	 * @param town - The name of the town or settlement (optional).
	 * @returns An object with postal code, district, and LGA if a match is found, or an error message if not.
	 */
	flexibleSearch: (
		lga: string,
		district?: string, // optional
		town?: string // optional
	): { postalCode: string; district: string; lga: string } | string => {
		return flexiblePostalSearch(lga, district, town);
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
