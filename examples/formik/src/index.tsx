import 'react-app-polyfill/ie11';
import * as React from "react";
import * as ReactDOM from "react-dom";
import FieldLevelValidation from "./components/FieldLevelValidation";

const mountNode = document.getElementById("root");
ReactDOM.render(<FieldLevelValidation/>, mountNode);
