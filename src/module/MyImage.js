import { addSetting, getValue, setValue } from '../core/Configure';
import ContextMenu from '../core/ContextMenu';
import { CurrentPage } from '../core/Parser';
import { waitForElement } from '../util/ElementDetector';

import stylesheet from '../css/MyImage.css';

export default { load };

const MY_IMAGES = { key: 'myImages', defaultValue: {} };

async function load() {
  try {
    setupSetting();

    if (CurrentPage.Component.Article) {
      addContextMenu();
    }

    if (CurrentPage.Component.Write) {
      await waitForElement('.fr-box');
      apply();
    }
  } catch (error) {
    console.error(error);
  }
}

function setupSetting() {
  const imgList = <div className="grid-wrapper" />;
  imgList.addEventListener('dblclick', (event) => {
    event.preventDefault();
    window.getSelection().removeAllRanges();

    const label = event.target.closest('.grid-item');
    if (label) {
      event.preventDefault();
      const value = !label.children[0].checked;

      for (const child of imgList.children) {
        child.querySelector('input[type="checkbox"]').checked = value;
      }
    }
  });
  const deleteBtn = <button className="btn btn-arca">삭제</button>;
  deleteBtn.addEventListener('click', (event) => {
    event.target.disabled = true;

    const removeElements = imgList.querySelectorAll('input[type="checkbox"]:checked');
    for (const element of removeElements) {
      element.closest('div').remove();
    }

    event.target.disabled = false;
  });
  const channel = CurrentPage.Channel.ID;
  addSetting({
    category: 'UTILITY',
    header: '자짤 관리',
    view: (
      <div id="MyImage">
        <style>{stylesheet}</style>
        {imgList}
        {deleteBtn}
      </div>
    ),
    description: '더블을 하면 이미지를 모두 선택할 수 있습니다.',
    valueCallback: {
      save() {
        const data = getValue(MY_IMAGES);

        const images = Array.from(imgList.children, (e) => e.children[0].dataset.url);
        data[channel] = images;
        setValue(MY_IMAGES, data);
      },
      load() {
        const data = getValue(MY_IMAGES)[channel];
        if (!data) return;

        while (imgList.firstChild) imgList.lastChild.remove();
        for (const i of data) {
          const style = { backgroundImage: `url(${i}?type=list)` };
          imgList.append(
            <div>
              <label className="grid-item" style={style} data-url={i}>
                <input type="checkbox" name="select" />
              </label>
            </div>
          );
        }
      },
    },
  });
}

function addContextMenu() {
  const channel = CurrentPage.Channel.ID;
  const addMyImageItem = ContextMenu.createMenu({
    text: '자짤로 등록',
    onClick(event) {
      event.preventDefault();

      const imgList = getValue(MY_IMAGES);
      if (!imgList[channel]) {
        imgList[channel] = [];
      }
      imgList[channel].push(ContextMenu.getContextData('url').split('?')[0]);
      setValue(MY_IMAGES, imgList);
      ContextMenu.hide();
    },
  });

  const contextElement = <div>{addMyImageItem}</div>;

  ContextMenu.addMenuGroup('clickOnImage', contextElement);
}

function apply() {
  const channel = CurrentPage.Channel.ID;
  const editor = unsafeWindow.FroalaEditor('#content');
  if (editor.core.isEmpty()) {
    const imgList = getValue(MY_IMAGES)[channel];
    if (!imgList || !imgList.length) return;

    const img = imgList[Math.floor(Math.random() * imgList.length)];
    editor.html.set(`<img src="${img}">`);
    editor.html.insert('<p></p>');
    editor.selection.setAtEnd(editor.$el.get(0));
  }
}
