import Dashboard from "@/components/dashboard";
import { useState } from "react";
import DatePicker  from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";



export default function FormInput(){

    const [startDate, setStartDate] = useState(new Date());

    return(
        <div id="page">
            <Dashboard/>
            <div id="main" className="p-20">
                <div className=" flex justify-center gap-8">
                 <div className=" flex border-2 flex-col justify-start items-end gap-4 p-4 ">
                    <div>Transaksi</div>
                    <div className="flex  gap-8">
                        <label>Kode</label>
                        <input className="text-[color:var(--text-input)]"></input>
                    </div>
                    <div  className="flex  gap-8">
                        <label>Tanggal</label>
                        <DatePicker selected={startDate} onChange={(date:any) => setStartDate(date)}
                         className="text-[color:var(--text-input)]"/>
                    </div>
                </div>
                <div className="flex border-2 flex-col justify-start items-end gap-4 p-4 ">
                    <div>Customer</div>
                    <div className="flex  gap-8">
                        <label>Kode</label>
                        <input  className="text-[color:var(--text-input)]"></input>
                    </div>
                    <div  className="flex  gap-8">
                        <label>Nama</label>
                        <input  className="text-[color:var(--text-input)]"></input>
                    </div>
                    <div  className="flex  gap-8">
                        <label>No.Telp</label>
                        <input  className="text-[color:var(--text-input)]"></input>
                    </div>
                 </div>
                </div>
                <div>table</div>
            </div>
        </div>
    )
}