export default class ImageInfo {
  static TYPE_IMAGE = 'IMAGE';
  static TYPE_EMOTICON = 'EMOTICON';

  constructor(container) {
    let url;
    // image
    if (container.nodeName) {
      url = new URL(
        container.dataset.originalurl || container.dataset.src || container.src,
        window.location.origin,
      );
    }
    // emoticon
    else if (container.id) {
      url = new URL(
        container.orig || container.imageUrl,
        window.location.origin,
      );
    } else {
      throw new Error('[ImageInfo] 지원하지 않는 형식', container);
    }

    const orig = new URL(container.orig || url);
    const [path, ext1, ext2] = url.pathname.split('.');
    const ext = ext2 || ext1;

    if (container.nodeName) {
      // JPG 다운로드 속도 최적화
      if (
        !['jpg', 'jpeg'].includes(ext) ||
        container.getAttribute('width') > 1280
      ) {
        orig.host = unsafeWindow.LiveConfig.original || orig.host;
        orig.searchParams.append('type', 'orig');
      }
    }

    const thumb = new URL(container.poster || url);

    this.container = container;
    this.url = url;
    this.orig = orig;
    this.thumb = thumb;
    this.name = path.split('/').pop();
    this.ext = ext;
  }

  getType() {
    return this.container.nodeName ? this.TYPE_IMAGE : this.TYPE_EMOTICON;
  }

  equals(item) {
    return this.url.pathname === item.url.pathname;
  }
}
