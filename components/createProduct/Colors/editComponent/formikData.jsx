import * as Yup from 'yup';

const MetalsValidationSchema = Yup.object().shape({
  colors: Yup.array().of(
    Yup.object().shape({  
      
      colourType: Yup.string().required("İlk değer boş bırakılamaz."),
      colourDescription: Yup.string("İkinci değer sayı olmalıdır."),
    })
  ),
});

export default MetalsValidationSchema;