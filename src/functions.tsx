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

export const convertDateToString=(input:any)=>{
    const date= input.toISOString().split('T')[0];
    return date
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
    url: 'https://wild-rose-pigeon-belt.cyclic.app/sales/new',
  }).then((res) => {
    if(res.data === 'No User Exists'){
      console.log(res.data)
    } else{
      const salesId=res.data.data._id
      makeSalesDetailSubmitLoop(assignSalesIdToDataDetail(data,salesId),salesId)
      callModal('New sales created !');
      toggleLoader('none')
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
  console.log(dataArray)
  for (const data of dataArray) {
    try {
      await axios.post('https://wild-rose-pigeon-belt.cyclic.app/sales-detail/new', data,{
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

export const toggleLoader=(display:string)=>{
  const loader:any= document.querySelector('#loader');
  loader.style.display=display;
}

export const updateDataFormList=(indexInput:number,setState:any ,updateData:any)=>{
  setState((prevArray:any) => {
    return prevArray.map((obj:any, index:number) => {
      if (index === indexInput) {
        // Return a new object with the updated data
        return updateData ;
      }
      return obj; //Return original there is no match
    });
  });
}


export const highlightUpdateSelected=(index:number)=>{
  const rows :any=document.querySelectorAll('#table-cont-form');
   for(let i=0; i<rows.length ;i++){
    if(i === index+1){
      rows[index+1].style.border='1px solid var(--text)'; 
    } else{
      rows[i].style.border='1px solid black'; 
    }
  }
}

export const clearUpdateHighlight=()=>{
  const rows :any=document.querySelectorAll('#table-cont-form');
  for(let i=0; i<rows.length ;i++){
    rows[i].style.border='1px solid black'; 
  }
}