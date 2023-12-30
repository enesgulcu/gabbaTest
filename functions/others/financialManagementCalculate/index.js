import { getAPI } from '@/services/fetchAPI';

// Dışarıdan gelebilecek matematik operatörlerini tanımlıyoruz.
const mathOperators = {
  ADD: '+',
  SUBTRACT: '-',
  MULTIPLY: 'x',
  DIVIDE: '÷',
  PERCENT: '%',
  SUBTRACT_PERCENT: '-%',
  ADD_PERCENT: '+%',
};

// Sorgulancak koşulları belirliyoruz.
const priceTypes = {
  LIST: 'Liste Fiyatı',
  LIST_MULTIPLY_STOCK: 'Liste Fiyatı x Adet Miktarı',
  PREVIOUS_RESULT: 'Önceki İşlem',
};

// Matematik işlemini burada yaparak sonucu döndürüyoruz.
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

const specialCalculateOperation = (
  calculate = true,
  responseSpecial,
  element,
  special,
  result
) => {
  if (!calculate) {
    responseSpecial.data
      .filter((item) => {
        return item.financialManagementId === element.id;
      })
      .forEach((item) => {
        if (item.conditionValueSpecial != 'Özel Barem Ekle') {
          special.push(result);
        } else {
          special.push(item.ozelBaremValue);
        }
      });
  } else {
    responseSpecial.data
      .filter((item) => {
        return item.financialManagementId === element.id;
      })
      .forEach((item) => {
        if (item.conditionValueSpecial != 'Özel Barem Ekle') {
          special.push(result);
        } else {
          special.push(item.ozelBaremValue);
        }
        result = mathCalculateOperation(
          item.mathOperatorSpecial,
          item.conditionValueSpecial == 'Özel Barem Ekle'
            ? item.ozelBaremValue
            : result,
          result
        );
      });
  }
};

const FinancialManagementCalculate = async (price, stock) => {
  const response = await getAPI('/financialManagement');
  response.data.sort((a, b) => a.orderValue - b.orderValue);
  const responseSpecial = await getAPI('/financialManagementSpecial');
  let result = [];
  let special = [];

  response.data.forEach((element, index) => {
    result.length > 0
      ? (result[index] = result[index - 1])
      : (result[index] = parseFloat(price));

    // Burada yapılacak işlemin koşulunu belirliyoruz.
    // Bu koşula göre nasıl işlem yapması gerektiğini belirliyoruz.
    const conditionPriceTypeCheck =
      element.priceType === priceTypes.PREVIOUS_RESULT
        ? result[index]
        : element.priceType === priceTypes.LIST_MULTIPLY_STOCK
        ? price * stock
        : price;

    // Eğer koşul varsa, burayı çalıştır. (<, >, =, !=, <=, >=)
    if (element.condition) {
      if (element.conditionType == '<') {
        if (conditionPriceTypeCheck < parseFloat(element.conditionValue)) {
          // Özel işlem için burası çalışır.
          specialCalculateOperation(
            true,
            responseSpecial,
            element,
            special,
            result[index]
          );

          // Burada ise normal işlem yapılır.
          result[index] = mathCalculateOperation(
            element.mathOperator,
            element.finalPrice,
            result[index]
          );
        } else {
          specialCalculateOperation(
            false,
            responseSpecial,
            element,
            special,
            result[index]
          );
        }
      }
      if (element.conditionType == '<=') {
        if (conditionPriceTypeCheck <= parseFloat(element.conditionValue)) {
          // Özel işlem için burası çalışır.
          specialCalculateOperation(
            true,
            responseSpecial,
            element,
            special,
            result[index]
          );
          result[index] = mathCalculateOperation(
            element.mathOperator,
            element.finalPrice,
            result[index]
          );
        } else {
          // Özel işlem için burası çalışır.
          specialCalculateOperation(
            false,
            responseSpecial,
            element,
            special,
            result[index]
          );
        }
      }
      if (element.conditionType == '>') {
        if (conditionPriceTypeCheck > parseFloat(element.conditionValue)) {
          // Özel işlem için burası çalışır.
          specialCalculateOperation(
            true,
            responseSpecial,
            element,
            special,
            result[index]
          );
          result[index] = mathCalculateOperation(
            element.mathOperator,
            element.finalPrice,
            result[index]
          );
        } else {
          // Özel işlem için burası çalışır.
          specialCalculateOperation(
            false,
            responseSpecial,
            element,
            special,
            result[index]
          );
        }
      }
      if (element.conditionType == '>=') {
        if (conditionPriceTypeCheck >= parseFloat(element.conditionValue)) {
          // Özel işlem için burası çalışır.
          specialCalculateOperation(
            true,
            responseSpecial,
            element,
            special,
            result[index]
          );
          result[index] = mathCalculateOperation(
            element.mathOperator,
            element.finalPrice,
            result[index]
          );
        } else {
          // Özel işlem için burası çalışır.
          specialCalculateOperation(
            false,
            responseSpecial,
            element,
            special,
            result[index]
          );
        }
      }
      if (element.conditionType == '==') {
        if (conditionPriceTypeCheck == parseFloat(element.conditionValue)) {
          // Özel işlem için burası çalışır.
          specialCalculateOperation(
            true,
            responseSpecial,
            element,
            special,
            result[index]
          );
          result[index] = mathCalculateOperation(
            element.mathOperator,
            element.finalPrice,
            result[index]
          );
        } else {
          // Özel işlem için burası çalışır.
          specialCalculateOperation(
            false,
            responseSpecial,
            element,
            special,
            result[index]
          );
        }
      }
      if (element.conditionType == '!=') {
        if (conditionPriceTypeCheck != parseFloat(element.conditionValue)) {
          // Özel işlem için burası çalışır.
          specialCalculateOperation(
            true,
            responseSpecial,
            element,
            special,
            result[index]
          );
          result[index] = mathCalculateOperation(
            element.mathOperator,
            element.finalPrice,
            result[index]
          );
        } else {
          // Özel işlem için burası çalışır.
          specialCalculateOperation(
            false,
            responseSpecial,
            element,
            special,
            result[index]
          );
        }
      }
      if (element.conditionType == '<>') {
        if (
          parseFloat(element.conditionValue) <
            parseFloat(conditionPriceTypeCheck) &&
          parseFloat(conditionPriceTypeCheck) <
            parseFloat(element.conditionValue2)
        ) {
          // Özel işlem için burası çalışır.
          specialCalculateOperation(
            true,
            responseSpecial,
            element,
            special,
            result[index]
          );
          result[index] = mathCalculateOperation(
            element.mathOperator,
            element.finalPrice,
            result[index]
          );
        } else {
          // Özel işlem için burası çalışır.
          specialCalculateOperation(
            false,
            responseSpecial,
            element,
            special,
            result[index]
          );
        }
      }
    } else {
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
        .forEach((item) => {
          if (item.conditionValueSpecial != 'Özel Barem Ekle') {
            special.push(result[index]);
          } else {
            special.push(item.ozelBaremValue);
          }

          result[index] = mathCalculateOperation(
            item.mathOperatorSpecial,
            item.conditionValueSpecial == 'Özel Barem Ekle'
              ? item.ozelBaremValue
              : result[index],
            result[index]
          );
        });
    }
  });
  return { result, special };
};

export default FinancialManagementCalculate;
