export function convertImgToAlt(Nodes) {
  try {
    const convertedNodeList = Nodes.map((node) =>
      node.alt ? node.alt : node.textContent.trim(),
    );
    return convertedNodeList.join('');
  } catch (e) {
    return '';
  }
}
