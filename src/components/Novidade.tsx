import { useNavigate } from 'react-router';

interface produtosApiProps{
    id: number,
    nome: string,
    valor: number,
    imagem: string;
}

export default function Novidade({ produtosApi }: { produtosApi: produtosApiProps[] }){

    const navigate = useNavigate();

    function converterNumeroParaReais(valor: number){
        let reais: string = valor.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        })
        return reais;
    }

    return(
        <>
            {produtosApi.length > 0  && (
                <div className='bg-[rgba(204,204,204,0.5)] slider-container max-w-5xl w-11/12 justify-between items-center mx-auto rounded-3xl'>
                    <h1 className='font-bold text-4xl text-center py-5 ps-5 pe-4'>Novidades</h1>
                    <div className='grid grid-cols-1 md:grid-cols-3'>
                        {produtosApi.map((produto) => (
                            <div className='mb-14 cursor-pointer' key={produto.id} onClick={ () => navigate(`produto/${produto.id}`) }>
                                <img className="w-8/10 h-[400px] mx-auto rounded-4xl p-5 object-cover" src={produto.imagem} alt={produto.nome} />
                                <p className='text-center'>{ produto.nome }</p>
                                <p className='text-center'>{ converterNumeroParaReais(produto.valor) }</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    )
}