/**
 * @param {string} htmlString
 * @returns {string} textContent
 */
export const htmlToText = (htmlString) => {
    const temp = document.createElement('div');
    temp.innerHTML = htmlString;
    return temp.textContent;
}

/**
 * @param {string} htmlString
 * @returns {Array} htmlCharArray
 */
export const htmlStringToHtmlCharArray = (htmlString) => {
    const tempEl = document.createElement('div');
    tempEl.innerHTML = htmlString;

    const walker = document.createTreeWalker(tempEl, NodeFilter.SHOW_TEXT, null, false);

    let node = walker.nextNode();
    let output = [];

    while (node) {
        const parent = node.parentElement;
        const textContent = node.textContent;

        for (let i = 0; i < textContent.length; i++) {
            const char = textContent.charAt(i);
            let current = parent;
            let charEl = document.createElement('span')
            charEl.innerHTML = char;
            while (current !== tempEl) {
                let ancestorEl = document.createElement(current.tagName.toLowerCase());
                for (let attr of current.getAttributeNames()) {
                    ancestorEl.setAttribute(attr, current.getAttribute(attr));
                }
                current = current.parentNode
                ancestorEl.appendChild(charEl)
                charEl = ancestorEl
            }
            output.push(charEl.outerHTML);
        }
        node = walker.nextNode();
    }
    return output;
}
