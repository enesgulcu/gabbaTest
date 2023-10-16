import * as Yup from 'yup';

const FabricsValidationSchema = Yup.object().shape({
  fabrics: Yup.array().of(
    Yup.object().shape({  
      
      fabricType: Yup.string().required("İlk değer boş bırakılamaz."),
      fabricDescription: Yup.string(),          
    })
  ),
});

export default FabricsValidationSchema;