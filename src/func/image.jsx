export async function convertToPng(blob) {
  if (blob?.type === 'image/png') return blob;

  const canvas = document.createElement('canvas');
  const canvasContext = canvas.getContext('2d');

  const url = URL.createObjectURL(blob);
  const result = await new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      canvasContext.drawImage(img, 0, 0);
      canvas.toBlob((b) =>
        b ? resolve(b) : reject(new Error('PNG 변환 실패')),
      );
    };
    img.onerror = () => reject(new Error('이미지 디코딩 실패'));
    img.src = url;
  }).finally(() => {
    URL.revokeObjectURL(url);
    canvas.remove();
  });

  return result;
}
