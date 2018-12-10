import { Envoi, Envar } from './envoi';
import * as toi from '@toi/toi';
import * as toix from '@toi/toix';

process.env['CORRECT_URL'] = 'https://google.com';
process.env['WRONG_URL'] = 'htttps://google.com';

it('should successfully register an environment variable', () => {
  const envoi = new Envoi();
  const correctURL = envoi.register('CORRECT_URL', toi.required(), 'A correct url for this app');

  expect(correctURL instanceof Envar).toEqual(true);
});

it('should throw an error if the variable is already defined', () => {
  const envoi = new Envoi();
  envoi.register('CORRECT_URL', toi.required(), 'A correct url for this app');

  expect(() => envoi.register('CORRECT_URL', toi.required(), 'A correct url for this app')).toThrow(
    'Variable CORRECT_URL already defined!'
  );
});

it('should throw if the validation fails', () => {
  const envoi = new Envoi();
  envoi.register(
    'WRONG_URL',
    toi.required().and(toix.str.url({ protocol: 'https:' })),
    'A wrong url for this app'
  );

  expect(() => envoi.validate()).toThrow(
    'The following environment variables are invalid:\n\nWRONG_URL - Invalid protocol: https:\n'
  );
});

it('should describe all registered variables', () => {
  const envoi = new Envoi();
  envoi.register('VAR_1', toi.required(), 'The first variable. Must be configured correctly.');
  envoi.register('VAR_2', toi.required(), 'The second variable. Must be configured correctly.');
  envoi.register('VAR_3', toi.required(), 'The third variable. Must be configured correctly.');
  expect(envoi.describeAll()).toMatchInlineSnapshot(`
"VAR_1 - The first variable. Must be configured correctly.
VAR_2 - The second variable. Must be configured correctly.
VAR_3 - The third variable. Must be configured correctly."
`);
});
