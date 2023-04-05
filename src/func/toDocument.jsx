const parser = new DOMParser();

export default function toDocument(string) {
  return parser.parseFromString(string, 'text/html');
}
