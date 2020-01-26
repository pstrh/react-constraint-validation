# react-constraint-validation
**React Constraint Validation** is a small library that provides validation props for React components similar to the HTML Constraint Validation attributes.

### Features

- HTML Constraint Validation attributes (like required, min, maxLength) for React components (without refs)
- Easily extensible with own validators
- Localisation of error messages and interpolation
- Written in Typescript 
- Perfect fit to Formik

### Use case

You don't want to declare field-level validation like this with your form framework:

    <Field name="username" validate={[required, minLength2, maxLength20]} /> 
    
Instead you want to create Fields that directly support these validations with respective props:

    <Field name="username" required minLength={2} maxLength={20} />    
    
### Form framework needed

**React Constraint Validation** provides a HOC and some standard validators. The HOC can be used to enhance form components of your preferred form framework e.g. Formik.

Limitation: Actually it currently only supports Formik ;) Support for other form frameworks like React Final Form is planned with one of the next releases.   
    
### Getting started
    
Add react-constraint-validation:

    npm i react-constraint-validation # or yarn add react-constraint-validation
    
Enhance a Formik field component with validation (should be done once per application):

    import {withValidator, required, min, max, number, minLength, maxLength, email} from "react-constraint-validation";
    
    const TextField = withValidator({required, minLength, maxLength})(Field);
    const NumberField = withValidator({required, min, max}, {number})(Field);    
    const EmailField = withValidator({required}, {email})(Field);    

Use your enhanced components in your form:

    <TextField name="username" required minLength={2} maxLength={20} />
    <NumberField name="age" required min={20} max={120} />
    <EmailField name="email" required />

