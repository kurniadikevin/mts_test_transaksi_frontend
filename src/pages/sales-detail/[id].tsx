import Dashboard from "@/components/dashboard"
import { showDate } from "@/functions";
import axios from "axios";
import { useRouter } from "next/router"
import { useEffect, useState } from "react";



export default function SalesDetailPage(){

    const router = useRouter();
    const id = router.query.id;
    const [data,setData]= useState<any>([]);


    const fetchSalesDetailData=()=>{
        axios({
            method: "GET",
            headers : {  Authorization : `Bearer ${localStorage.getItem("token")}`},
            url: `https://wild-rose-pigeon-belt.cyclic.app/sales-detail/by-sales-id/${id}`,
        }).then((res)=>{
            console.log(res.data)
            setData(res.data)
        }).catch((err)=>{
            console.log(err)
        })
    }

    console.log(router.query.id)
    useEffect(()=>{
        fetchSalesDetailData()
    },[])

    return(
        <div id="page">
            <Dashboard/>
            <div id="main" className="p-20">
                <div  className="font-bold text-xl">
                    Transaksi detail list
                </div>
            <div id="home-body" >
                <div id="table-cont" className="grid grid-cols-8 p-2 border-2 border-black font-bold bg-[color:var(--button)]">
                        <div>No</div>
                        <div>Kode Sales</div>
                        <div>Tanggal</div>
                        <div>Nama Barang</div>
                        <div>Quantity</div>
                        <div>Diskon (%)</div>
                        <div>Nilai Diskon</div>
                        <div>Total</div>
                </div>
                {data.map((item : any,index : any)=>{
            return(
              <div key={index} id="table-cont" className="grid grid-cols-8 p-2 border-2 border-black bg-[color:var(--component)]">
                <div>{index+1}</div>
                <div>{item.sales_id.kode}</div>
                <div>{showDate(item.sales_id.tgl)}</div>
                <div>{item.barang_id.nama}</div>
                <div>{item.qty}</div>
                <div>{item.diskon_pct}</div>
                <div>{item.diskon_nilai}</div>
                <div>{item.total}</div>
              </div>
            )
          }) 
          }
            </div>
            </div>
        </div>
    )
}