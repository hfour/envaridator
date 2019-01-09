# Envaridator

Envaridator is a really small environment variable validation library.

## Install

Installing the package can be achieved by:

```
yarn add envaridator

npm i --save envaridator
```

## Basic usage:

```
import { Envaridator } from "envaridator";

let envaridator = new Envaridator();

import * as toi from "@toi/toi";
import * as toix from "@toi/toix";

process.env["CORRECT_URL"] = "https://google.com";
const okURL = envaridator.register(
  "CORRECT_URL",
  toi.required().and(
    toix.str.url({
      protocol: "https:"
    })
  ),
  "description"
);

process.env["WRONG_URL"] = "httttps://google.com";
const badURL = envaridator.register(
  "WRONG_URL",
  toi.required().and(
    toix.str.url({
      protocol: "https:"
    })
  ),
  "description for WRONG_URL"
); // SHOULD FAIL

try {
  envaridator.validate();
} catch (err) {
  console.log(err.message);
}
```

This would result in a status report:

```
The following environment variables are invalid:

WRONG_URL - Invalid protocol: https:
```

## Documentation

### Envaridator

The get you up and running, you need an instance of `Envaridator`.

`let envaridator = new Envaridator();`

`Envaridator` offers few methods:

- `envaridator.register(<VARIABLE_NAME>, <VALIDATOR>, <DESCRIPTION>)`

The `VARIABLE_NAME` should be the actual environment variable name, the `VALIDATOR` should be a validator
of type `Validator<T> = (value: string | undefined) => T;` and the `DESCRIPTION` is the
description of the environment variable (usually what it is or what it does).

- `envaridator.describeAll()`

Returns the name and the description of the registered (in envaridator) environment variables.

- `envaridator.validate()` - validates the registered variables, if one or more variables
fail the validation - throws an error with a status report which includes the name of environment variable that failed the validation and also the reason.

### Envar

A successfully registered variable will return an `Envar`.

The Envar object contains the description of the registered environment variable, it's value
and it's name.

For example:

```export const okURL = envaridator.register('CORRECT_URL', toi.required().and(toix.str.url({ protocol: "https:" })), "description for CORRECT_URL")```

- `okURL.description => "description for CORRECT_URL"`
- `okURL.value => an URL object`
- `okURL.name => "CORRECT_URL"`

## License

Licensed under the MIT license. You can get a copy of it in `LICENSE.md`.
