import {
    number,
    max, maxLength,
    min,
    minLength,
    required, pattern, email
} from "../src/Validator";
import * as React from "react";
import * as renderer from "react-test-renderer";
import {withValidator} from "../src/withValidator";

interface FieldProps {
    name?: string,
    value?: string,
    validate?: (value:any) => string | undefined
}

const Field: React.SFC<FieldProps> = (props) => {
    const validationResult: string | undefined = props.validate ? props.validate(props.value) : undefined;
    return <>{"validateTest: " + (validationResult ? validationResult : "valid")}</>;
};

const NumberField = withValidator({required, min, max },{number})(Field);

const TextField = withValidator({required, minLength, maxLength, pattern})(Field);

const EmailField = withValidator({required},{email})(Field);

const NumberFieldTest: React.SFC = () => {
    return (
        <>
            <NumberField name="test"/>
            <NumberField name="test" required/>
            <NumberField name="test" value="a" required/>
            <NumberField name="test" value="1" required min={2}/>
            <NumberField name="test" value="5" required min={2} max={4}/>
            <NumberField name="test" value="3" required min={2} max={4}/>
        </>
    );
};

test("NumberField test", () => {
    const tree = renderer.create(<NumberFieldTest/>).toJSON();
    expect(tree).toMatchSnapshot();
});

const TextFieldTest: React.SFC = () => {
    return (
        <>
            <TextField name="test"/>
            <TextField name="test" required/>
            <TextField name="test" value="abcdef" required/>
            <TextField name="test" value="ab" required minLength={3}/>
            <TextField name="test" value="abcdef" required minLength={3} maxLength={5}/>
            <TextField name="test" value="abcd" required minLength={3} maxLength={5}/>
            <TextField name="test" value="abcd123" required pattern={"^[a-z0-9_\\-]+$"}/>
            <TextField name="test" value="aBcd123" required pattern={"^[a-z0-9_\\-]+$"}/>
        </>
    );
};

test("TextField test", () => {
    const tree = renderer.create(<TextFieldTest/>).toJSON();
    expect(tree).toMatchSnapshot();
});

const EmailFieldTest: React.SFC = () => {
    return (
        <>
            <EmailField name="test"/>
            <EmailField name="test" required/>
            <EmailField name="test" value="test" required/>
            <EmailField name="test" value="test@test" required/>
            <EmailField name="test" value="test@test.com" required/>
        </>
    );
};

test("EmailField test", () => {
    const tree = renderer.create(<EmailFieldTest/>).toJSON();
    expect(tree).toMatchSnapshot();
});