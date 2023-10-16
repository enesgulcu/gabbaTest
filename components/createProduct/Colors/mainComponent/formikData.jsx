import * as Yup from 'yup';

const ColorsValidationSchema = Yup.object().shape({
  colors: Yup.array().of(
    Yup.object().shape({  
      
      colourType: Yup.string().required("İlk değer boş bırakılamaz."),
      colourDescription: Yup.string(),          
    })
  ),
});

export default ColorsValidationSchema;