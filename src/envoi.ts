/**
 * Envoi is a TypeScript environment variable validator.
 */

type Validator<T> = (value: string | undefined) => T;

type RegisteredVariable = { 
  [name: string]: Envar<unknown> 
}

type ValidationError = { 
  message: string
};

/**
 * Envoi handles the registration and validation 
 * of the environment variables.
 */
export class Envoi {
  private registeredVariables: RegisteredVariable = {};

  private status(failedVariables: EnvarError[]) {
    let status: string = `The following environment variables are invalid:\n\n`

    failedVariables.forEach(envar => {
      status += `${envar.errorVariableName} - ${envar.errorMessage}\n`
    })

    return status;
  }

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
    if (this.registeredVariables[name] != null) throw new Error(`Variable ${name} already defined!`);

    const envar = new Envar(name, validator);
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
    let failedVariables: EnvarError[] = []

    Object.keys(this.registeredVariables).forEach(name => {
      try {
        this.registeredVariables[name].value;
      } catch (validationError) {
        failedVariables.push(new EnvarError(name, validationError));
      }
    });

    if (failedVariables.length > 0) {
      throw new Error(this.status(failedVariables));
    };
  }
}

/**
 * When an environment variable is being registered,
 * it's name, value, and validator are assigned to
 * a {@link Envar} object for later use.
 */
export class Envar<T> {
  constructor(private _name: string, private _validator: Validator<T>) {}

  private cache: {empty: true} | {value: T} = { empty: true };

  private validate() {
    if ("empty" in this.cache) {
      const value: string | undefined = process.env[this._name];
      this.cache = {value: this._validator(value)};
    }
  
    return this.cache.value;
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

  get errorMessage() {
    return this.validationError.message;
  }

  get errorVariableName() {
    return this._environmentVariableName;
  }
}