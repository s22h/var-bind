import VarBind from "../src/var-bind.js";

VarBind.define();
VarBind.state.name = "World";

let container = document.createElement("p");
let element = document.createElement("var-bind");
element.name = "navigator";

container.append(element);
document.getElementsByTagName("body")[0].append(container);

let span = document.createElement("span");
span.textContent = "This is a test.";

VarBind.state.navigator = span;

