import Dashboard from "@/components/dashboard";
import { useEffect, useState } from "react";
import axios from 'axios';
import { formatNumber,showDate } from "@/functions";


export default function Home() {

  const [data,setData]= useState<any>([]);
  const [searchInput,setSearchInput]= useState<string>('');
  const [dataQuery,setDataQuery]= useState<any>([]);

  const fetchData=async()=>{
    axios({
      method : 'GET',
      url: 'http://localhost:5000/sales/all',
      headers : {  Authorization : `Bearer ${localStorage.getItem("token")}`},
    
    }).then((res)=>{
      console.log(res.data);
      setData(res.data);
      setDataQuery(res.data);
    }).catch((err)=>{
      console.log(err)
    })
  }




  const queryOnInputChange=()=>{
    let resultData=data.filter((item :any)=>{
      if(item.kode){
      return  ((item.kode).toLowerCase()).includes(searchInput.toLowerCase());
      }
    })
    setDataQuery(resultData)
  }

  useEffect(()=>{
    fetchData()
  },[])

  useEffect(()=>{
    queryOnInputChange()
  },[searchInput])

  return (
    <div id="page">
      <Dashboard/>
      <div id="main" className="p-20">
        <div className=" items-center justify-center">
         <div id='home-head' className="flex justify-between pb-2">
          <div className="font-bold text-xl">Daftar transaksi</div>
          <div className="flex gap-4">
            <div className="font-bold">Cari</div>
            <input placeholder="Kode" className="px-2 text-[color:var(--text-input)]" 
           value={searchInput}  onChange={(e)=>{ setSearchInput(e.target.value)}} 
           >
           </input>
         </div>
         </div>

         <div id="home-body" >
          <div id="table-cont" className="grid grid-cols-9 p-2 border-2 border-black font-bold bg-[color:var(--button)]">
                <div>No</div>
                <div>Kode</div>
                <div>Tanggal</div>
                <div>Nama </div>
                <div>Jumlah </div>
                <div>Sub Total</div>
                <div>Diskon</div>
                <div>Ongkir</div>
                <div>Total bayar</div>
              </div>
          {dataQuery.map((item : any,index : any)=>{
            return(
              <div id="table-cont" className="grid grid-cols-9 p-2 border-2 border-black bg-[color:var(--component)]">
                <div>{index+1}</div>
                <div>{item.kode}</div>
                <div>{showDate(item.tgl)}</div>
                <div>{item.cust_id.nama}</div>
                <div>{item?.jumlah_barang ? item.jumlah_barang : 0}</div>
                <div>{formatNumber(item.subtotal)}</div>
                <div>{formatNumber(item.diskon)}</div>
                <div>{formatNumber(item.ongkir)}</div>
                <div>{formatNumber(item.total_bayar)}</div>
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
