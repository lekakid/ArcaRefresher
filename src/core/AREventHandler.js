const AREvents = {
  ArticleChange: [],
  CommentChange: [],
};

export default function initialize() {
  for (const event of Object.keys(AREvents)) {
    document.addEventListener(`AR_${event}`, () => {
      for (const { callback } of AREvents[event]) {
        try {
          callback();
        } catch (error) {
          console.error(error);
        }
      }
    });
  }
}

export function addAREventListener(event, callback) {
  AREvents[event].push(callback);
  AREvents[event].sort((a, b) => a.priority - b.priority);
}

export function dispatchAREvent(event) {
  document.dispatchEvent(new Event(`AR_${event}`));
}
