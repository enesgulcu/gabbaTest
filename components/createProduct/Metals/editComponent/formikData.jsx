import * as Yup from 'yup';

const EditComponentValidationSchema = Yup.object().shape({
  measurements: Yup.array().of(
    Yup.object().shape({  
      
      fabricType: Yup.string().required("İlk değer boş bırakılamaz."),
      fabricDescription: Yup.string("İkinci değer sayı olmalıdır."),
      fabricSwatch: Yup.string("yanlış bir ver girdiniz.")
    })
  ),
});

export default EditComponentValidationSchema;