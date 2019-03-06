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
        event: 'mouseleave',
        newStyle: function (element) {
            element.style.fontWeight = '900';
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
            element.style.fontSize = 'x-small';
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

        //Detect parent node prototype
        //Make sure they each have forEach and are at least array-like
        //Save each nodes' original styles in an array
        if (NodeList.prototype.isPrototypeOf(this.node)) {
            this.node.forEach(node => this.originalStyles.push(node));

        } else if (HTMLCollection.prototype.isPrototypeOf(this.node)) {
            this.node = Array.from(this.node);
            this.node.forEach(node => this.originalStyles.push(node));

        } else if (Element.prototype.isPrototypeOf(this.node)) {
            this.node = [this.node];
            this.originalStyles.push(this.node.style);
        }

        //Add event listeners on all child nodes
        this.node.forEach(node => {
            this.addNodeEventListener(node);
            this.addNodeEventHelper(node);
        });
    }

    //Toggles styles
    toggleStyle() {
        this.newStyleActive = !this.newStyleActive;

        if (this.newStyleActive) {
            this.node.forEach((node, index) => {
                node.style = this.originalStyles[index];
            });
        } else {
            this.node.forEach(node => {
                this.newStyle(node);
            });
        }
    }

    //Adds event listeners
    addNodeEventListener(node) {
        node.addEventListener(this.event, event => {
            console.log(`${this.label} triggered ${this.event} to ${this.newStyleActive ? 'Deactivate' : 'Activate'} the Styles.`);
            event.stopPropagation();
            this.toggleStyle();
        });

        //Stop default Link event
        if (this.label === 'navLinks') {
            node.addEventListener('click', event => {
                event.preventDefault();
            });
        }
    }

    //Helper that shows in the nav bar what event triggers the element that's being hovered over by the mouse
    addNodeEventHelper(node) {
        node.addEventListener('mouseover', _ => {
            this.helper.textContent = `${this.label} is triggered by ${this.event}`;
            event.stopImmediatePropagation();
        });
    }
}

//Iterate over each Node object
//User the DOMNodeParser class to add event listeners, toggle on / off styles, and 
for (node in DOMNodes) {
    new DOMNodeParser({
        ...DOMNodes[node],
        label: node
    });
}