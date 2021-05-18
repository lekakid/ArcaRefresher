const request = {};

export async function waitForElement(selector, ignoreLoadEvent) {
  if (request[selector]) {
    if (request[selector].load) return request[selector].exist;
    return request[selector].promise;
  }

  const exist = !!document.querySelector(selector);
  if (exist) {
    request[selector] = {
      load: true,
      exist,
      promise: Promise.resolve(exist),
    };
    return exist;
  }

  request[selector] = {
    load: false,
    exist: false,
    promise: new Promise((resolve) => {
      const onload = () => {
        observer.disconnect();
        request[selector].load = true;
        request[selector].exist = false;
        resolve(false);
      };
      const observer = new MutationObserver(() => {
        if (document.querySelector(selector)) {
          observer.disconnect();
          request[selector].load = true;
          request[selector].exist = true;
          if (!ignoreLoadEvent) {
            window.removeEventListener('load', onload);
          }
          resolve(true);
        }
      });
      if (!ignoreLoadEvent) {
        window.addEventListener('load', onload);
      }
      observer.observe(document, {
        childList: true,
        subtree: true,
      });
    }),
  };
  return request[selector].promise;
}
