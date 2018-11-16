type Validator<T> = (value: string) => T;

type ValidationError = {
  name: string,
  message: string,
  toString(): string,
};

class EnvValidationError {
  constructor(private _envName: string, private toiValErr: ValidationError) {}

  toString() {
    return `${this._envName} environment variable is invalid: ${this.toiValErr}`;
  }
}

export class Envoi {
  private registeredEnvVars: { [name: string]: Envar<unknown> } = {};
  private failedEnvVars: EnvValidationError[] = [];

  registerVariable<T>(name: string, validator: Validator<T>) {
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
        this.registeredEnvVars[name].value;
      } catch (error) {
        this.failedEnvVars.push(new EnvValidationError(name, error));
      }
    });

    if (this.failedEnvVars.length > 0) {
      return this.failedEnvVars;
    }
  }
}

class Envar<T> {
  constructor(private _name: string, private _value: string, private _validator: Validator<T>) {}

  private validate() {
    return this._validator(this._value);
  }

  get name() {
    return this._name;
  }

  get value() {
    return this.validate();
  }
}
