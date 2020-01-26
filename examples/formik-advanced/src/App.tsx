import * as React from "react";
import {AppBar, Typography, Toolbar, Container, Card, CardContent, Button, makeStyles} from "@material-ui/core";
import {LanguageMenu} from "./components/LanguageMenu";
import * as Validator from "../../../src";
import {Messages} from "../../../src";
import MyForm from "./components/MyForm";
import {useEffect} from "react";

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    title: {
        flexGrow: 1,
    },
}));

// German messages needed for this example
const germanMessages: Messages = {
    "required": "{name} ist ein Pflichtfeld",
    "min": "{name} muss größer sein als {minValue}",
    "max": "{name} muss kleiner sein als {maxValue}",
    "minLength": "{name} muss mindestens {minLength} Zeichen haben",
    "maxLength": "{name} darf höchstens {maxLength} Zeichen haben",
    "number": "{name} muss eine Zahl sein",
    "email": "{name} ist keine gültige Email-Adresse",
    "upperCase": "Nur Großbuchstaben erlaubt"
};

const customMessages: Messages = {
    "upperCase": "Only upper case please"
}

const App = () => {
    const [locale, setLocale] = React.useState<string>("en");
    const classes = useStyles();

    useEffect(() => {
        Validator.init(customMessages);
    }, [])

    const handleLocaleChange = (locale: string) => {
        setLocale(locale)
        if (locale === "de") {
            Validator.init(germanMessages);
        } else {
            // reset
            Validator.init(customMessages);
        }
    };

    return (
        <Container className={classes.root} maxWidth="sm">
            <AppBar position="static">
                <Toolbar>
                    <Typography className={classes.title}>
                        Example
                    </Typography>
                    <LanguageMenu activeLocale={locale} onLocaleChange={handleLocaleChange}/>
                </Toolbar>
            </AppBar>
            <Card>
                <CardContent>
                    <MyForm key={locale}/>
                </CardContent>
            </Card>
        </Container>
    );
};

export default App;