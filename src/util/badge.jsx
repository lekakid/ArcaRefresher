export default function getBadgeText(badgeElement) {
  const convertedNodeList = [...badgeElement.childNodes].map((node) =>
    node.alt ? node.alt : node.textContent,
  );
  return convertedNodeList.join('');
}
