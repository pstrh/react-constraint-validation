
export type Messages = {
    [key: string]: string
}

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

type InterpolationPatternFn =  (param: string) => string;

const defaultInterpolationPatternFn: InterpolationPatternFn = (param: string): string => {
    return `{${param}}`;
};

let configuredMessages: Messages = defaultMessages;
let interpolationPatternFn: InterpolationPatternFn = defaultInterpolationPatternFn;

export function init(overrideMessages: Messages) {
    configuredMessages = {...defaultMessages, ...overrideMessages};
}

export function setInterpolationPatternFn(overrideInterpolationPatternFn: InterpolationPatternFn) {
    interpolationPatternFn = overrideInterpolationPatternFn;
}

export function getErrorMessage(validatorKey: string, name: string | undefined) {
    if (!name) {
        return configuredMessages[validatorKey];
    } else {
        const messageWithName: string | undefined = configuredMessages[validatorKey + "." + name];
        if (messageWithName) {
            return messageWithName;
        } else {
            return configuredMessages[validatorKey];
        }
    }
}

type InterpolationParams = {
    [key: string]: any
}

export function interpolate(message: string, params: InterpolationParams): string {
    let finalMessage = message;
    Object.keys(params).forEach(function(key: string) {
        const value: any = params[key];
        if (value) {
            finalMessage = finalMessage.replace(interpolationPatternFn(key), value);
        }
    });
    return finalMessage;
}

export function resolveErrorMessage(validatorKey: string, name: string | undefined, interpolationParams: InterpolationParams) {
    return interpolate(getErrorMessage(validatorKey, name), interpolationParams);
}

export function required(name: string | undefined, value: any): string | undefined {
    if (!value) {
        return resolveErrorMessage("required", name, {name, value});
    }
    return undefined;
}

export function min(name: string | undefined, value: string, minValue: number): string | undefined {
    if (!value) {
        return undefined;
    }
    const valueAsNumber = parseFloat(value);
    if (valueAsNumber && valueAsNumber < minValue) {
        return resolveErrorMessage("min", name, {name, value, minValue});
    }
    return undefined;
}

export function max(name: string | undefined, value: string, maxValue: number): string | undefined {
    if (!value) {
        return undefined;
    }
    const valueAsNumber = parseFloat(value);
    if (valueAsNumber && valueAsNumber > maxValue) {
        return resolveErrorMessage("max", name, {name, value, maxValue});
    }
    return undefined;
}

export function minLength(name: string | undefined, value: string, minLength: number): string | undefined {
    if (!value) {
        return undefined;
    }
    if (value.length < minLength) {
        return resolveErrorMessage("minLength", name, {name, value, minLength});
    }
    return undefined;
}

export function maxLength(name: string | undefined, value: string, maxLength: number): string | undefined {
    if (!value) {
        return undefined;
    }
    if (value.length > maxLength) {
        return resolveErrorMessage("maxLength", name, {name, value, maxLength});
    }
    return undefined;
}

export function pattern(name: string | undefined, value: string, pattern: string): string | undefined {
    if (!value) {
        return undefined;
    }
    const regEx = new RegExp(pattern);
    if (!regEx.test(value)) {
        return resolveErrorMessage("pattern", name, {name, value, pattern});
    }
    return undefined;
}

export function email(name: string | undefined, value: string): string | undefined {
    if (!value) {
        return undefined;
    }
    // email regex taken from https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
    if (maxLength(name, value, 254) || pattern(name, value, "^(([^<>()\\[\\]\\.,;:\\s@\\\"]+(\\.[^<>()\\[\\]\\.,;:\\s@\\\"]+)*)|(\\\".+\\\"))@(([^<>()[\\]\\.,;:\\s@\\\"]+\\.)+[^<>()[\\]\\.,;:\\s@\\\"]{2,})$")) {
        return resolveErrorMessage("email", name, {name, value});
    }
    return undefined;
}

export function number(name: string | undefined, value: string): string | undefined {
    if (!value) {
        return undefined;
    }
    const valueAsNumber = parseFloat(value);
    if (!valueAsNumber) {
        return resolveErrorMessage("number", name, {name, value});
    }
    return undefined;
}

