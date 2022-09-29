export const validateRuc = (ruc: string) => {
    const typePerson = ruc.substring(0, 2);
    const fixedFactors = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
    let sum = 0;
  
    if (ruc.length === 11) {
      if (typePerson === '10' || typePerson === '20') {
        for (let pos = 0; pos < ruc.length - 1; pos++) {
          const number = parseInt(ruc[pos]);
          sum += number * fixedFactors[pos];
        }
  
        const result = (11 - (sum % 11)) % 10;
  
        return ruc[ruc.length - 1] === result.toString();
      }
    }
  
    return false;
  };
  