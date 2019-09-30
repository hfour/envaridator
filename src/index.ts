/**
 * Envaridator is a TypeScript environment variable validator.
 */

type Validator<T> = (value: string | undefined) => T;
type PostValidator = () => void;

type RegisteredVariable = {
  [name: string]: Envar<unknown>;
};

/**
 * Envaridator handles the registration and validation
 * of the environment variables.
 */
export class Envaridator {
  private registeredVariables: RegisteredVariable = {};
  private postValidations: Rule[] = [];

  private variablesStatus(failedVariables: string[]) {
    failedVariables.unshift('The following environment variables are invalid:\n');
    const data = failedVariables.join('\n');
    return data;
  }

  private rulesStatus(failedRules: string[]) {
    failedRules.unshift('The following validation rules are invalid:\n');
    const data = failedRules.join('\n');
    return data;
  }

  /**
   * register is a function that tries to extract the
   * environment variable value from the given environment
   * variable name, if everything goes correctly,
   * it will return a new {@link Envar}.
   *
   * @param name the name of the environment variable
   * @param validator the actual validator (e.g. toi.required().and(toi.str.is()))
   * @param description string describing the variable
   */
  register<T>(name: string, validator: Validator<T>, description: string) {
    if (this.registeredVariables[name] != null) throw new Error(`Variable ${name} already defined!`);

    const envar = new Envar(name, validator, description);
    this.registeredVariables[name] = envar;

    return envar;
  }

  /**
   * registerPostValidation adds a validation rule which is run after all variable validations.
   * It should be used to validate rules on the whole config i.e. for migrating of an environment variable.
   *
   * @param name the name of the environment variable
   * @param validator function which should throw if the config is not validated
   * @param description string describing the variable
   */
  registerPostValidation(description: string, validator: PostValidator) {
    const rule = new Rule(description, validator);
    this.postValidations.push(rule);
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
    let failedVariables: string[] = [];

    Object.keys(this.registeredVariables).forEach(name => {
      try {
        this.registeredVariables[name].value;
      } catch (validationError) {
        failedVariables.push(validationError.message);
      }
    });

    if (failedVariables.length > 0) {
      throw new Error(this.variablesStatus(failedVariables));
    }

    if (this.postValidations.length > 0) {
      this.postValidations.forEach(rule => {
        try {
          rule.validate();
        } catch (validationError) {
          failedVariables.push(validationError.message);
        }
      });
    }

    if (failedVariables.length > 0) {
      throw new Error(this.rulesStatus(failedVariables));
    }
  }

  /**
   * Describe all registered environment variables
   */
  describeAll() {
    const envars = Object.keys(this.registeredVariables).map(
      name => `${name} - ${this.registeredVariables[name].description}`,
    );

    const rules = this.postValidations.map(rule => rule.description);

    return [...envars, ...rules].join('\n');
  }

  /**
   * Describe all registered environment variables with some markdown flavor
   */
  describeAllMarkdown() {
    const envars = Object.keys(this.registeredVariables)
      .map(name => `**${name}** - ${this.registeredVariables[name].description}`)
      .join('\n');

    const rules = this.postValidations.map(rule => rule.description).join('\n');

    let result: string[] = [];
    if (envars.length > 0) {
      result.push('#Variables', envars);
    }
    if (rules.length > 0) {
      result.push('#Post validation rules', rules);
    }

    return result.join('\n');
  }
}

/**
 * When an environment variable is being registered,
 * it's name, value, and validator are assigned to
 * a {@link Envar} object for later use.
 */
export class Envar<T> {
  constructor(readonly name: string, private readonly validator: Validator<T>, readonly description: string) {}

  private cache: { empty: true } | { value: T } = { empty: true };

  private validate() {
    if ('empty' in this.cache) {
      const value: string | undefined = process.env[this.name];
      this.cache = { value: this.validator(value) };
    }

    return this.cache.value;
  }

  get value() {
    try {
      return this.validate();
    } catch (error) {
      throw new Error(`${this.name} - ${error.message}`);
    }
  }
}

/**
 * When an environment variable is being registered,
 * it's name, value, and validator are assigned to
 * a {@link Envar} object for later use.
 */
export class Rule {
  constructor(readonly description: string, readonly validator: PostValidator) {}

  validate() {
    try {
      return this.validator();
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
