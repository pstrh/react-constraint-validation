import * as React from 'react';
import {Button, Menu, MenuItem} from "@material-ui/core";

interface LanguageMenuProps {
    activeLocale: string;
    onLocaleChange?: (string) => void;
}

export const LanguageMenu = ({activeLocale, onLocaleChange}: LanguageMenuProps) => {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSelectLocale = (locale: string) => {
        handleClose();
        if (onLocaleChange) {
            onLocaleChange(locale);
        }
    };

    return (
        <div>
            <Button aria-controls="simple-menu" aria-haspopup="true" color="inherit" onClick={handleClick}>
                Language
            </Button>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem selected={activeLocale === "en"} onClick={() => handleSelectLocale("en")}>English</MenuItem>
                <MenuItem selected={activeLocale === "de"} onClick={() => handleSelectLocale("de")}>German</MenuItem>
            </Menu>
        </div>
    );
}