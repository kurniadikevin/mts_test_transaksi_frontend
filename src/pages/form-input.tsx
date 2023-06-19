import Dashboard from "@/components/dashboard";
import { useEffect, useState } from "react";
import DatePicker  from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {generateString, formatNumber} from '../functions';
import axios from "axios";



export default function FormInput(){

    const [startDate, setStartDate] = useState(new Date());
    const [kodeInput,setKodeInput]= useState<string>('');
    const [selectedOption, setSelectedOption] = useState('');
    const [options,setOptions]=useState<any>(['null']);
    const [data,setData]= useState<any>([]);
    const[dataBarang,setDataBarang]=useState([]);
    const [selectedBarang,setSelectedBarang]=useState('');
    const [objBarangSelect, setObjBarangSelect]= useState<any>({harga:0});
    const [discountPerc,setDiscountPerc]= useState<any>(0);
    const [quantity,setQuantity]= useState<any>(0);

    type formObject = {
        kode: string;
        nama_barang :string;
        qty: number;
        harga: string;
        diskon:number;
      };

    const handleSelectionChange = (event:any) => {
        setSelectedOption(event.target.value);
      };
      
    const handleSelectionBarang = (event:any) => {
        setSelectedBarang(event.target.value);
        filterDataBarang(dataBarang,event.target.value)
      };

    const filterDataBarang=(data:any,input:string)=>{
        const filtered= data.filter((item:any)=>{
            return item.nama === input
        })
        setObjBarangSelect(filtered[0])
    }

    const fetchCustomerCode=async()=>{
        axios({
            method : 'GET',
            url: 'http://localhost:5000/customer/all',
            headers : {  Authorization : `Bearer ${localStorage.getItem("token")}`},
          
          }).then((res)=>{
            setOptions(res.data)
          }).catch((err)=>{
            console.log(err)
          })
    }

    const fetchBarangAll=async()=>{
        axios({
            method : 'GET',
            url: 'http://localhost:5000/barang/all',
            headers : {  Authorization : `Bearer ${localStorage.getItem("token")}`},
          
          }).then((res)=>{
            setDataBarang(res.data)
          }).catch((err)=>{
            console.log(err)
          })
    }

    const toggleNewForm=()=>{
        const form:any= document.querySelectorAll('#table-cont-form');
        const formNew:any= form[form.length-1];
        formNew.style.display==='none' ? formNew.style.display='grid' :formNew.style.display='none'
    }

    const addFormDataToData=()=>{  
        const objForm= {
            kode : objBarangSelect.kode,
            nama_barang : selectedBarang,
            qty : quantity,
            harga_bandrol : objBarangSelect.harga,
            diskon_pct : discountPerc,
            diskon_nilai : discountPerc * objBarangSelect.harga / 100,
            harga_diskon :  objBarangSelect.harga - (discountPerc * objBarangSelect.harga / 100),
            total :  quantity* objBarangSelect.harga * (100-discountPerc)/ 100
        }
        setData((data:any)=> [...data,objForm])
    }

    const deleteRowData=(index:number)=>{
        setData((prevArray:any) => prevArray.filter((item:any,i:any) => i !== index));
    }
    

    useEffect(()=>{
        fetchCustomerCode();
        fetchBarangAll()
       setKodeInput( generateString(6))
    },[])

    useEffect(()=>{
      console.log(data)//
    },[objBarangSelect,data])

    return(
        <div id="page">
            <Dashboard/>
            <div id="main" className="p-10">
                <div className=" flex justify-start gap-8">
                 <div className=" flex border-2 flex-col justify-start items-end gap-4 p-4 rounded-l ">
                    <div className="font-bold text-xl">Transaksi</div>
                    <div className="flex  gap-8">
                        <label>Kode</label>
                        <input className="text-[color:var(--text-input)]" value={kodeInput}></input>
                    </div>
                    <div  className="flex  gap-8">
                        <label>Tanggal</label>
                        <DatePicker selected={startDate} onChange={(date:any) => setStartDate(date)}
                         className="text-[color:var(--text-input)]"/>
                    </div>
                </div>
                <div className="flex border-2 flex-col justify-start items-end gap-4 p-4 ">
                    <div className="font-bold text-xl">Customer</div>
                    <div className="flex  gap-8">
                        <label>Kode</label>
                        <select value={selectedOption} onChange={handleSelectionChange}
                        className="text-[color:var(--text-input)] w-60">
                                <option value="">Pilih kode customer</option>
                                {options.map((option:any, index:any) => (
                                <option key={index} value={option.kode}>
                                    {option.kode}
                                </option>
                                ))}
                            </select>
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
                 <div className=" flex border-2 bg-[color:var(--button)] flex-col justify-start items-end gap-4 p-4 ">
                    <div className="font-bold text-lg flex gap-4 justify-between items-center">
                        <div>Subtotal</div>
                        <div>129.000</div>
                    </div>
                    <div className="font-bold text-lg flex gap-8 justify-between items-center">
                        <div>Diskon</div>
                        <input   className="text-[color:var(--text-input)]"></input>
                    </div>
                    <div  className="font-bold text-lg flex gap-8 justify-between items-center">
                        <div>Ongkir</div>
                        <input   className="text-[color:var(--text-input)]"></input>
                    </div>
                    <div className="font-bold text-xl flex gap-4">
                        <div>Total Bayar</div>
                        <div>234.000</div>
                    </div>
                </div>
                </div>
                <div className=" mt-6">
                    <div id="table-cont-form" className="border-2 p-2 font-bold bg-[color:var(--button)] gap-4">
                        <button className="cursor-pointer bg-[color:var(--text)] text-black rounded-xl"
                          onClick={toggleNewForm}>
                            Tambah
                        </button>
                        <div>No</div>
                        <div>Kode Barang</div>
                        <div>Nama Barang</div>
                        <div>Qty</div>
                        <div>Harga /pc </div>
                        <div>Diskon(%)</div>
                        <div>Diskon(Rp)</div>
                        <div>Harga Diskon</div>
                        <div>Total </div>
                    </div>
                    
                    <div>{data.map((item:any, index:number)=>{
                        return(
                            <div id="table-cont-form" className="border-2 p-2 py-4 font-bold bg-[color:var(--component)] gap-4">
                            <button className="cursor-pointer bg-[color:var(--text)] text-black rounded-xl"
                              onClick={()=> deleteRowData(index)}>
                                Hapus
                            </button>
                            <div>{index+1}</div>
                            <div>{item.kode}</div>
                            <div>{item.nama_barang}</div>
                            <div>{item.qty}</div>
                            <div>{formatNumber(item.harga_bandrol)}</div>
                            <div>{item.diskon_pct} %</div>
                            <div>{formatNumber(item.diskon_nilai)}</div>
                            <div>{formatNumber(item.harga_diskon)}</div>
                            <div>{formatNumber(item.total)}</div>
                        </div>
                        )
                    })}
                    </div>

                    <div id="table-cont-form" className="mt-8 p-4 rounded-xl  text-[color:var(--text-input)]  bg-[color:var(--text)] gap-4">
                        <button className="cursor-pointer font-bold text-xl bg-[color:var(--button)] text-white rounded-xl"
                            onClick={addFormDataToData}>
                            +
                        </button>
                        <div></div>
                        <div id="kode-form">{objBarangSelect.kode}</div>
                        <select value={selectedBarang} onChange={handleSelectionBarang}
                        className="text-[color:var(--text-input)] w-25">
                                {dataBarang.map((option:any, index:any) => (
                                <option key={index} value={option.name} /* onSelect={setIndexBarang(index)} */>
                                    {option.nama}
                                </option>
                                ))}
                            </select>
                        <div>
                            <input className="w-10 bg-[color:var(--gray)]" placeholder="qty" 
                            value={quantity}  onChange={(e)=> setQuantity((e.target.value))}>
                            </input>
                        </div>
                        <div>{formatNumber(objBarangSelect.harga)}</div>
                        <div className="flex">
                            <input className="w-12 bg-[color:var(--gray)]" placeholder="diskon"
                            value={discountPerc} onChange={(e)=> setDiscountPerc((e.target.value))}>
                            </input>
                            <div>%</div>
                        </div>
                        <div>{formatNumber(discountPerc * objBarangSelect.harga / 100)}</div>
                        <div>
                            {formatNumber(
                            objBarangSelect.harga - (discountPerc * objBarangSelect.harga / 100))}
                        </div>
                        <div>{formatNumber(
                            quantity* objBarangSelect.harga * (100-discountPerc)/ 100
                        )}</div>
                    </div>
                    
                    <div>
                        
                    </div>
                </div>
            </div>
        </div>
    )
}