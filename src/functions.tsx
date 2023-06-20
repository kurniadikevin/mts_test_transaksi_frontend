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
  diskon:number,ongkir:number, subTotal:number,jumlahBarang:number, totalBayar:number,data:any)=>{
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
      const salesId=res.data.data._id
      console.log(res.data)
      console.log(salesId)
      callModal('Success: New sales created!')
      makeSalesDetailSubmitLoop(assignSalesIdToDataDetail(data,salesId),salesId)
    }    
  });
}


const assignSalesIdToDataDetail=(data:any,id:string)=>{
  for (let i = 0; i < data.length; i++) {
      data[i].sales_id = id;
    }
    return data
}


export const makeSalesDetailSubmitLoop=async (dataArray:any,sales_id:string)=>{
  for (const data of dataArray) {
    try {
      await axios.post('http://localhost:5000/sales-detail/new', data,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }});
      console.log('Post request successful');
    } catch (error) {
      console.log('Post request failed',error);
    }
  }

}

export const callModal=(text:string)=>{
  const modal:any=document.querySelector('#modal');
  modal.style.display='block';
  modal.textContent=text;
  setTimeout(()=>{
    modal.style.display='none'
  },2000)
}
