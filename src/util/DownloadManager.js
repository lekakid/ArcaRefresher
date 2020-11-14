export function getBlob(url, onProgress, onLoad) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: 'GET',
            url,
            responseType: 'blob',
            onprogress: event => {
                if(onProgress) onProgress(event);
            },
            onload: response => {
                if(onLoad) onLoad();
                resolve(response.response);
            },
            onerror: reject,
        });
    });
}

export function getArrayBuffer(url, onProgress, onLoad) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: 'GET',
            url,
            responseType: 'arraybuffer',
            onprogress: event => {
                if(onProgress) onProgress(event);
            },
            onload: response => {
                if(onLoad) onLoad();
                resolve(response.response);
            },
            onerror: reject,
        });
    });
}
