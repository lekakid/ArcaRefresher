import Parser from '../core/Parser';
import { waitForElement } from '../util/ElementDetector';

export default { load };

async function load() {
  try {
    if (Parser.hasWriteView()) {
      await waitForElement('.fr-box');
      apply();
    }
  } catch (error) {
    console.error(error);
  }
}

function apply() {
  const editor = unsafeWindow.FroalaEditor('#content');
  editor.events.on(
    'paste.before',
    (event) => {
      const files = event.clipboardData.files;
      if (files.length === 0) return true;

      editor.image.upload(files);

      return false;
    },
    true
  );
}
