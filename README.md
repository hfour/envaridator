![Envaridator Logo](/assets/envaridator-logo.png)
[![Build Status](https://travis-ci.com/hfour/envaridator.svg?branch=master)](https://travis-ci.com/hfour/envaridator)
[![npm version](https://badge.fury.io/js/envaridator.svg)](https://www.npmjs.com/package/envaridator)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/hfour/envaridator/blob/master/LICENSE.md)

# envaridator
[Docs](https://github.com/hfour/envaridator/wiki/Docs) | [Contributing](https://github.com/hfour/envaridator/wiki/Contributing) | [Wiki](https://github.com/hfour/envaridator/wiki)

`Envaridator` is a small environment variable management and validation library. It provides

* type safe access to your environment based configuration
* validation of all variables before your app starts
* the ability to show a list of the environment vars (e.g. something you might want to do if a `--help` flag is passed)


### Installation
Using `yarn`:
```
yarn add envaridator
```

or `npm`:
```
npm i --save envaridator
```

### Basic usage:

Note: the below example uses toi to validate the variable, but you can use any function that converts the variable to the desired type, or throws an error if the conversion fails.

Importing:
```typescript
import { Envaridator } from "envaridator";

let envaridator = new Envaridator();

import * as toi from "@toi/toi";
import * as toix from "@toi/toix";

const dbURL = envaridator.register(
  "DATABASE_URL",
  toi.required().and(toix.str.url({protocol: 'postgres'})),
  "The SQL database url. Must be a PostgreSQL database."
);

if (process.env['HELP']) {
  console.log(envaridator.describeAll());
  process.exit(0);
}

try {
  envaridator.validate();
} catch (err) {
  console.error(err.message);
  process.exit(1);
}

// After this point, we can use the variables

let db = createDatabase({url: dbURL.value})
```

If one or more registered environment variables fail the validation, `envaridator` will return a status report:

```
The following environment variables are invalid:

DATABASE_URL - Invalid protocol: mysql
```

### Misc

Why separate registration from use?

* validate all variables at once, reporting all invalid values instead of just the first one
* different parts of the app can import envaridator instance and register own variables during app "config" phase
* easy to show help listing all variables via `envaridator.describeAll`

### License

Envaridator is [MIT licensed](https://github.com/hfour/envaridator/blob/master/LICENSE.md).
