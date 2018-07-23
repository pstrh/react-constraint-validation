import * as React from "react";

export type ValidationFunction = (name: string | undefined, value:any) => string | undefined;
export type ValidationFunctionWithParam = (name: string | undefined, value:any, param: any) => string | undefined;

type Validators = {[key:string]: ValidationFunction | ValidationFunctionWithParam};
type DefaultValidators = {[key:string]: ValidationFunction};

type ValidationProp<T> = {
    [P in keyof T]: any
}

interface FieldWithValidation {
    name?: string,
    validate?: (name: string, value:any) => string | undefined
}

interface ComponentDecorator<T> {
    <P extends FieldWithValidation>(component: React.ComponentType<P>): React.ComponentClass<P & Partial<ValidationProp<T>>>;
}

// TODO passThroughProps
// TODO validate props configuration (adaption for redux-form etc.)
// TODO add hoist static
export function withValidator<T extends Validators>(validators: T, defaultValidators?: DefaultValidators): ComponentDecorator<T> {

    return function createValidationWrapperHOC<P extends FieldWithValidation>(WrappedComponent: React.ComponentType<P>): React.ComponentClass<P & Partial<ValidationProp<T>>> {

        class ValidationWrapperHOC extends React.Component<P & Partial<ValidationProp<T>>> {

            constructor(props: P & Partial<ValidationProp<T>>) {
                super(props);
                this.validate = this.validate.bind(this);
            }

            validate(value: any): string | undefined {
                let error = this.applyDefaultValidators(defaultValidators, this.props.name, value);
                if (!error) {
                    error = this.applyValidators(validators, this.props.name, value);
                }
                return error;
            }

            applyValidators(validators: Validators, name: string | undefined, value: string): string | undefined {
                if (!validators) {
                    return undefined;
                }
                const props = this.props;
                let firstError: string | undefined = undefined;
                Object.keys(validators).some(function(key: string) {
                    const validatorParam = props[key];
                    if (validatorParam) {
                        if (typeof validatorParam === "boolean") {
                            const validate = validators[key] as ValidationFunction;
                            firstError = validate(name, value);
                        } else {
                            const validate = validators[key] as ValidationFunctionWithParam;
                            firstError = validate(name, value, validatorParam);
                        }
                    }
                    return firstError != undefined;
                });
                return firstError;
            }

            applyDefaultValidators(defaultValidators: undefined | DefaultValidators, name: string | undefined, value: string): string | undefined {
                if (!defaultValidators) {
                    return undefined;
                }
                let firstError: string | undefined = undefined;
                Object.keys(defaultValidators).some(function(key: string) {
                    const validate = defaultValidators[key] as ValidationFunction;
                    firstError = validate(name, value);
                    return firstError != undefined;
                });
                return firstError;
            }

            removeValidatorProps(props: Readonly<P & Partial<ValidationProp<T>>>): P {
                const clonedProps = Object.assign({}, props);
                Object.keys(validators).forEach(function(key: string) {
                    //@ts-ignore
                    delete clonedProps[key];
                });
                //@ts-ignore
                return clonedProps as P;
            }

            render() {
                const originalProps = this.removeValidatorProps(this.props);

                return (
                    <WrappedComponent {...originalProps} validate={this.validate}/>
                );
            }
        };

        return ValidationWrapperHOC;
    }
}


