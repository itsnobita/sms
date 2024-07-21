export function getUniqueRandomNumber(previous:number=1,min:number=0, max:number=452):number {
    let newNumber;
  
    do {
      newNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (newNumber === previous);
  
    return newNumber;
  }