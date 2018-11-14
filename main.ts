import { Envoi } from './index';
import * as toi from '@toi/toi';

let envoi = new Envoi();

const EDITOR = envoi.addVariable('EDITOR', toi.required().and(toi.num.is()));
const MAX_CON = envoi.addVariable('MAX_CON', toi.required());

const db = { 
    con: envoi.addVariable('CON', toi.required()),
    som: envoi.addVariable('SOM', toi.required()),
}

envoi.validate();