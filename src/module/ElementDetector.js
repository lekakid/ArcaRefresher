export async function waitForElement(selector) {
    let targetElement = document.querySelector(selector);

    if(targetElement) return Promise.resolve(targetElement);

    return new Promise(resolve => {
        const observer = new MutationObserver(() => {
            targetElement = document.querySelector(selector);

            if(targetElement) resolve(targetElement);
        });
        observer.observe(document, {
            childList: true,
            subtree: true,
        });
    });
}
