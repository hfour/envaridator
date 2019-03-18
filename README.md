![Envaridator Logo](/assets/envaridator-logo.png)
[![Build Status](https://travis-ci.com/hfour/envaridator.svg?branch=master)](https://travis-ci.com/hfour/envaridator)

# Envaridator

`Envaridator` is a small environment variable validation library. Install and basic usage can be found bellow. For documentation, please visit the [wiki](https://github.com/hfour/envaridator/wiki).

### Install
Installing the packages can be done either with:

yarn:
```
yarn add envaridator
```

or with npm:
```
npm i --save envaridator
```

### Basic usage:

NOTE: This example uses [toi](https://github.com/hf/toi)'s validators. You can always write your own validators or use existing ones.

```typescript
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