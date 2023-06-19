const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export const generateString=(length:number)=> {
    let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

export const formatNumber=(input:any)=>{
    return input.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }