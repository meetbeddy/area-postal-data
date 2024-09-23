import {
	getPostalCodeByAreaCouncil,
	getPostalCodeByTown,
	getTownsByPostalCode,
	getAllAreaCouncils,
	getDistrictsByAreaCouncil,
	searchPostalCode,
	flexiblePostalSearch,
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
			areaCouncils: ["Abuja Municipal"],
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
			areaCouncil: "Abuja Municipal",
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
				"Abuja Municipal",
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

	test("should return postal code, district, and LGA for valid LGA, district, and town", () => {
		const result = searchPostalCode("Abuja", "Kabusa", "Lugbe");
		expect(result).toEqual({
			postalCode: "900107",
			district: "Kabusa",
			lga: "Abuja Municipal",
		});
	});

	test("should return postal code, district, and LGA for partial matches", () => {
		const result = searchPostalCode("Abu", "Kab", "Lugb");
		expect(result).toEqual({
			postalCode: "900107",
			district: "Kabusa",
			lga: "Abuja Municipal",
		});
	});

	test("should return error message for invalid LGA", () => {
		const result = searchPostalCode("Invalid LGA", "Kabusa", "Lugbe");
		expect(result).toBe(
			'No match found for LGA: "Invalid LGA", District: "Kabusa", and Town: "Lugbe".'
		);
	});

	test("should return error message for invalid district", () => {
		const result = searchPostalCode("Abuja", "Invalid District", "Lugbe");
		expect(result).toBe(
			'No match found for LGA: "Abuja", District: "Invalid District", and Town: "Lugbe".'
		);
	});

	test("should return error message for invalid town", () => {
		const result = searchPostalCode("Abuja", "Kabusa", "Invalid Town");
		expect(result).toBe(
			'No match found for LGA: "Abuja", District: "Kabusa", and Town: "Invalid Town".'
		);
	});

	test("should return error message for no matches", () => {
		const result = searchPostalCode(
			"Invalid LGA",
			"Invalid District",
			"Invalid Town"
		);
		expect(result).toBe(
			'No match found for LGA: "Invalid LGA", District: "Invalid District", and Town: "Invalid Town".'
		);
	});

	test("should return postal code, district, and LGA when LGA, district, and town match exactly", () => {
		const result = searchPostalCode("Abuja Municipal", "Kabusa", "Lugbe");
		expect(result).toEqual({
			postalCode: "900107",
			district: "Kabusa",
			lga: "Abuja Municipal",
		});
	});

	test("should return best match when only LGA and district are provided", () => {
		const result = flexiblePostalSearch("Abuja Municipal", "Garki");
		expect(result).toEqual({
			postalCode: "900241",
			district: "Garki-rural",
			lga: "Abuja Municipal",
		});
	});

	test("should return best match when only LGA is provided (no district or town)", () => {
		const result = flexiblePostalSearch("Bwari");
		expect(result).toEqual({
			postalCode: "901101",
			district: "Bwari",
			lga: "Bwari",
		});
	});

	test("should return error when LGA does not match", () => {
		const result = flexiblePostalSearch("Nonexistent LGA");
		expect(result).toBe(
			'No match found for LGA: "Nonexistent LGA", District: "", and Town: "".'
		);
	});

	test("should return error when LGA matches but district does not", () => {
		const result = flexiblePostalSearch(
			"Abuja Municipal",
			"Nonexistent District"
		);
		expect(result).toBe(
			'No match found for LGA: "Abuja Municipal", District: "Nonexistent District", and Town: "".'
		);
	});

	test("should return error when LGA and district match but town does not", () => {
		const result = searchPostalCode(
			"Abuja Municipal",
			"Garki",
			"Nonexistent Town"
		);
		expect(result).toBe(
			'No match found for LGA: "Abuja Municipal", District: "Garki", and Town: "Nonexistent Town".'
		);
	});
});
