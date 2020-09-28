export function getBlob(url, element, progressString, loadString) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: 'GET',
            url,
            responseType: 'blob',
            onprogress: event => {
                let text = null;
                if(progressString) {
                    text = progressString.replace('[percent]', Math.round(event.loaded / event.total * 100));
                }
                else {
                    text = `${Math.round(event.loaded / event.total * 100)}%`;
                }
                if(element) element.textContent = text;
            },
            onload: response => {
                if(loadString) element.textContent = loadString;
                resolve(response.response);
            },
            onerror: reject,
        });
    });
}
