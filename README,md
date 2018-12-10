envoi
=====

Envoi is a tiny environment variable validation library.

It's main purpose is to enable more clean approach in parsing, registering and validating environment variables.

Using it is pretty straightforward, for example:

```
let envoi = new Envoi();

export const VARIABLE1 = envoi.register('V@R1ABL3', toi.required().and(toi.str.is())); // SHOULD FAIL
export const VARIABLE2 = envoi.register('VARIABLE2', toi.required().and(toi.str.is())); // SHOULD PASS

export const db = { 
    VARIABLE3: envoi.register('VARIABLE3', toi.required().and(toi.str.is())), // SHOULD PASS
}

export const OKURL = envoi.register('OKURL', toi.required().and(toix.str.url({ protocol: "https:" }))); // SHOULD PASS
export const FAILURL = envoi.register('FAILURL', toi.required().and(toix.str.url({ protocol: "https:" }))); // SHOULD FAIL

envoi.validate();
```

Will fail and exit with:

```
{
  "name": "V@R1ABL3",
  "message": "Environment variable: V@R1ABL3 is undefined."
}
{
  "name": "FAILURL",
  "message": "Invalid protocol: https:"
}

One or more evironment variables were not validated correctly
```

or If you don't want to validate more variables at once, 

```
export const FAILURL = new Envar('FAILURL', toi.required().and(toix.str.url({ protocol: "https:" })));

console.log(FAILURL.value);
```

Will return the value if validated correctly, or throw an error if not.

Contributing
------------

TODO

LICENSE
-------

TODO
