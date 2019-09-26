import * as React from 'react';
import {withValidator, required, min, max, number, minLength, maxLength, email} from '../../../../.';
import {ErrorMessage, Field, Form, Formik} from "formik";

const NumberField = withValidator({required, min, max },{number})(Field);

const TextField = withValidator({required, minLength, maxLength})(Field);

const EmailField = withValidator({required},{email})(Field);

const FieldLevelValidation = () => (
    <div>
        <h1>Pick a username</h1>
        <Formik
            initialValues={{ username: "", age: "", email: "" }}
            onSubmit={values => {
                alert(JSON.stringify(values, null, 2));
            }}
            render={({
                         errors,
                         touched,
                         setFieldValue,
                         setFieldTouched,
                         validateField,
                         validateForm,
                     }) => (
                <Form>
                    <label htmlFor="username">Username</label>
                    <div>
                        <TextField
                            name="username"
                            required
                            minLength={2}
                            maxLength={20}
                            type="text"
                            placeholder="Username"
                        />
                        <ErrorMessage component="div" name="username"/>
                    </div>
                    <br />
                    <label htmlFor="age">Age</label>
                    <div>
                        <NumberField
                            name="age"
                            required
                            min={18}
                            max={120}
                            type="text"
                            placeholder="Age"
                        />
                        <ErrorMessage component="div" name="age"/>
                    </div>
                    <br />
                    <label htmlFor="email">Email</label>
                    <div>
                        <EmailField
                            name="email"
                            required
                            type="text"
                            placeholder="Email"
                        />
                        <ErrorMessage component="div" name="email"/>
                    </div>
                    <div>
            <pre>
              Errors:<br />
                {JSON.stringify(errors, null, 2)}
            </pre>
                    </div>
                    <div>
            <pre>
              Touched:<br />
                {JSON.stringify(touched, null, 2)}
            </pre>
                    </div>

                    <div>
                        <div>username actions</div>
                        <button
                            type="button"
                            onClick={() => {
                                setFieldTouched('username', true, true);
                            }}
                        >
                            setFieldTouched
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setFieldValue('username', '', true);
                            }}
                        >
                            setFieldValue
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                validateField('username');
                            }}
                        >
                            validateField
                        </button>
                        <br />
                    </div>
                    <br />
                    <div>
                        <div>Form actions</div>
                        <button type="button" onClick={validateForm}>
                            validate form
                        </button>
                        <button type="submit">Submit</button>
                    </div>
                </Form>
            )}
        />
    </div>
);

export default FieldLevelValidation;