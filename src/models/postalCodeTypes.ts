export interface District {
	name: string;
	postalCode: string;
	settlements: string[];
}

export interface AreaCouncil {
	name: string;
	districts: District[];
}

export interface PostalCodeData {
	areaCouncils: AreaCouncil[];
}
