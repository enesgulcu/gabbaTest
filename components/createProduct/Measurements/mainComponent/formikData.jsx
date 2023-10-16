import * as Yup from 'yup';

const MeasurementsValidationSchema = Yup.object().shape({
  measurements: Yup.array().of(
    Yup.object().shape({  
      
      firstValue: Yup.mixed().required("İlk değer boş bırakılamaz.").test('is-valid', 'İlk değer boş bırakılamaz.', function (value) {
        const isNumber = typeof value === 'number';
        const isString = typeof value === 'string';
    
        if (!isNumber && !isString) {
          return this.createError({
            path: this.path,
            message: 'lütfen doğru bir ifade giriniz.',
          });
        }
    
        if (isNumber) {
          if (value < 0) {
            return this.createError({
              path: this.path,
              message: 'İlk değer 0 dan küçük olamaz',
            });
          }
        }
    
        return true;
      }),
      secondValue: Yup.number("İkinci değer sayı olmalıdır."),
    })
  ),
});

export default MeasurementsValidationSchema;