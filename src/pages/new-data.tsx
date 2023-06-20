import Dashboard from "@/components/dashboard";
import { callModal } from "@/functions";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

export default function NewData(){

    const { push } = useRouter();
    const [type,setType]= useState<string>('customer');
    const [nama,setNama]=useState<string>('')
    const [kode,setKode]=useState<string>('')
    const [hargaTelp,setHargaTelp]=useState<any>()

    const highlightSelectType=()=>{
        let other;
        type === 'barang' ? other = 'customer' : other = 'barang'
        const element : any = document.querySelector(`#${type}-select`);
        element.style.color='var(--button)';
        element.style.fontWeight='700';
        const otherElement : any = document.querySelector(`#${other}-select`);
        otherElement.style.color='var(--text)';
        otherElement.style.fontWeight='400';
    }

    const handleSubmit=(input:string)=>{
        let property;
        input ==='barang' ? property='harga' : property= 'telp'
        axios({
          method: "POST",
          data: {
                'kode' : kode,
                'nama' : nama,
                [property] : hargaTelp
          },
          headers : {  Authorization : `Bearer ${localStorage.getItem("token")}`},
          url: `https://wild-rose-pigeon-belt.cyclic.app/${input}/add-new`,
        }).then((res) => {
          if(res.data === 'No User Exists'){
            console.log(res.data)
          } else{
            console.log(res.data)
            callModal(`Succeed: new ${type} added!`)
        }    
        });
    }


    useEffect(()=>{
        highlightSelectType()
    },[type])

    useEffect(()=>{
        const session= localStorage.getItem("session-data")
        if(!session){
          push('/sign-page')
        }
    },[])


    return(
        <div id="page">
        <Dashboard/>
        <div id="main" className="p-20">
        <div className="bg-[color:var(--component)] border-2 border-black  p-8 gap-2">
             <div className="h-20 flex item-end justify-start gap-4 p-4">
                <div id="customer-select" className="text-xl  pt-4 cursor-pointer" onClick={()=> setType('customer')}>
                    Customer
                </div>
                <div id="barang-select" className="text-xl  pt-4 cursor-pointer" onClick={()=> setType('barang')}>
                    Barang
                </div>
            </div>
            <div className=" h-20 p-4">
                <div className="pb-2 ">Nama</div>
                <input className="px-1 text-[color:var(--text-input)]" 
                 value={nama} onChange={(e)=> setNama((e.target.value))}>
                </input>
            </div>
            <div className=" h-20 p-4">
                <div className="pb-2">Kode</div>
                <input  className="px-1 text-[color:var(--text-input)]"
                 value={kode} onChange={(e)=> setKode((e.target.value))}>    
                </input>
            </div>
            <div className=" h-20 p-4">
                <div className="pb-2">{type === 'customer' ? 'No.Telp' : 'Harga'}</div>
                <input type={type==='barang'? 'number' : 'text'}
                 className="px-1 text-[color:var(--text-input)]"
                  value={hargaTelp} onChange={(e)=> setHargaTelp((e.target.value))}>    
                </input>
            </div>
            <div className="h-20  flex item-center justify-start p-4 pt-6 gap-4">
                <button className="bg-[color:var(--button)] w-20 h-10 rounded-lg font-bold"
                onClick={()=>handleSubmit(type)}>
                    Add New
                </button>
               
            </div>
         </div>
        </div>
        </div>
    )
}