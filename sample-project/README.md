# Test Project Documentation

## Overview

This test project is designed to validate and demonstrate the functionality of the **@junaidatari/env-binder** package, a TypeScript environment variable binder that ensures type safety and validation for environment configurations. The tests cover various scenarios, including basic usage, validation, and edge cases, to ensure the package operates reliably across different environments.

## Features Tested

- **Type Safety**: Verifies that the environment variables are correctly typed and accessible.
- **Validation**: Ensures that the validation mechanisms work as expected for different variable types.
- **Error Handling**: Tests how the package handles missing or invalid environment variables.
- **Configuration Loading**: Validates the loading and binding of environment variables from `.env` files.
- **Integration**: Checks compatibility with other libraries such as `dotenv`.

## Test Structure

The tests are organized into several categories to cover all aspects of the package:

1. **Basic Tests**: Simple use cases to verify core functionality.
2. **Validation Tests**: Scenarios where validation rules are applied.
3. **Edge Case Tests**: Unusual or extreme conditions to test robustness.
4. **Integration Tests**: Compatibility checks with other tools and libraries.

## Available Scripts

The test project includes several npm scripts to run different module formats:

### Running TypeScript

```bash
npm run start:ts
```

This will execute the TypeScript version using `ts-node`.

### Running ES Module

```bash
npm run start:esm
```

This will run the ES module version directly with Node.js.

### Running CommonJS

```bash
npm run start:cjs
```

This will execute the CommonJS module version.

This will run the test suite using `ts-node`, which compiles and executes the TypeScript tests in real-time.

## Dependencies

The test project relies on the following key dependencies:

- **@junaidatari/env-binder**: The package being tested.
- **dotenv**: For loading environment variables from `.env` files.
- **typescript**: For TypeScript compilation and type checking.
- **ts-node**: For running TypeScript files directly without precompilation.

## Environment Setup

Ensure that your environment meets the following requirements:

- **Node.js**: Version 20 or higher.
- **Operating System**: Compatible with macOS, Linux, or Windows.

## Contributing

When contributing to the test project, ensure that:

- New tests cover untested scenarios or edge cases.
- Existing tests are updated to reflect changes in the package.
- All tests pass before submitting a pull request.

## License

The test project is licensed under the same ISC license as the main package.