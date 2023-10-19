import { getAPI } from '@/services/fetchAPI';

const mathOperators = {
  ADD: '+',
  SUBTRACT: '-',
  MULTIPLY: 'x',
  DIVIDE: '÷',
  PERCENT: '%',
  SUBTRACT_PERCENT: '-%',
  ADD_PERCENT: '+%',
};

const priceTypes = {
  LIST: 'Liste Fiyatı',
  LIST_MULTIPLY_STOCK: 'Liste Fiyatı x Adet Miktarı',
};

const mathCalculateOperation = (mathOperator, finalPrice, result) => {
  if (mathOperator === mathOperators.ADD) {
    result = parseFloat(result) + parseFloat(finalPrice);
  }

  if (mathOperator === mathOperators.SUBTRACT) {
    result = parseFloat(result) - parseFloat(finalPrice);
  }

  if (mathOperator === mathOperators.MULTIPLY) {
    result = parseFloat(result) * parseFloat(finalPrice);
  }

  if (mathOperator === mathOperators.DIVIDE) {
    result = parseFloat(result) / parseFloat(finalPrice);
  }

  if (mathOperator === mathOperators.PERCENT) {
    result = (parseFloat(result) * parseFloat(finalPrice)) / 100;
  }

  if (mathOperator === mathOperators.SUBTRACT_PERCENT) {
    result =
      parseFloat(result) - (parseFloat(result) * parseFloat(finalPrice)) / 100;
  }

  if (mathOperator === mathOperators.ADD_PERCENT) {
    result =
      parseFloat(result) + (parseFloat(result) * parseFloat(finalPrice)) / 100;
  }
  return parseFloat(result);
};

