import {
	getPostalCodeByAreaCouncil,
	getPostalCodeByTown,
	getTownsByPostalCode,
	getAllAreaCouncils,
	getDistrictsByAreaCouncil,
} from "../postalCodeUtils";

describe("Postal Code Utils", () => {
	test("should return postal codes and districts for valid area council", () => {
		const result = getPostalCodeByAreaCouncil("Bwari");
		expect(result).toEqual({
			postalCodes: ["901101"],
			districts: ["Bwari"],
		});
	});

	test("should return error message for invalid area council", () => {
		const result = getPostalCodeByAreaCouncil("Invalid Area");
		expect(result).toBe('Area council "Invalid Area" not found.');
	});

	test("should return postal codes, districts, and area councils for valid town", () => {
		const result = getPostalCodeByTown("Lugbe");
		expect(result).toEqual({
			postalCodes: ["900107"],
			districts: ["Kabusa"],
			areaCouncils: ["Abuja"],
		});
	});

	test("should return error message for invalid town", () => {
		const result = getPostalCodeByTown("Invalid Town");
		expect(result).toBe('Town "Invalid Town" not found.');
	});

	test("should return towns, district, and area council for valid postal code", () => {
		const result = getTownsByPostalCode("900107");
		expect(result).toEqual({
			towns: expect.arrayContaining(["Lugbe"]), // We use arrayContaining because there might be other towns
			district: "Kabusa",
			areaCouncil: "Abuja",
		});
	});

	test("should return error message for invalid postal code", () => {
		const result = getTownsByPostalCode("000000");
		expect(result).toBe('Postal code "000000" not found.');
	});

	test("should return all area councils", () => {
		const result = getAllAreaCouncils();
		expect(result).toEqual(
			expect.arrayContaining([
				"Abuja",
				"Gwagwalada",
				"Kuje",
				"Bwari",
				"Abaji",
				"Kwali",
			])
		);
	});

	test("should return all districts for a valid area council", () => {
		const result = getDistrictsByAreaCouncil("Abuja");
		expect(result).toEqual(
			expect.arrayContaining([
				"Garki",
				"Gui",
				"Orozo",
				"Karshi",
				"Kabusa",
				"Nyanya",
				"Gwagwa",
				"Jiwa",
				"Gwarinpa",
				"Karu",
			])
		);
	});

	test("should return error message for invalid area council when getting districts", () => {
		const result = getDistrictsByAreaCouncil("Invalid Area");
		expect(result).toBe('Area council "Invalid Area" not found.');
	});
});
