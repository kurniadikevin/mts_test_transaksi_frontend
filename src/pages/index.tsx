import Dashboard from "@/components/dashboard";
import { useEffect, useState } from "react";
import axios from 'axios';


export default function Home() {

  const [data,setData]= useState<any>([]);

  const fetchData=async()=>{
    axios({
      method : 'GET',
      url: 'http://localhost:5000/sales/all',
      headers : {  Authorization : `Bearer ${localStorage.getItem("token")}`},
      withCredentials: true
    }).then((res)=>{
      console.log(res.data);
      setData(res.data)
    }).catch((err)=>{
      console.log(err)
    })
  }

  const showDate=(input: string)=>{
    return input.split('T')[0]
  }

  const formatNumber=(input:any)=>{
    return input.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  useEffect(()=>{
    fetchData()
  },[])

  return (
    <div id="page">
      <Dashboard/>
      <div id="main" className="p-20">
        <div className=" items-center justify-center">
         <div className="font-bold">Daftar transaksi</div>
         <div>
         <div className="grid grid-cols-9 border-2 font-bold bg-[color:var(--button)]">
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
          {data.map((item : any,index : any)=>{
            return(
              <div className="grid grid-cols-9 border-2 bg-[color:var(--component)]">
                <div>{index}</div>
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
