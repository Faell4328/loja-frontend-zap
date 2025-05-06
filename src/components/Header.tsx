import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';

export default function Header(){

    const navigate = useNavigate();

    return(
        <header className='bg-[#211D1E] w-full'>
            <div className='flex max-w-5xl p-2 md:p-5 justify-between items-center mx-auto'>
                <div className='flex justify-around w-80'>
                    <img className='w-7 md:w-9 lg:w-10 h-auto ms-2 md:ms-8 lg:ms-12 cursor-pointer' src='/Instagram.png' onClick={ () => {toast('Seria redicionado para o Instagram')}} />
                    <img className='w-7 md:w-9 lg:w-10 h-auto cursor-pointer' src='/Whatsapp.png' onClick={ () => {toast('Seria redirecionado para o WhatsApp')}} />
                </div>
                <img className='w-auto h-10 md:h-10 lg:h-12 mx-2 cursor-pointer' src='/Logo.jpeg' onClick={ () => navigate('/') }  />
                <div className='flex justify-around w-80'>
                    <img className='w-7 md:w-9 lg:w-10 h-auto cursor-pointer' src='/Sacola.png' onClick={ () => navigate('/sacola') } />
                </div>
            </div>
        </header>
    )
}