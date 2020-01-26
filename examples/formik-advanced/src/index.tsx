import 'react-app-polyfill/ie11';
import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";

const mountNode = document.getElementById("root");
ReactDOM.render(<App/>, mountNode);
