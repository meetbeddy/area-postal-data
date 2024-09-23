# Nigeria Area Council Data Package

![npm](https://img.shields.io/npm/v/nigerian-postal-data) ![License](https://img.shields.io/badge/license-MIT-green)

A TypeScript utility package designed to provide easy access to data related to area councils, districts, postal codes, and settlements in Nigeria. This package aims to simplify the retrieval of important geographical information for developers and applications.

## Table of Contents

- [Features](#features)
- [Supported States and Countries](#supported-states-and-countries)
- [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Examples](#examples)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Retrieve Postal Codes:** Quickly fetch postal codes using area council names or town names.
- **Get Town Information:** Find towns, districts, and area councils associated with a postal code.
- **Area Council and District Data:** Access lists of all area councils and districts within an area council.
- **TypeScript Support:** Built with TypeScript for improved type safety and developer experience.
- **Simple API:** Easy-to-use functions that integrate seamlessly into your projects.

## Supported States and Countries

- **Country:** Nigeria
- **States:** 
  - Federal Capital Territory (Abuja)

## Installation

To install the package, use npm:

```bash
npm install nigerian-postal-data
```

## Usage

Here's a quick example of how to use the package:

```typescript
import { getPostalCode } from 'nigerian-postal-data';

// Get postal codes for an area council
const areaCouncilResult = getPostalCode.byAreaCouncil('Abuja');
console.log(areaCouncilResult);

// Get postal code for a town
const townResult = getPostalCode.byTown('Lugbe');
console.log(townResult);

// Get towns for a postal code
const postalCodeResult = getPostalCode.getTowns('900107');
console.log(postalCodeResult);

// Get all area councils
const allAreaCouncils = getPostalCode.getAllAreaCouncils();
console.log(allAreaCouncils);

// Get districts in an area council
const districts = getPostalCode.getDistricts('Abuja');
console.log(districts);
```

## API Reference

### `getPostalCode.byAreaCouncil(areaCouncil: string)`

Returns postal codes and districts for the given area council.

### `getPostalCode.byTown(town: string)`

Returns postal codes, districts, and area councils for the given town.

### `getPostalCode.getTowns(postalCode: string)`

Returns towns, district, and area council for the given postal code.

### `getPostalCode.getAllAreaCouncils()`

Returns all area councils.

### `getPostalCode.getDistricts(areaCouncil: string)`

Returns all districts for the given area council.

## Examples

### Validating an Address

```typescript
import { getPostalCode } from 'nigerian-postal-data';

function validateAddress(town: string, postalCode: string): boolean {
  const townResult = getPostalCode.byTown(town);
  const postalCodeResult = getPostalCode.getTowns(postalCode);

  if (typeof townResult === 'string' || typeof postalCodeResult === 'string') {
    return false; // Town or postal code not found
  }

  return townResult.postalCodes.includes(postalCode);
}

console.log(validateAddress('Lugbe', '900107')); // true
console.log(validateAddress('Lugbe', '900101')); // false
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.