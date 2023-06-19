import axios from "axios";

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
   if(input){
    return input.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  } else{
    return 0;
  }
  }

export const showDate=(input: any)=>{
  const date= input.split('T')[0];
  const day= date.split('-');
   day[day.length-1] = Number(day[day.length -1]) 
  return day.reverse().join('-')
}

export const makeSalesSubmit=(kode:string,tanggal:any,customerId:any,
  diskon:number,ongkir:number, subTotal:number,jumlahBarang:number, totalBayar:number)=>{
  axios({
    method: "POST",
    data: {
      kode : kode,
      tgl: tanggal,
      cust_id : customerId,
      diskon : diskon,
      ongkir : ongkir,
      subtotal : subTotal,
      jumlah_barang : jumlahBarang,
      total_bayar : totalBayar
  },
    headers : {  Authorization : `Bearer ${localStorage.getItem("token")}`},
    url: 'http://localhost:5000/sales/new',
  }).then((res) => {
    if(res.data === 'No User Exists'){
      console.log(res.data)
    } else{
      console.log(res.data)
      alert('new sales created')
    }    
  });
}