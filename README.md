![Envaridator Logo](/assets/envaridator-logo.png)
[![Build Status](https://travis-ci.com/hfour/envaridator.svg?branch=master)](https://travis-ci.com/hfour/envaridator)
[![npm version](https://badge.fury.io/js/envaridator.svg)](https://www.npmjs.com/package/envaridator)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/hfour/envaridator/blob/master/LICENSE.md)

# envaridator
[Docs](https://github.com/hfour/envaridator/wiki/Docs) | [Contributing](https://github.com/hfour/envaridator/wiki/Contributing) | [Wiki](https://github.com/hfour/envaridator/wiki)

`Envaridator` is a small environment variable validation library. You can find the installation guide and basic usage bellow.

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

Importing:
```typescript
import { Envaridator } from "envaridator";
```

#### Example
Note: This example uses [toi](https://github.com/hf/toi)'s validators. You can always write your own validators or use existing ones. Check the [wiki]() to learn more about the validators

```typescript
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
  "description for the CORRECT_URL environment variable."
);

process.env["WRONG_URL"] = "htttps://google.com"; // invalid URL protocol
const badURL = envaridator.register(
  "WRONG_URL",
  toi.required().and(
    toix.str.url({
      protocol: "https:"
    })
  ),
  "description for the WRONG_URL environment variable."
);

try {
  envaridator.validate();
} catch (err) {
  console.log(err.message);
}
```

If one or more registered environment variables fail the validation, `envaridator` will return a status report:

```
The following environment variables are invalid:

WRONG_URL - Invalid protocol: https:
```

### License

Envaridator is [MIT licensed](https://github.com/hfour/envaridator/blob/master/LICENSE.md).