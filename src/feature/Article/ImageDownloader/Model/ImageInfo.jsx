export default class ImageInfo {
  constructor(container) {
    const url = new URL(
      container.dataset.src || container.src,
      window.location.origin,
    );
    const thumb = new URL(container.poster || url);
    const orig = new URL(container.dataset.originalurl || url);
    const [path, ext1, ext2] = url.pathname.split('.');
    const ext = container.dataset.orig || ext2 || ext1;
    const name = path.split('/').pop();

    // JPG 다운로드 속도 최적화
    if (
      ['jpg', 'jpeg'].includes(ext) &&
      container.getAttribute('width') <= 1280
    ) {
      orig.host = url.host;
      orig.searchParams.delete('type');
    }

    this.container = container;
    this.url = url;
    this.orig = orig;
    this.thumb = thumb;
    this.name = name;
    this.ext = ext;
  }

  getType() {
    return this.container.nodeName ? this.TYPE_IMAGE : this.TYPE_EMOTICON;
  }

  equals(item) {
    return this.url.pathname === item.url.pathname;
  }
}
