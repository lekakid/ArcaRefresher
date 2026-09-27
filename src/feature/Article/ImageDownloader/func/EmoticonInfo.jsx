export default class EmoticonInfo {
  static TYPE_IMAGE = 'IMAGE';
  static TYPE_EMOTICON = 'EMOTICON';

  constructor(container) {
    const url = new URL(
      container.orig || container.imageUrl,
      window.location.origin,
    );

    const orig = new URL(container.orig || url);
    const [path, ext1, ext2] = url.pathname.split('.');
    const ext = ext2 || ext1;

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
