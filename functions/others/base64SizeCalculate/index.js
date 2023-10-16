const ProcessBase64Array = async (base64Array) => {
    // Base64 veriyi çözümleyerek boyutunu döndüren yardımcı fonksiyon
    function getBase64Size(base64) {
      const paddingIndex = base64.indexOf("=");
      const base64Length = paddingIndex === -1 ? base64.length : paddingIndex;
      const sizeInBytes = (base64Length * 3) / 4 - (base64Length > 0 && base64[base64Length - 1] === "=" ? 1 : 0);
      return sizeInBytes;
    }
  
    let totalSize = 0;
  
    for (const base64Data of base64Array) {
      totalSize += getBase64Size(base64Data);
    }
  
    // boyut 1 MB (1048576 byte) 'den büyükse işlemi gerçekleştirme
    if (totalSize > 1048576) {
      return {status:"error", error: "Yüklediğiniz verinin toplam boyutu 1MB'den büyük olamaz. Lütfen resimlerinizin boyutunu düşürün veya verinizi tek tek yüklemeyi deneyin."}
    }
    
    // boyut 1 MB (1048576 byte) 'den küçükse işlemi gerçekleştir
    return {status:"success", error: null };

  }

export default ProcessBase64Array;
  
  

  