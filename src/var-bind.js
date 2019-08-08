const stateObject = {};
const stateHandler = {
	get: (obj, prop) => {
		if (!obj[prop]) return undefined;
		return obj[prop].value;
	},
	set: (obj, prop, value) => {
		if (!obj[prop]) {
			obj[prop] = {
				value: value,
				elements: []
			}
		} else {
			obj[prop].value = value;
		}

		obj[prop].elements.forEach((e) => {
			e._setContent(value);
		});

		return true;
	}
};

const state = new Proxy(stateObject, stateHandler);

class VarBind extends HTMLElement {
	static get observedAttributes() {
		return ["name"];
	}

	static define(tagName) {
		tagName = tagName || "var-bind";
		customElements.define(tagName, VarBind);
	}

	static get state() {
		return state;
	}

	constructor() {
		super();

		this.attachShadow({ mode: "open" });
		this.contentElement = document.createElement("span");
		this.shadowRoot.append(this.contentElement);

		if (this.hasAttribute("name")) {
			let prop = this.getAttribute("name");

			if (!stateObject[prop]) {
				stateObject[prop] = {
					value: undefined,
					elements: []
				}
			}

			if (state[this.getAttribute("name")]) {
				this._setContent(state[this.getAttribute("name")]);
			}
		}
	}

	attributeChangedCallback(prop, oldValue, newValue) {
		if (prop === "name") {
			if (oldValue) {
				let index = stateObject[oldValue].elements.indexOf(this);

				if (index >= 0) {
					stateObject[oldValue].elements.splice(index, 1);
				}
			}
			
			if (newValue) {
				if (!stateObject[newValue]) {
					stateObject[newValue] = {
						value: undefined,
						elements: []
					};
				}

				stateObject[newValue].elements.push(this);
				this._setContent(state[newValue]);
			}
		}
	}

	get name() {
		return this.getAttribute("name");
	}

	set name(value) {
		this.setAttribute("name", value);
	}

	_setContent(value) {
		this.contentElement.innerHTML = "";
		this.contentElement.append(value);
	}
}

export default VarBind;
