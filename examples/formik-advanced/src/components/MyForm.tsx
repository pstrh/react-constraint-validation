import * as React from 'react';
import {
    withValidator,
    required,
    min,
    max,
    number,
    minLength,
    maxLength,
    email,
    resolveErrorMessage
} from '../../../../src';
import {Field, Form, Formik} from "formik";
import {TextField as FormikMuiTextField} from "formik-material-ui";
import {Button, Typography} from "@material-ui/core";
import {TextFieldProps} from "@material-ui/core/TextField";

const upperCase = (name: string | undefined, value: string): string | undefined => {
    console.log("upperCase");
    if (value && value.toUpperCase() !== value) {
        // helper method to resolve error message with key = "upperCase"
        return resolveErrorMessage("upperCase", name, {});
    } else {
        return undefined;
    }
}

const MyField = (props: TextFieldProps) => (<Field {...props} component={FormikMuiTextField}/>);

const NumberField = withValidator({required, min, max},{number})(MyField);

const TextField = withValidator({required, minLength, maxLength, upperCase})(MyField);

const EmailField = withValidator({required},{email})(MyField);

// put cross field validations that are highly form specific on form level
const crossFieldValidation = (values: any): {} => {
    if (values.username && values.username === "PETER" && values.age < 40) {
        return { age: "Age of PETER must be 40+" }
    }
    return {};
}

const MyForm = () => (
    <div>
        <Typography variant="h5">Pick a username</Typography>
        <Formik
            initialValues={{ username: "", age: "", email: "" }}
            onSubmit={values => {
                alert(JSON.stringify(values, null, 2));
            }}
            validate={crossFieldValidation}
            render={({
                         errors,
                         touched,
                         setFieldValue,
                         setFieldTouched,
                         validateField,
                         validateForm,
                         resetForm
                     }) => (
                <Form>
                    <div>
                        <TextField
                            name="username"
                            required
                            minLength={2}
                            maxLength={20}
                            upperCase
                            type="text"
                            label="Username"
                        />
                    </div>
                    <div>
                        <NumberField
                            name="age"
                            label="Age"
                            required
                            min={18}
                            max={120}
                            type="text"
                        />
                    </div>
                    <div>
                        <EmailField
                            name="email"
                            required
                            type="text"
                            label="Email"
                        />
                    </div>
                    <br />
                    <div>
                        <Button type="button" onClick={(e) => resetForm()}>
                            reset form
                        </Button>
                        <Button type="submit">Submit</Button>
                    </div>
                </Form>
            )}
        />
    </div>
);

export default MyForm;