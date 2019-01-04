# react-constraint-validation
**React Constraint Validation** is a small library that provides validation props for React components similar to the HTML Constraint Validation attributes.

### Features

- HTML Constraint Validation attributes for React components (without refs)
- Easily extensible with own validators
- Localisation of error messages and interpolation
- Written in Typescript 
- Perfect fit to Formik

### Use case

You don't want to declare field-level validation like this with your form framework:

    <Field name="username" validate={[required, minLength2, maxLength20]} /> 
    
Instead you want to write:

    <Field name="username" required minLength={2} maxLength={20} />    
    
### Form framework needed

**React Constraint Validation** provides a HOC and some standard validators. The HOC can be used to enhance form components of your preferred form framework e.g. Formik.

Limitation: Actually it currently only supports Formik ;) Support for other form frameworks like Redux-Form is planned with one of the next releases.   
    
### Getting started
    
Add react-constraint-validation:

    $ npm install react-constraint-validation --save
    
Enhance a Formik field component with validation (should be done once per application):

    const NumberField = withValidator({required, min, max },{number})(Field);
    const TextField = withValidator({required, minLength, maxLength})(Field);
    const EmailField = withValidator({required},{email})(Field);    

Use your enhanced components in your form:

    <TextField name="username" required minLength={2} maxLength={20} />

A complete example can be found in [examples/formik](https://github.com/pstrh/react-constraint-validation/blob/master/examples/formik/src/components/FieldLevelValidation.tsx).

### WIP

This is a new project. The basic functionality is there and can be used.

Any feedback, suggestions and contributions are welcome. 