const FinancialManagementCalculate = async (price, stock) => {
  const response = await getAPI('/createProduct/financialManagement');
  response.data.sort((a, b) => a.orderValue - b.orderValue);
  const responseSpecial = await getAPI(
    '/createProduct/financialManagementSpecial'
  );
  let result = [];
  response.data.forEach((element, index) => {
    result.length > 0
      ? (result[index] = result[index - 1])
      : (result[index] = parseFloat(price));

    const conditionPriceTypeCheck =
      element.priceType === priceTypes.LIST_MULTIPLY_STOCK
        ? result[index] * stock
        : result[index];

    // Eğer koşul varsa, burayı çalıştır. (<, >, =, !=, <=, >=)
    if (element.condition) {
      if (element.conditionType == '<') {
        if (conditionPriceTypeCheck < parseFloat(element.conditionValue)) {
          result[index] = mathCalculateOperation(
            element.mathOperator,
            element.finalPrice,
            result[index]
          );
        }
      }
      if (element.conditionType == '<=') {
        if (conditionPriceTypeCheck <= parseFloat(element.conditionValue)) {
          result[index] = mathCalculateOperation(
            element.mathOperator,
            element.finalPrice,
            result[index]
          );
        }
      }
      if (element.conditionType == '>') {
        if (conditionPriceTypeCheck > parseFloat(element.conditionValue)) {
          result[index] = mathCalculateOperation(
            element.mathOperator,
            element.finalPrice,
            result[index]
          );
        }
      }
      if (element.conditionType == '>=') {
        if (conditionPriceTypeCheck >= parseFloat(element.conditionValue)) {
          result[index] = mathCalculateOperation(
            element.mathOperator,
            element.finalPrice,
            result[index]
          );
        }
      }
      if (element.conditionType == '==') {
        if (conditionPriceTypeCheck == parseFloat(element.conditionValue)) {
          result[index] = mathCalculateOperation(
            element.mathOperator,
            element.finalPrice,
            result[index]
          );
        }
      }
      if (element.conditionType == '!=') {
        if (conditionPriceTypeCheck != parseFloat(element.conditionValue)) {
          result[index] = mathCalculateOperation(
            element.mathOperator,
            element.finalPrice,
            result[index]
          );
        }
      }
      if (element.conditionType == '<>') {
        if (
          parseFloat(
            element.conditionValue <
              conditionPriceTypeCheck >
              parseFloat(element.conditionValue2)
          )
        ) {
          result[index] = mathCalculateOperation(
            element.mathOperator,
            element.finalPrice,
            result[index]
          );
        }
      }
    } else {
      console.log(element.mathOperator);
      // Eğer koşul yoksa, burayı çalıştır.
      result[index] = mathCalculateOperation(
        element.mathOperator,
        element.finalPrice,
        result[index]
      );
      responseSpecial.data
        .filter((item) => {
          return item.financialManagementId === element.id;
        })
        .forEach((item, specialIndex) => {
          if (
            item.conditionValueSpecial == 'Özel Barem Ekle' &&
            item.ozelBaremValue > 0
          ) {
            //result[index] = result[index] + parseInt(item.ozelBaremValue);
            if (item.mathOperatorSpecial === mathOperators.ADD) {
              // Özel İşlem Toplama
              result[index] =
                parseFloat(result[index]) + parseFloat(item.ozelBaremValue);
            }

            // Özel İşlem Çıkarma
            if (item.mathOperatorSpecial === mathOperators.SUBTRACT) {
              result[index] =
                parseFloat(result[index]) - parseFloat(item.ozelBaremValue);
            }

            // Özel İşlem Çarpma
            if (item.mathOperatorSpecial === mathOperators.MULTIPLY) {
              result[index] =
                parseFloat(result[index]) * parseFloat(item.ozelBaremValue);
            }

            // Özel İşlem Bölme
            if (item.mathOperatorSpecial === mathOperators.DIVIDE) {
              result[index] =
                parseFloat(result[index]) / parseFloat(item.ozelBaremValue);
            }

            // Özel İşlem Yüzde
            if (item.mathOperatorSpecial === mathOperators.PERCENT) {
              result[index] =
                (parseFloat(result[index]) * parseFloat(item.ozelBaremValue)) /
                100;
            }

            // Özel İşlem Yüzde Toplama
            if (item.mathOperatorSpecial === mathOperators.ADD_PERCENT) {
              result[index] =
                parseFloat(result[index]) +
                (parseFloat(result[index]) * parseFloat(item.ozelBaremValue)) /
                  100;
            }

            // Özel İşlem Yüzde Çıkarma
            if (item.mathOperatorSpecial === mathOperators.SUBTRACT_PERCENT) {
              result[index] =
                parseFloat(result[index]) -
                (parseFloat(result[index]) * parseFloat(item.ozelBaremValue)) /
                  100;
            }
          }
          if (
            specialIndex == 0 &&
            item.conditionValueSpecial != 'Özel Barem Ekle'
          ) {
            if (item.mathOperatorSpecial === mathOperators.ADD) {
              // Özel İşlem Toplama
              result[index] =
                parseFloat(result[index]) + parseFloat(result[index - 1]);
            }

            // Özel İşlem Çıkarma
            if (item.mathOperatorSpecial === mathOperators.SUBTRACT) {
              result[index] =
                parseFloat(result[index]) - parseFloat(result[index - 1]);
            }

            // Özel İşlem Çarpma
            if (item.mathOperatorSpecial === mathOperators.MULTIPLY) {
              result[index] =
                parseFloat(result[index]) * parseFloat(result[index - 1]);
            }

            // Özel İşlem Bölme
            if (item.mathOperatorSpecial === mathOperators.DIVIDE) {
              result[index] =
                parseFloat(result[index]) / parseFloat(result[index - 1]);
            }

            // Özel İşlem Yüzde
            if (item.mathOperatorSpecial === mathOperators.PERCENT) {
              result[index] =
                (parseFloat(result[index]) * parseFloat(result[index - 1])) /
                100;
            }

            // Özel İşlem Yüzde Toplama
            if (item.mathOperatorSpecial === mathOperators.ADD_PERCENT) {
              result[index] =
                parseFloat(result[index]) +
                (parseFloat(result[index]) * parseFloat(result[index - 1])) /
                  100;
            }

            // Özel İşlem Yüzde Çıkarma
            if (item.mathOperatorSpecial === mathOperators.SUBTRACT_PERCENT) {
              result[index] =
                parseFloat(result[index]) -
                (parseFloat(result[index]) * parseFloat(result[index - 1])) /
                  100;
            }
          }

          if (
            specialIndex > 0 &&
            item.conditionValueSpecial != 'Özel Barem Ekle'
          ) {
            if (item.mathOperatorSpecial === mathOperators.ADD) {
              // Özel İşlem Toplama
              result[index] =
                parseFloat(result[index]) + parseFloat(result[index]);
            }

            // Özel İşlem Çıkarma
            if (item.mathOperatorSpecial === mathOperators.SUBTRACT) {
              result[index] =
                parseFloat(result[index]) - parseFloat(result[index]);
            }

            // Özel İşlem Çarpma
            if (item.mathOperatorSpecial === mathOperators.MULTIPLY) {
              result[index] =
                parseFloat(result[index]) * parseFloat(result[index]);
            }

            // Özel İşlem Bölme
            if (item.mathOperatorSpecial === mathOperators.DIVIDE) {
              result[index] =
                parseFloat(result[index]) / parseFloat(result[index]);
            }

            // Özel İşlem Yüzde
            if (item.mathOperatorSpecial === mathOperators.PERCENT) {
              result[index] =
                (parseFloat(result[index]) * parseFloat(result[index])) / 100;
            }

            // Özel İşlem Yüzde Toplama
            if (item.mathOperatorSpecial === mathOperators.ADD_PERCENT) {
              result[index] =
                parseFloat(result[index]) +
                (parseFloat(result[index]) * parseFloat(result[index])) / 100;
            }

            // Özel İşlem Yüzde Çıkarma
            if (item.mathOperatorSpecial === mathOperators.SUBTRACT_PERCENT) {
              result[index] =
                parseFloat(result[index]) -
                (parseFloat(result[index]) * parseFloat(result[index])) / 100;
            }
          }
        });
    }
  });
  return result;
};

export default FinancialManagementCalculate;
