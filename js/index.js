// Your code goes here

const DOMNodes = {
    navLinks: {
        node: document.querySelectorAll('.nav-link'),
        event: 'mouseover',
        newStyle: function (element) {
            element.style.color = 'red';
        }
    },
    headerImage: {
        node: document.getElementById('header-img'),
        event: 'dragend',
        newStyle: function (element) {
            element.style.transform = 'scale(1.2)';
        }
    },
    h2s: {
        node: document.getElementsByTagName('h2'),
        event: 'mousemove',
        newStyle: function (element) {
            element.style.color = 'purple';
        }
    },
    contentSectionImages: {
        node: document.querySelectorAll('.content-section img'),
        event: 'drag',
        newStyle: function (element) {
            element.style.transform = 'translateX(-100px)';
        }
    },
    destinationImage: {
        node: document.querySelector('.content-destination img'),
        event: 'mouseup',
        newStyle: function (element) {
            element.style.width = '50%';
        }
    },
    h4s: {
        node: document.getElementsByTagName('h4'),
        event: 'focus',
        newStyle: function (element) {
            element.style.color = 'red';
        }
    },
    buttons: {
        node: document.getElementsByClassName('btn'),
        event: 'contextmenu',
        newStyle: function (element) {
            element.style.transform = 'translateY(-100px)';
        }
    },
    copyright: {
        node: document.querySelector('footer p'),
        event: 'click',
        newStyle: function (element) {
            element.style.color = 'green';
        }
    },
    paragraphs: {
        node: document.querySelectorAll('p'),
        event: 'dragstart',
        newStyle: function (element) {
            element.style.fontSize = 'xx-large';
        }
    },
    allElements: {
        node: document.querySelectorAll('*'),
        event: 'dblclick',
        newStyle: function (element) {
            element.style.color = 'red';
            element.style.transform = 'scale(1.1)';
        }
    }
}

class DOMNodeParser {
    constructor(params) {
        this.helper = document.querySelector('.helper');
        this.label = params.label;
        this.node = params.node;
        this.event = params.event;
        this.newStyle = params.newStyle;
        this.newStyleActive = false;
        this.originalStyles = [];
        this.nodeType;

        if (NodeList.prototype.isPrototypeOf(this.node)) {
            this.nodeType = 'NodeList';
            this.node.forEach(node => this.originalStyles.push(node));

        } else if (HTMLCollection.prototype.isPrototypeOf(this.node)) {
            this.nodeType = 'HTMLCollection';
            Array.from(this.node).forEach(node => this.originalStyles.push(node));

        } else if (Element.prototype.isPrototypeOf(this.node)) {
            this.nodeType = 'Element';
            this.originalStyles.push(this.node.style);
        }

        this.activateEventListeners(this);
    }

    activateStyle() {
        this.newStyleActive = true;

        switch (this.nodeType) {
            case 'Element':
                this.newStyle(this.node);
                break;

            case 'NodeList':
                this.node.forEach(node => {
                    this.newStyle(node)
                });
                break;

            case 'HTMLCollection':
                Array.from(this.node).forEach(node => this.newStyle(node));
        }
    }

    deactivateStyle() {
        this.newStyleActive = false;

        switch (this.nodeType) {
            case 'Element':
                this.node.style = this.originalStyles[0];
                break;

            case 'NodeList':
                this.node.forEach((node, index) => {
                    node.style = this.originalStyles[index];
                });
                break;

            case 'HTMLCollection':
                Array.from(this.node).forEach((node, index) => node.style = this.originalStyles[index]);
        }
    }

    updateHelper(message) {
        this.helper.textContent = message;
    }

    activateEventListeners() {
        switch (this.nodeType) {
            case 'Element':
                this.node.addEventListener(this.event, _ => {
                    console.log(`${this.label} triggered ${this.event} to ${this.newStyleActive ? 'Deactivate' : 'Activate'} the Styles.`);
                    this.toggleStyle();
                });
                this.node.addEventListener('mouseover', _ => {
                    this.updateHelper(`${this.label} is triggered by ${this.event}`);
                });
                break;

            case 'NodeList':
                this.node.forEach(node => {
                    node.addEventListener(this.event, (event) => {
                        console.log(`${this.label} triggered ${this.event} to ${this.newStyleActive ? 'Deactivate' : 'Activate'} the Styles.`);
                        event.stopPropagation();
                        event.preventDefault();
                        this.toggleStyle();
                    });

                    node.addEventListener('mouseover', _ => {
                        this.updateHelper(`${this.label} is triggered by ${this.event}`);
                        event.stopImmediatePropagation();
                    });
                });
                break;

            case 'HTMLCollection':
                Array.from(this.node).forEach(node => {
                    node.addEventListener(this.event, (event) => {
                        console.log(`${this.label} triggered ${this.event} to ${this.newStyleActive ? 'Deactivate' : 'Activate'} the Styles.`);
                        event.stopPropagation();
                        event.preventDefault();
                        this.toggleStyle();
                    });

                    node.addEventListener('mouseover', _ => {
                        this.updateHelper(`${this.label} is triggered by ${this.event}`);
                        event.stopImmediatePropagation();
                    });
                });
        }
    }

    toggleStyle() {
        this.newStyleActive ? this.deactivateStyle() : this.activateStyle();
    }
}

for (node in DOMNodes) {
    new DOMNodeParser({
        ...DOMNodes[node],
        label: node
    });
}