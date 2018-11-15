import * as toi from '@toi/toi';

interface err {
  envName: string;
  toiValErr: toi.ValidationError;
}

export class Envoi {
  private registeredEnvVars: { [name: string]: Envar } = {};
  private failedEnvVars: err[] = [];

  registerVariable(name: string, validator: toi.Validator<unknown, unknown>) {
    // Check if the environment variable exists
    const value: string | undefined = process.env[name];
    // if not, throw an error
    if (!value) throw new Error(`Variable ${name} is undefined!`);

    // Check if the name is already in the registered
    // environment variables; if not, throw an error.
    if (this.registeredEnvVars[name] != null) throw new Error(`Variable ${name} already defined!`);

    // Create a new Enver()
    const envar = new Envar(name, value, validator);
    // and assign it to the registered environment variables
    this.registeredEnvVars[name] = envar;

    return envar;
  }

  validateEnvVars() {
    Object.keys(this.registeredEnvVars).forEach(name => {
      try {
        this.registeredEnvVars[name].validate();
      } catch (error) {
        this.failedEnvVars.push({ envName: name, toiValErr: error });
      }
    });

    if (this.failedEnvVars.length > 0) {
      this.showErrors(this.failedEnvVars.length);
    }
  }

  showErrors(err: number) {
    for (let i = 0; i < err; i++) {
      console.log(
        `${this.failedEnvVars[i].toiValErr.name}: ${this.failedEnvVars[i].envName}, ${
          this.failedEnvVars[i].toiValErr.message
        }`,
      );
    }
    process.exit(1);
  }
}

class Envar {
  constructor(private _name: string, private _value: string, private _validator: toi.Validator<unknown, unknown>) {}

  validate() {
    return this._validator(this._value);
  }

  get name() {
    return this._name;
  }

  get value() {
    return this._value;
  }
}
