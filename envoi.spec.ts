import { Envoi, Envar} from './envoi';
import * as toi from '@toi/toi';
import * as toix from '@toi/toix';

import 'mocha';
import * as chai from 'chai';

const expect = chai.expect

process.env['CORRECT_URL'] = 'https://google.com';
process.env['WRONG_URL'] = 'htttps://google.com';

it('should successfully register an environment variable', () => {
    const envoi = new Envoi();
    const correctURL = envoi.register('CORRECT_URL', toi.required());

    expect(correctURL instanceof Envar).to.eql(true);
})

it('should throw an error if the variable is already defined', () => {
    const envoi = new Envoi();
    envoi.register('CORRECT_URL', toi.required())

    expect(() => envoi.register('CORRECT_URL', toi.required())).to.throw("Variable CORRECT_URL already defined!");
})

it('should throw if the validation fails', () => {
    const envoi = new Envoi();
    envoi.register('WRONG_URL', toi.required().and(toix.str.url({ protocol: "https:" })))
    
    expect(() => envoi.validate()).to.throw("The following environment variables are invalid:\n\nWRONG_URL - Invalid protocol: https:\n");
})