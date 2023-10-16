import * as Yup from 'yup';

const FinancialManagementValidationSchema = Yup.object().shape({
  operationName: Yup.string().required('İşlem türü boş bırakılamaz'),
  priceType: Yup.string()
    .required('Fiyat türü boş bırakılamaz')
    .oneOf(
      ['Liste Fiyatı', 'Liste Fiyatı x Adet Miktarı'],
      'Geçersiz bir fiyat türü seçtiniz'
    ),
  condition: Yup.boolean(),
  conditionType: Yup.string().oneOf(
    ['<', '<=', '>', '>=', '==', '!=', '<>'],
    'Geçersiz bir koşul tipi seçtiniz'
  ),
  conditionValue: Yup.number()
    .typeError('Girdiğiniz değer sayı olmalıdır')
    .min(0, "Girdiğiniz değer 0'dan küçük olamaz"),
  conditionValue2: Yup.number()
    .typeError('Girdiğiniz değer sayı olmalıdır')
    .min(0, "Girdiğiniz değer 0'dan küçük olamaz"),
  mathOperator: Yup.string()
    .required('Matematik operatörü boş bırakılamaz')
    .oneOf(
      ['+', '-', 'x', '%', '÷', '-%', '+%'],
      'Geçersiz bir matematik operatörü seçtiniz'
    ),
  finalPrice: Yup.number().required('Seçtiğiniz işlem için sayı giriniz'),
});

export default FinancialManagementValidationSchema;
