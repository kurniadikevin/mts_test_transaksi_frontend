import 'material-icons/iconfont/material-icons.css';
import { useRouter } from 'next/navigation';


export default function Dashboard(){

    const { push } = useRouter();

    return(
        <div id="dashboard-component" className="border-2 pl-8 pr-4">
            <div id='dash-title'  className="flex justify-center 
            items-start font-bold  pl-8  pt-8 text-2xl">
                Department Transaksi
            </div>
            <div className="flex justify-start items-start font-bold text-lg cursor-pointer gap-4"
            onClick={()=> push('/')}>
                <span className="material-icons">list</span>     
                <div id='dash-select'>Daftar Transaksi</div>
            </div>
            <div className="flex justify-start items-start font-bold text-lg cursor-pointer gap-4"
            onClick={()=> push('/form-input')}>
                <span className="material-icons">note_add</span>     
                <div id='dash-select'>Form Input</div>
            </div>
            <div className="flex justify-start items-start font-bold text-lg cursor-pointer gap-4">
                <span className="material-icons">add</span>     
                <div id='dash-select'>Item / Customer</div>
            </div>
            <div className="flex justify-start  items-center font-bold text-lg cursor-pointer gap-4"
            onClick={()=> push('/sign-page')}>
            <span className="material-icons">logout</span>
                <div id='dash-select' className="bg-[color:var(--button)] w-30 h-15 p-2 
                rounded-2xl font-bold flex justify-start items-center">
                    Sign-out</div>
            </div>
        </div>
    )
}