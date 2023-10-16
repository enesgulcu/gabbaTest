const HandleImageClick = (event) => {
  const img = event.target;
  const rect = img.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = img.width;
  canvas.height = img.height;
  context.drawImage(img, 0, 0, img.width, img.height);
  const pixel = context.getImageData(x, y, 1, 1).data;

  const rgbColor = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
  return rgbColor;
}

export default HandleImageClick;