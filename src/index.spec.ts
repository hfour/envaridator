import { Envaridator, Envar } from '.';
import * as toi from '@toi/toi';
import * as toix from '@toi/toix';

process.env['CORRECT_URL'] = 'https://google.com';
process.env['WRONG_URL'] = 'htttps://google.com';

it('should successfully register an environment variable', () => {
  const envaridator = new Envaridator();
  const correctURL = envaridator.register(
    'CORRECT_URL',
    toi.required(),
    'A correct url for this app',
  );

  expect(correctURL instanceof Envar).toEqual(true);
});

it('should throw an error if the variable is already defined', () => {
  const envaridator = new Envaridator();
  envaridator.register('CORRECT_URL', toi.required(), 'A correct url for this app');

  expect(() =>
    envaridator.register('CORRECT_URL', toi.required(), 'A correct url for this app'),
  ).toThrow('Variable CORRECT_URL already defined!');
});

it('should successfully register an Envar', () => {
  const envar = new Envar(
    'CORRECT_URL',
    toi.required().and(toix.str.url({ protocol: 'https:' })),
    'some description',
  );

  expect(envar.name).toEqual('CORRECT_URL');
});

it('should successfully get the value of the Envar', () => {
  const envar = new Envar(
    'CORRECT_URL',
    toi.required().and(toix.str.url({ protocol: 'https:' })),
    'some description',
  );

  expect(envar.value.protocol).toEqual('https:');
});

it('should throw validation error if Envar value is invalid', () => {
  const envar = new Envar(
    'WRONG_URL',
    toi.required().and(toix.str.url({ protocol: 'https:' })),
    'A wrong url for this app',
  );

  expect(() => envar.value).toThrow('WRONG_URL - Invalid protocol: https:');
});

it('should not throw if all of the variables and rules are successfully validated', () => {
  const envaridator = new Envaridator();

  envaridator.register(
    'CORRECT_URL',
    toi.required().and(toix.str.url({ protocol: 'https:' })),
    'A correct url for this app',
  );

  envaridator.registerPostValidation('Empty post validation rule', () => {});

  // plain return is enough because the test if it not throws if everything is alright.
  expect(() => envaridator.validate()).not.toThrow();
});

it('should cache the previous value', () => {
  const envar = new Envar(
    'CORRECT_URL',
    toi.required().and(toix.str.url({ protocol: 'https:' })),
    'some description',
  );

  let a = envar.value;
  let b = envar.value;

  expect(a).toEqual(b);
});

it('should throw if the validation fails', () => {
  const envaridator = new Envaridator();
  envaridator.register(
    'WRONG_URL',
    toi.required().and(toix.str.url({ protocol: 'https:' })),
    'A wrong url for this app',
  );

  expect(() => envaridator.validate()).toThrow(
    'The following environment variables are invalid:\n\nWRONG_URL - Invalid protocol: https:',
  );
});

it('should throw if a post validation rule fails', () => {
  const envaridator = new Envaridator();
  envaridator.registerPostValidation(
    'This rule will throw when the envaridator validate is run',
    () => {
      throw new Error('This rule should throw');
    },
  );

  expect(() => envaridator.validate()).toThrow(
    'The following validation rules are invalid:\n\nThis rule should throw',
  );
});

it('should throw if a post validation rule fails', () => {
  const envaridator = new Envaridator();

  envaridator.register(
    'WRONG_URL',
    toi.required().and(toix.str.url({ protocol: 'https:' })),
    'A wrong url for this app',
  );
  envaridator.registerPostValidation(
    'This rule will throw when the envaridator validate is run',
    () => {
      throw new Error('This rule should throw');
    },
  );

  expect(() => envaridator.validate()).toThrow(
    'The following environment variables are invalid:\n\nWRONG_URL - Invalid protocol: https:\n\nThe following validation rules are invalid:\n\nThis rule should throw',
  );
});

it('should describe all registered variables and rules, sorted alphabetically', () => {
  const envaridator = new Envaridator();
  envaridator.register(
    'VAR_2',
    toi.required(),
    'The second variable. Must be configured correctly.',
  );
  envaridator.register(
    'VAR_1',
    toi.required(),
    'The first variable. Must be configured correctly.',
  );

  envaridator.registerPostValidation('The first rule. Must be configured correctly.', () => {});
  expect(envaridator.describeAll()).toMatchInlineSnapshot(`
"VAR_1 - The first variable. Must be configured correctly.
VAR_2 - The second variable. Must be configured correctly.
The first rule. Must be configured correctly."
`);
});

it('should describe all registered variables with some markdown formatting, sorted alphabetically', () => {
  const envaridator = new Envaridator();
  envaridator.register(
    'VAR_2',
    toi.required(),
    'The second variable. Must be configured correctly.',
  );
  envaridator.register(
    'VAR_1',
    toi.required(),
    'The first variable. Must be configured correctly.',
  );
  envaridator.register(
    'VAR_3',
    toi.required(),
    'The third variable. Must be configured correctly.',
  );
  expect(envaridator.describeAllMarkdown()).toMatchInlineSnapshot(`
"#Variables
**VAR_1** - The first variable. Must be configured correctly.
**VAR_2** - The second variable. Must be configured correctly.
**VAR_3** - The third variable. Must be configured correctly."
`);
});

it('should describe all rules with some markdown formatting, sorted alphabetically', () => {
  const envaridator = new Envaridator();
  envaridator.registerPostValidation('The first rule. Must be configured correctly.', () => {});
  expect(envaridator.describeAllMarkdown()).toMatchInlineSnapshot(`
"#Post validation rules
The first rule. Must be configured correctly."
`);
});

it('should describe all registered variables and rules with some markdown formatting, sorted alphabetically', () => {
  const envaridator = new Envaridator();
  envaridator.register(
    'VAR_2',
    toi.required(),
    'The second variable. Must be configured correctly.',
  );
  envaridator.register(
    'VAR_1',
    toi.required(),
    'The first variable. Must be configured correctly.',
  );
  envaridator.register(
    'VAR_3',
    toi.required(),
    'The third variable. Must be configured correctly.',
  );
  envaridator.registerPostValidation('The first rule. Must be configured correctly.', () => {});
  expect(envaridator.describeAllMarkdown()).toMatchInlineSnapshot(`
"#Variables
**VAR_1** - The first variable. Must be configured correctly.
**VAR_2** - The second variable. Must be configured correctly.
**VAR_3** - The third variable. Must be configured correctly.
#Post validation rules
The first rule. Must be configured correctly."
`);
});
