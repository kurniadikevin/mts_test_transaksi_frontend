import Dashboard from "@/components/dashboard";
import { useEffect, useState } from "react";
import axios from 'axios';
import { callModal, formatNumber,showDate ,toggleLoader} from "@/functions";
import { useRouter } from 'next/navigation';



export default function Home() {

  const [data,setData]= useState<any>([]);
  const [searchInput,setSearchInput]= useState<string>('');
  const [dataQuery,setDataQuery]= useState<any>([]);
  const { push } = useRouter();


  const fetchData=async()=>{
    axios({
      method : 'GET',
      url: 'https://wild-rose-pigeon-belt.cyclic.app/sales/all',
      headers : {  Authorization : `Bearer ${localStorage.getItem("token")}`},
    
    }).then((res)=>{
      setData(res.data);
      setDataQuery(res.data);
      toggleLoader('none')

    }).catch((err)=>{
      console.log(err)
    })
  }

  const deleteTransaction=(sales_id:string)=>{
    axios({
      method : 'DELETE',
      url: `https://wild-rose-pigeon-belt.cyclic.app/sales/delete-by-id/${sales_id}`,
      headers : {  Authorization : `Bearer ${localStorage.getItem("token")}`},
    
    }).then((res)=>{
      console.log(res.data);
      callModal('Success: transaction deleted')
      filterDataForUpdateState(sales_id)
    }).catch((err)=>{
      console.log(err)
    })
  }

  const filterDataForUpdateState=(_id:string)=>{
    const filtered= data.filter((item:any)=>{
      return item._id !== _id
    })
    setData(filtered)
    console.log(filtered)
  }



  const queryOnInputChange=()=>{
    let resultData=data.filter((item :any)=>{
      if(item.cust_id.nama){
      return (  ((item.cust_id.nama).toLowerCase()).includes(searchInput.toLowerCase())
      ||  ((item.kode).toLowerCase()).includes(searchInput.toLowerCase()) )
      }
    })
    setDataQuery(resultData)
  }

  useEffect(()=>{
    fetchData()
    const session= localStorage.getItem("session-data")
    if(!session){
      push('/sign-page')
    }
  },[])

  useEffect(()=>{
    queryOnInputChange()
  },[searchInput,data])

  return (
    <div id="page">
      <Dashboard/>
      <div id="main" className="p-20">
        <div className=" items-center justify-center">
         <div id='home-head' className="flex justify-between pb-2">
          <div className="font-bold text-xl">Daftar transaksi</div>
          <div className="flex gap-4">
            <div className="font-bold">Cari</div>
            <input placeholder="Nama Customer / Kode" className="px-2 text-[color:var(--text-input)]" 
           value={searchInput}  onChange={(e)=>{ setSearchInput(e.target.value)}} 
           >
           </input>
         </div>
         </div>

         <div id="home-body" >
          <div id="table-cont" className="grid grid-cols-10 p-2 border-2 border-black font-bold bg-[color:var(--button)]">
                <div>No</div>
                <div>Kode</div>
                <div>Tanggal</div>
                <div>Nama </div>
                <div>Jumlah </div>
                <div>Sub Total</div>
                <div>Diskon</div>
                <div>Ongkir</div>
                <div>Total bayar</div>
                <div></div>
              </div>
          {dataQuery.map((item : any,index : any)=>{
            return(
              <div id="table-cont" className="grid grid-cols-10 p-2 border-2 border-black bg-[color:var(--component)]">
                <div>{index+1}</div>
                <div>{item.kode}</div>
                <div>{showDate(item.tgl)}</div>
                <div>{item.cust_id.nama}</div>
                <div>{item?.jumlah_barang ? item.jumlah_barang : 0}</div>
                <div>{formatNumber(item.subtotal)}</div>
                <div>{formatNumber(item.diskon)}</div>
                <div>{formatNumber(item.ongkir)}</div>
                <div>{formatNumber(item.total_bayar)}</div>
                <div className="flex justify-center gap-6" >
                  <span className="material-icons text-[color:var(--button)] cursor-pointer"
                   onClick={()=> push(`/sales-detail/${item._id}`)}>
                    open_in_new
                 </span>
                  <span className="material-icons text-[color:var(--button)] cursor-pointer"
                  onClick={()=> deleteTransaction(item._id)}>
                    delete
                  </span>
                </div>
              </div>
            )
          }) 
          }
         </div>
        </div>
      </div>
    </div>
  )
}