A complete example can be found in [examples/formik](https://github.com/pstrh/react-constraint-validation/blob/master/examples/formik/src/components/FieldLevelValidation.tsx).

### Validators

**React Constraint Validation** provides the following validations out-of-the-box:
* `required` checks that the given value is not null, undefined or an empty string
* `min` checks that the given number value is equal or greater than the given lower bound
* `max` checks that the given value is smaller than or equal to the given upper bound 
* `minLength` checks that the length of the given string value is equal or greater than the given length
* `maxLength` checks that the length of the given string value is smaller or equal to the given length
* `pattern` checks if the given value matches a RegEx pattern
* `number` checks if the given value is a number
* `email` checks if the given value is a valid email (via a RegEx pattern)

### The withValidator HOC (experimental)

Fields wrapped with the withValidator HOC can be configured with two kinds of validators:
- (optional) validators that can be activated via field props
- default validators that should be always executed as they are inherent to the specific field type

Take a look at the examples:

    const TextField = withValidator({required, minLength, maxLength})(Field);
    const NumberField = withValidator({required, min, max}, {number})(Field); 
    
    <TextField name="name" required />
    <NumberField name="amount" required min={100} />
    
NumberField has the optional validations `required`, `min` and `max`. These validations can (but don't have to) be set via field props. 
Whereas the `number` validation is defined as default validation and is always applied.     
Textfield on the other hand doesn't enforce a default validation. Here only the optional validations `required`, 
`minLength` and `maxLength` are configured on the field.

### Default error messages

The following object defines the default error messages:

```
const defaultMessages: Messages = {
    "required": "{name} is required",
    "min": "{name} must be greater than {minValue}",
    "max": "{name} must be less than {maxValue}",
    "minLength": "{name} must have at least {minLength} characters",
    "maxLength": "{name} must have less than {maxLength} characters",
    "pattern": "{name} does not match the pattern {pattern}",
    "number": "{name} must be a number",
    "email": "{name} is not a valid email"
};
```

The placeholders `{name}`, `{minValue}`, `{maxValue}` and so on are replaced if the actual error message is created. `name` is the name of the form field. The other placeholders like `{minValue}` provide access to the respective validation constraints.

### Custom error messages

If you want to override the default error messages, just initialize the Validator with a custom error message object as shown in the following example:

```
import * as Validator from "react-constraint-validation";

const customErrorMessages = {    
    "required": "This field is required", // override without placeholder
    "number": "Enter only numbers in {name}"
};

Validator.init(customErrorMessages);
```

In the `init` method the custom error messages are merged with the default messages. As you can see in the `required` example, it's not necessary to use the placeholders of the default error 
messages. Usage of the placeholders in the custom error messages is optional. 

If you want to create custom error messages for a specific field, you can just add an additional attribute following
 the pattern `required.<name>` (where name is the name attribute of the field).
 
 ```
 import * as Validator from "react-constraint-validation";
 
 const customErrorMessages = {    
     "required": "This field is required", // Error message for all other fields
     "required.firstName": "First name is required", // Error message for field 'firstName'
     "required.lastName": "Last name is required", // Error message for field 'lastName'
     "number": "Enter only numbers in {name}"
 };
 
 Validator.init(customErrorMessages);
 ```

E.g. for the required validation on the field 'firstName' react-constraint-validation will first check if the attribute 
`required.firstname` is contained in the errorMessage object. If `required.firstname` is not present it will 
retreive the error message configured via the `required` attribute.  

### Localisation

Localisation of the error messages can be done in the same way as you customize the default error messages. Just initialize the Validator with an object of localized error messages as shown below:

```
import * as Validator from "react-constraint-validation";

// should be content of your localisation file
const germanMessages: Messages = {
    "required": "Bitte fülllen Sie dieses Feld",
    "min": "Der Wert des Feldes muss größer als {minValue} sein",
    "max": "Der Wert des Feldes darf nicht größer sein als {maxValue}",
    "minLength": "Bitte geben Sie mindestens {minLength} Zeichen ein",
    "maxLength": "Bitte geben Sie nicht mehr als {maxLength} Zeichen ein",
    "pattern": "Die Eingabe hat ein ungültiges Format",
    "number": "Hier sind nur Zahlen erlaubt",
    "email": "Die Email-Adresse ist nicht korrekt"
};

// to be called if user locale changes
Validator.init(germanMessages);
```

### Create custom validators

If needed, you can create additional custom validators and configured them on your field via the withValidator HOC.

The following example illustrates how to create a custom validator. As a sample use case we create an "UpperCaseValidator".

```
import { init, required, resolveErrorMessage, withValidator } from "react-constraint-validation";

// add new error message with key = "upperCase"
init({
    "upperCase": "Given text must be upper case only"
});

// create validator 
const upperCase = (name: string | undefined, value: string): string | undefined => {
    console.log("upperCase");
    if (value && value.toUpperCase() !== value) {
        // helper method to resolve error message with key = "upperCase"
        return resolveErrorMessage("upperCase", name, {});
    } else {
        return undefined;
    }
}

// bind validator to field
const TextField = withValidator({required, upperCase})(Field);

// activate upperCase validation in TextField   
<TextField name="myUpperCaseField" upperCase/>
```

A custom validator must implement one of the following APIs:

    type ValidationFunction = (name: string | undefined, value:any) => string | undefined;
    type ValidationFunctionWithParam = (name: string | undefined, value:any, param: any) => string | undefined;

The type `ValidationFunctionWithParam` can be used if the validator takes an argument like `minLenght={5}`. 

### Field-Level vs. Form-Level validation

**React Constraint Validation** is designed to provide standard fields with build-in validation support (EmailField, NumberField and so on). 

Therefore it might be useful if you need to build an application with many form fields or if you provide a component library for a number of different applications. If you only need to implement one or two small forms in your application using react-constraint-validation might be less useful.

Furthermore as this small library is designed to provide standard fields it is solely focused on field-level validation. Cross field or multi field validations is an aspect that depends on the individual form rather than on the single field. It's therefore better done on the form level 
(unfortunetly there is currently an issue with Formik as it execute form level validation before the field level validation).     

### About

This project is experimental and still work in progress. Feel free to try. Feedback, suggestions and any kind of contribution is welcome. 

### License

[MIT](./LICENSE)
