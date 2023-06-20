import Dashboard from "@/components/dashboard";
import { useEffect, useState } from "react";
import DatePicker  from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {generateString, formatNumber,makeSalesSubmit, callModal} from '../functions';
import axios from "axios";
import { useRouter } from 'next/navigation';

export default function FormInput(){

    const { push } = useRouter();
    const [startDate, setStartDate] = useState(new Date());
    const [kodeInput,setKodeInput]= useState<string>('');
    const [custumerKodeOption, setCustomerKodeOption] = useState('');
    const [customerData,setCustomerData]=useState<any>(['null']);
    const [customerId,setCustomerId]= useState<any>('');
    const [customerTelp,setCustomerTelp]=useState<any>('')
    const [data,setData]= useState<any>([]);
    const[dataBarang,setDataBarang]=useState([]);
    const [selectedBarang,setSelectedBarang]=useState('');
    const [objBarangSelect, setObjBarangSelect]= useState<any>({harga:0});
    const [discountPerc,setDiscountPerc]= useState<any>(0);
    const [quantity,setQuantity]= useState<any>(1);
    const [diskonTotal,setDiskonTotal]= useState<any>(0);
    const [ongkirTotal,setOngkirTotal]= useState<any>(0);

    const handleSelectionChangeCust = (event:any) => {
        setCustomerKodeOption(event.target.value);
        const filtered= customerData.filter((item:any)=>{
            return item.kode === event.target.value
        })
        if(filtered[0]?._id && filtered[0]?.telp){
            setCustomerId(filtered[0]._id)
            setCustomerTelp(filtered[0].telp)
        }
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

    const getSubTotal=()=>{
        if(data.length >0){
        const totalArr=data.map((item:any)=>{
            return item.total
        })
        const subTotal= totalArr.reduce((total:number,num:number)=>{
            return total + num;
        })
        return (subTotal);
        }
    }

    const getJumlahBarang=()=>{
        if(data.length >0){
        const totalArr=data.map((item:any)=>{
            return Number(item.qty)
        })
        const total= totalArr.reduce((total:number,num:number)=>{
            return total + num;
        })
        return (total);}
        else{ return 0}
    }

    const getTotalBayar=()=>{
        const subTotal= getSubTotal();
        const total= (subTotal + Number(ongkirTotal)) - diskonTotal;
        return (total)
    }


    const fetchCustomerCode=async()=>{
        axios({
            method : 'GET',
            url: 'https://wild-rose-pigeon-belt.cyclic.app/customer/all',
            headers : {  Authorization : `Bearer ${localStorage.getItem("token")}`},
          
          }).then((res)=>{
            setCustomerData(res.data)
          }).catch((err)=>{
            console.log(err)
          })
    }

    const fetchBarangAll=async()=>{
        axios({
            method : 'GET',
            url: 'https://wild-rose-pigeon-belt.cyclic.app/barang/all',
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
            total :  quantity* objBarangSelect.harga * (100-discountPerc)/ 100,
            barang_id : objBarangSelect._id
        }
        setData((data:any)=> [...data,objForm])
    }

    const deleteRowData=(index:number)=>{
        setData((prevArray:any) => prevArray.filter((item:any,i:any) => i !== index));
    }

    const converDateToString=(input:any)=>{
        const date= input.toISOString().split('T')[0];
        return date
    }

    const submitForm=()=>{
        if(kodeInput && converDateToString(startDate)&& customerId ){
            console.log(kodeInput,converDateToString(startDate),customerId,
            diskonTotal,ongkirTotal,getSubTotal(),getTotalBayar())
            makeSalesSubmit(kodeInput,converDateToString(startDate),customerId,diskonTotal,
            ongkirTotal,getSubTotal(),getJumlahBarang(),getTotalBayar(),data);
            setData([])
            toggleNewForm()
        } else{
            callModal('Error: please input customer data!')
        }
    }
    

    useEffect(()=>{
        fetchCustomerCode();
        fetchBarangAll();
       setKodeInput( generateString(6));
       const form:any= document.querySelectorAll('#table-cont-form');
       form[form.length-1].style.display='none';
       const session= localStorage.getItem("session-data")
       if(!session){
         push('/sign-page')
       }
    },[])

    useEffect(()=>{

    },[objBarangSelect,data])

    return(
        <div id="page">
            <Dashboard/>
            <div id="main" className="p-20">
                <div className="flex justify-between gap-8">

                 <div className=" flex bg-[color:var(--component)] flex-col justify-start items-end gap-4 p-4 rounded-l ">
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
                <div className="flex  bg-[color:var(--component)] flex-col justify-start items-end gap-4 p-4 ">
                    <div className="font-bold text-xl">Customer</div>
                    <div className="flex  gap-8">
                        <label>Nama</label>
                        <select value={custumerKodeOption} onChange={handleSelectionChangeCust}
                        className="text-[color:var(--text-input)] w-60">
                                <option value="">Pilih nama customer</option>
                                {customerData.map((option:any, index:any) => (
                                <option key={index} value={option.kode}>
                                    {option.nama}
                                </option>
                                ))}
                            </select>
                    </div>
                    <div  className="flex  gap-8">
                        <label>Kode</label>
                        <input value={custumerKodeOption} className="text-[color:var(--text-input)]"></input>
                    </div>
                    <div  className="flex  gap-8">
                        <label>No.Telp</label>
                        <input value={customerTelp} className="text-[color:var(--text-input)]"></input>
                    </div>
                 </div>
                 <div className=" flex  bg-[color:var(--button)] flex-col justify-start items-start gap-4 p-4 ">
                    <div className="font-bold text-lg flex gap-4 justify-start items-center">
                        <div>Subtotal:</div>
                        <div>{formatNumber(getSubTotal())}</div>
                        <div>Jumlah:</div>
                        <div>{getJumlahBarang()}</div>
                    </div>
                    <div className="font-bold  flex gap-4 justify-between items-center">
                        <div>Diskon</div>
                        <input className="px-2 text-[color:var(--text-input)] w-40"
                          value={diskonTotal} onChange={(e)=> setDiskonTotal((e.target.value))}>
                        </input>
                    </div>
                    <div  className="font-bold  flex gap-4 justify-between items-center">
                        <div>Ongkir</div>
                        <input   className=" px-2 text-[color:var(--text-input)] w-40"
                         value={ongkirTotal} onChange={(e)=> setOngkirTotal((e.target.value))}
                         >
                         </input>
                    </div>
                    <div className="font-bold text-lg flex gap-4">
                        <div>Total Bayar</div>
                        <div>{formatNumber(getTotalBayar())}</div>
                    </div>
                </div>
                </div>
                <div className=" mt-6">
                    <div id="table-cont-form" className="border-2 border-black p-2 py-3 font-bold bg-[color:var(--button)] gap-4">
                        <button className="cursor-pointer bg-[color:var(--text)] text-[color:var(--button)] rounded-xl"
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
                            <div id="table-cont-form" className="border-2 border-black p-2 py-3 font-bold bg-[color:var(--component)] gap-4">
                            <button className="cursor-pointer bg-[color:var(--text)] text-[color:var(--button)] rounded-xl"
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
                        <button className="cursor-pointer font-bold text-xl  text-white 
                        rounded-xl flex justify-center "
                            onClick={addFormDataToData}>
                            <span className="material-icons text-[color:var(--button)] text-xl">add_box</span>
                        </button>
                        <div></div>
                        <div id="kode-form">{objBarangSelect.kode}</div>
                        <select value={selectedBarang} onChange={handleSelectionBarang}
                        className="text-[color:var(--text-input)] w-25">
                                {dataBarang.map((option:any, index:any) => (
                                <option key={index} value={option.name}>
                                    {option.nama}
                                </option>
                                ))}
                            </select>
                        <div>
                            <input className="w-10 bg-[color:var(--gray)]" placeholder="qty" type="number"
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
                        <div>
                            {formatNumber( quantity* objBarangSelect.harga * (100-discountPerc)/ 100)}
                        </div>
                    </div>
                    <div  className=" pt-8 font-bold flex justify-center items-center gap-12">
                        <button className=" bg-[color:var(--button)] py-2 px-3 rounded-xl"
                        onClick={submitForm}>
                        Simpan</button>
                        <button className=" bg-[color:var(--button)] py-2 px-3 rounded-xl"
                         onClick={()=>{setData([]);toggleNewForm() }}
                         >Batal
                        </button>
                    </div>
                    <div>
                        
                    </div>
                </div>
            </div>
        </div>
    )
}