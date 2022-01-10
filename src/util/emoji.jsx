export default function convertImgToAlt(badgeElement) {
  try {
    const convertedNodeList = [...badgeElement.childNodes].map((node) =>
      node.alt ? node.alt : node.textContent,
    );
    return convertedNodeList.join('');
  } catch (e) {
    return '';
  }
}
