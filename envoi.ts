/**
 * Envoi is a TypeScript environment variable validator.
 */

type RegisteredVariable = { [name: string]: Envar<unknown> }

type Validator<T> = (value: string) => T;

type ValidationError = {
  name: string,
  message: string,
  toString(): string,
};

/**
 * When an environment variable is being registered,
 * it's name, value, and validator are assigned to
 * a {@link Envar} object for later use.
 */
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

export class EnvarError {
  constructor(private _environmentVariableName: string, private validationError: ValidationError) {}

  toString() {
    return `Environment variable: ${this._environmentVariableName} failed validation with: ${this.validationError}\n`;
  }
}

/**
 * Envoi handles the registration and validation 
 * of the environment variables.
 */
export class Envoi {
  private registeredVariables: RegisteredVariable = {};
  private failedVariables: EnvarError[] = [];

  /**
   * register is a function that tries to extract the 
   * environment variable value from the given environment 
   * variable name, if everything goes correctly, 
   * it will return a new {@link Envar}.
   * 
   * @param name the name of the environment variable
   * @param validator the actual validator (e.g. toi.required().and(toi.str.is()))
   */
  register<T>(name: string, validator: Validator<T>) {
    const value: string | undefined = process.env[name];

    if (!value) throw new Error(`Variable ${name} is undefined!`);
    if (this.registeredVariables[name] != null) throw new Error(`Variable ${name} already defined!`);

    const envar = new Envar(name, value, validator);
    this.registeredVariables[name] = envar;

    return envar;
  }

  /**
   * Iterates over {@link registeredVariables} and 
   * calls the validator function on every {@link Envar}.
   * If the variables are successfully validated, it returns 
   * {@link registeredVariables}.
   * 
   * In case one or more variables fail their validation, 
   * it returns {@link failedVariables} instead.
   */
  validate() {
    Object.keys(this.registeredVariables).forEach(name => {
      try {
        this.registeredVariables[name].value;
      } catch (validationError) {
        this.failedVariables.push(new EnvarError(name, validationError));
      }
    });

    if (this.failedVariables.length > 0) 
      return this.failedVariables;
    else
      return this.registeredVariables;
  }
}
