import * as Yup from 'yup';

const MetalsValidationSchema = Yup.object().shape({
  metals: Yup.array().of(
    Yup.object().shape({  
      
      metalType: Yup.string().required("İlk değer boş bırakılamaz."),
      metalDescription: Yup.string(),          
    })
  ),
});

export default MetalsValidationSchema;