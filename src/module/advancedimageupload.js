export function apply() {
    const observer = new MutationObserver((mutations) => {
        for(const m of mutations) {
            if(m.target.className == 'note-editable') {
                observer.disconnect();
                document.querySelector('.note-dropzone').addEventListener('drop', onDropImage);
                document.querySelector('.note-editable').addEventListener('paste', onPasteImage);
                break;
            }
        }
    });
    observer.observe(document, {
        childList: true,
        subtree: true,
    });
}

function onDropImage(event) {
    event.preventDefault();

    let files = event.dataTransfer.files;

    if(files.length < 1) return true;

    files = Array.from(files);

    files = files.reduce((acc, cur) => {
        if(cur.size > 20 * 1024 * 1024) {
            alert(`20MB를 넘는 파일(${cur.name})입니다. 업로드에서 생략됩니다.`);
            return acc;
        }
        if (['jpeg', 'jpg', 'png', 'gif', 'mp4', 'mov', 'webp', 'webm'].indexOf(cur.name.split('.').pop().toLowerCase()) === -1) {
            alert('지원하지 않는 확장자명입니다. 업로드에서 생략됩니다.');
            return acc;
        }
        acc.push(cur);
        return acc;
    }, []);

    if(files.length > 0) doUpload(files, 0, files.length);
    return true;
}

function onPasteImage(event) {
    event.preventDefault();

    const items = event.clipboardData.items;
    const files = [];

    for(let i = 0; i < items.length; i += 1) {
        if(items[i].kind == 'file' && items[i].type.indexOf('image/') > -1) {
            const file = items[i].getAsFile();
            if(file.size > 20 * 1024 * 1024) {
                alert(`20MB를 넘는 파일(${cur.name})입니다. 업로드에서 생략됩니다.`);
                break;
            }
            files.push(file);
        }
    }

    if(files.length == 0) return true;

    if(files.length > 0) {
        doUpload(files, 0, files.length);
        return false;
    }
    return true;
}

function doUpload(files, count, total) {
    if (count == total) {
        document.querySelector('#progress').remove();
        return;
    }

    if(count == 0) {
        const progress = (
            <div id="progress" style="width:100%;height:20px;background-color:#e2e2e2;position:relative">
                <div style="position:absolute;width:100%;text-align:center;font-weight:bold;color:#FFF">이미지 업로드 중...</div>
                <div id="progressBar" style="background-color:#00b3a1;height:100%;width:0%;text-align:center;" />
            </div>
        );
        document.querySelector('#content').insertAdjacentElement('beforebegin', progress);
    }
    const progressBar = document.querySelector('#progressBar');

    const file = files[count];
    const formData = new FormData();
    formData.append('upload', file);
    formData.append('token', document.getElementsByName('token')[0].value);
    unsafeWindow.$.ajax({
        url: '/b/upload',
        type: 'POST',
        data: formData,
        async: true,
        success: data => {
            const url = data.url;
            const parentNode = document.createElement('div');
            let node;
            if(file.type.split('/')[1] === 'mp4' || file.type.split('/')[1] === 'mov' || file.type.split('/')[1] === 'webm') {
                node = document.createElement('video');
                node.src = url;
                node.loop = true;
                node.autoplay = false;
                node.controls = true;
                node.setAttribute('playsinline', 'playsinline');
            }
            else {
                node = document.createElement('img');
                node.src = url;
            }

            parentNode.appendChild(node);
            parentNode.appendChild(document.createElement('p'));
            unsafeWindow.summernote.summernote('insertNode', parentNode);
            progressBar.style.width = `${((count += 1) / total) * 100}%`;
            doUpload(files, count, total);
        },
        cache: false,
        contentType: false,
        processData: false,
    });
}
