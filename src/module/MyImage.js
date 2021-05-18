import { COMMENT_LOADED, WRITE_LOADED } from '../core/ArcaSelector';
import { addSetting, getValue, setValue } from '../core/Configure';
import * as ContextMenu from '../core/ContextMenu';
import { waitForElement } from '../core/LoadManager';
import { parseChannelID } from '../core/Parser';

import stylesheet from '../css/MyImage.css';

export default { load };

const MY_IMAGES = { key: 'myImages', defaultValue: {} };

async function load() {
  try {
    setupSetting();

    if (await waitForElement(COMMENT_LOADED)) {
      addContextMenu();
    }

    const isWriteView = /(write|edit)(\/|$)/.test(window.location.pathname);
    if (!isWriteView) return;
    if (await waitForElement(WRITE_LOADED, true)) {
      apply();
    }
  } catch (error) {
    console.error(error);
  }
}

function setupSetting() {
  let config = getValue(MY_IMAGES);
  const currentChannel = parseChannelID();
  const channelSelect = (
    <select>
      <option value="_shared_">공용 자짤</option>
      {Object.keys(config).map((channel) => {
        if (channel === '_shared_') {
          return null;
        }
        return (
          <option value={channel} selected={channel === currentChannel}>
            {channel}
          </option>
        );
      })}
    </select>
  );
  if (!currentChannel) {
    channelSelect.querySelector('option[value=_shared_]').selected = true;
  } else if (!channelSelect.querySelector(`option[value=${currentChannel}]`)) {
    channelSelect.append(
      <option value={currentChannel} selected>
        {currentChannel}
      </option>
    );
  }
  channelSelect.addEventListener('change', () => {
    while (imgList.firstChild) imgList.lastChild.remove();

    const imgArray = config[channelSelect.value];
    if (!imgArray) return;

    for (const i of imgArray) {
      const style = { backgroundImage: `url(${i}?type=list)` };
      imgList.append(
        <div>
          <label className="grid-item" style={style} data-url={i}>
            <input type="checkbox" name="select" />
          </label>
        </div>
      );
    }
  });
  const moveSelect = (
    <select>
      <option value="" selected>
        이동할 채널 선택
      </option>
      <option value="_trash_">휴지통</option>
      <option value="_shared_">공용 자짤</option>
      {Object.keys(config).map((channel) => {
        if (channel === '_shared_') {
          return null;
        }
        return <option value={channel}>{channel}</option>;
      })}
    </select>
  );
  if (!currentChannel) {
    moveSelect.querySelector('option[value=_shared_]').selected = true;
  } else if (!moveSelect.querySelector(`option[value=${currentChannel}]`)) {
    moveSelect.append(<option value={currentChannel}>{currentChannel}</option>);
  }

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

  const moveBtn = <button className="btn btn-arca">이동</button>;
  moveBtn.addEventListener('click', (event) => {
    event.target.disabled = true;

    const selectedChannel = channelSelect.value;
    const targetChannel = moveSelect.value;
    if (!targetChannel) alert('이동할 채널을 선택해주세요');

    const targets = imgList.querySelectorAll('input[type="checkbox"]:checked');
    if (targets.length) {
      for (const element of targets) {
        const url = element.closest('label').dataset.url;
        if (targetChannel !== '_trash_') {
          if (!config[targetChannel]) config[targetChannel] = [];
          config[targetChannel] = [...config[targetChannel], url];
        }
        config[selectedChannel].splice(config[selectedChannel].indexOf(url), 1);

        element.closest('div').remove();
      }
    }

    event.target.disabled = false;
  });

  const saveConfig = () => {
    Object.keys(config).forEach((c) => {
      if (config[c].length === 0) delete config[c];
    });
    setValue(MY_IMAGES, config);
  };

  const loadConfig = () => {
    config = getValue(MY_IMAGES);

    if (currentChannel)
      channelSelect.querySelector(`option[value=${currentChannel}]`).selected = true;
    channelSelect.dispatchEvent(new Event('change'));
  };

  const content = (
    <div id="MyImage">
      <style>{stylesheet}</style>
      {channelSelect}
      {moveSelect}
      {imgList}
      {moveBtn}
    </div>
  );

  addSetting({
    header: '자짤',
    group: [
      {
        title: '목록 관리',
        description: '더블 클릭으로 모두 선택합니다.',
        content,
        type: 'wide',
      },
    ],
    valueCallback: {
      save: saveConfig,
      load: loadConfig,
    },
  });
}

function addContextMenu() {
  const config = getValue(MY_IMAGES);

  const addShareImageItem = ContextMenu.createMenu({
    text: '공용 자짤로 등록',
    onClick(event) {
      event.preventDefault();

      const channel = '_shared_';
      config[channel] = [
        ...(config[channel] || []),
        ContextMenu.getContextData('url').split('?')[0],
      ];
      setValue(MY_IMAGES, config);
      ContextMenu.hide();
    },
  });
  const addChannelImageItem = ContextMenu.createMenu({
    text: '채널 자짤로 등록',
    onClick(event) {
      event.preventDefault();

      const channel = parseChannelID() || '_shared_';
      config[channel] = [
        ...(config[channel] || []),
        ContextMenu.getContextData('url').split('?')[0],
      ];
      setValue(MY_IMAGES, config);
      ContextMenu.hide();
    },
  });

  const contextElement = (
    <div>
      {addShareImageItem}
      {addChannelImageItem}
    </div>
  );

  ContextMenu.addMenuGroup('clickOnImage', contextElement);
}

function apply() {
  const channel = parseChannelID();
  const editor = unsafeWindow.FroalaEditor('#content');
  if (editor.core.isEmpty()) {
    const config = getValue(MY_IMAGES);
    const channelImgList = config[channel] || [];
    // eslint-disable-next-line dot-notation
    const shareImageList = config['_shared_'] || [];
    const imgList = [...channelImgList, ...shareImageList];
    if (!imgList || !imgList.length) return;

    const img = imgList[Math.floor(Math.random() * imgList.length)];
    editor.html.set(`<img src="${img}">`);
    editor.html.insert('<p></p>');
    editor.selection.setAtEnd(editor.$el.get(0));
  }
}
