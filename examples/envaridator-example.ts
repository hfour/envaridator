// NOTE: 

// - This example uses https://github.com/hf/toi validators.
// - The validators are of type: `Validator<T> = (value: string | undefined) => T;`

import { Envaridator } from "../src/index"

import * as toi from "@toi/toi";
import * as toix from "@toi/toix";


let envaridator = new Envaridator();

process.env['CORRECT_URL'] = 'https://google.com';
process.env['WRONG_URL'] = 'htttps://google.com';
export const okURL = envaridator.register('CORRECT_URL', toi.required().and(toix.str.url({ protocol: "https:" })), "description for CORRECT_URL") // SHOULD PASS
export const wrongURL = envaridator.register('WRONG_URL', toi.required().and(toix.str.url({ protocol: "https:" })), "description for WRONG_URL") // SHOULD FAIL


process.env['SOME_VARIABLE'] = 'I exist!';
export const undefinedVariable = envaridator.register('V@R1ABL3', toi.required().and(toi.str.is()), "description for V@R1ABL3"); // SHOULD FAIL
export const existingVariable = envaridator.register('SOME_VARIABLE', toi.required().and(toi.str.is()), "description for SOME_VARIABLE"); // SHOULD PASS

process.env['SOME_OTHER_VARIABLE'] = 'I exist as well!';
export const objMyb = {
    VARIABLE3: envaridator.register('SOME_OTHER_VARIABLE', toi.required().and(toi.str.is()), "description for SOME_THER_VARIABLE"), // SHOULD PASS
}

// Will print the name and description of 
// the to-be validated environment variables
console.log(envaridator.describeAll()); 

try {
    envaridator.validate();
} catch (err) {
    console.log(err.message);
}


// This would result in a 'status report' which would look like this:

// The following environment variables are invalid:

// WRONG_URL - Invalid protocol: https:
// V@R1ABL3 - value is null or undefined
