import { useState, useEffect } from 'react';

import CarroselHome from "../../components/CarroselHome";
import Novidade from '../../components/Novidade';
import Todos from '../../components/Todos';

import api from '../../services/api';

interface estruturaProdutosApiProps{
    id: number;
    nome: string;
    valor: number;
    imagem: string;
}

interface produtosApiProps{
    data: {
        promocao: estruturaProdutosApiProps[];
        novidade: estruturaProdutosApiProps[];
        todos: estruturaProdutosApiProps[];
    };
}

export default function Home(){

    const [produtosPromocao, setProdutosPromocao] = useState<estruturaProdutosApiProps[]>([]);
    const [produtosNovidade, setProdutosNovidade] = useState<estruturaProdutosApiProps[]>([]);
    const [produtosTodos, setProdutosTodos] = useState<estruturaProdutosApiProps[]>([]);
    
    useEffect( () => {
        async function consultar():Promise<void> {
            try {
                const response: produtosApiProps = await api.get('/db.json');
                console.log(response.data)
                setProdutosPromocao(response.data.promocao);
                setProdutosNovidade(response.data.novidade );
                setProdutosTodos(response.data.todos );
            } catch (error) {
                console.error('Erro ao consultar:', error);
            }
        }

        consultar();
    }, []);

    return (
        <>
            {(produtosPromocao.length || produtosNovidade.length || produtosTodos.length) ? (
                <section className='fundo-gradient'>
                    <div className='w-full py-5'>
                        <CarroselHome produtosApi={produtosPromocao} />
                    </div>
                    <div className='w-full py-5'>
                        <Novidade produtosApi={produtosNovidade} />
                    </div>
                    <div className='w-full py-5'>
                        <Todos produtosApi={produtosTodos} />
                    </div>
                </section>
            ):(
                <div></div>
            )}
        </>
    );
}