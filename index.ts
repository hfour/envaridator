import * as toi from '@toi/toi';

export class Envoi {
    private environmentVariables: {[name: string]: Envar} = {};
    private errors: toi.ValidationError[] = [];

    addVariable(name: string, validator: toi.Validator<unknown, unknown>) {
        if (this.environmentVariables[name] != null) throw new Error (`Variable ${name} already defined.`);

        const ev = new Envar(name, validator);
        this.environmentVariables[name] = ev;
        return ev;
    }

    validate() {
        Object.keys(this.environmentVariables).forEach(name => {
            try {
                this.environmentVariables[name].validate()
            } catch (e) {
                this.errors.push(e);
            }
        });
      
        if (this.errors.length > 0) {
            this.showErrors();
            process.exit(1);
        } else { console.log("All environment variables are valid.");  }
    }

    private showErrors() {
        console.log(this.errors);
    }
}

class Envar {
    constructor(private _name: string, private validator: toi.Validator<unknown, unknown>) {}

    validate() {
        return this.validator(process.env[this._name]);
    }

    name() {
        return this._name;
    } 
}