import Resizer from 'react-image-file-resizer';

// Kullanıcıdan alınan resmi boyutlandırma ve Base64'e dönüştürme fonksiyonu
const ResizeImage = (file, maxWidth, maxHeight) => {
  return new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      maxWidth,
      maxHeight,
      'JPEG', // Formatı belirleyebilirsiniz (JPEG, PNG, GIF, vb.)
      70, // Kalite (0-100 arasında)
      0, // Yeniden boyutlandırmadan önce döndürme açısı (0 = döndürme yok)
      (resizedImage) => {
        resolve(resizedImage);
      },
      'base64', // Sonuç olarak base64 formatında veri almak istediğimiz için 'base64' olarak belirliyoruz
      500, // Yeniden boyutlandırma işlemi sırasında önbelleğe alınan en büyük resim boyutu (piksel cinsinden)
      500 // Önbellekte tutulacak maksimum süre (ms cinsinden)
    );
  });
};

export default ResizeImage;
