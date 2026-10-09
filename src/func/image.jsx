export async function convertToPng(blob) {
  if (blob?.type === 'image/png') return blob;

  const canvas = document.createElement('canvas');
  const canvasContext = canvas.getContext('2d');

  const result = await new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      canvasContext.drawImage(img, 0, 0);
      canvas.toBlob((b) => resolve(b));
    };
    img.src = URL.createObjectURL(blob);
  });
  canvas.remove();

  return result;
}
