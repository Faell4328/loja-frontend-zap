import { useState, useEffect, useRef } from 'react';

import api from '../../services/api';
import toast from 'react-hot-toast';

interface itemsCompletosApiProps{
    id: number;
    nome: string;
    descricao: string;
    valor: number;
    imagem: string[];
}

interface itemsSacolaLocalProps{
    id: number;
    quantidade: number;
    tamanho: string;
}

export default function Sacola(){

    const [itemsCompletosApi, setItemsCompletosApi] = useState<itemsCompletosApiProps[]>([])
    const [itemsSacolaLocal, setItemsSacolaLocal] = useState<itemsSacolaLocalProps[][]>([])
    const [valorItems, setValorItems] = useState<number[]>([]);
    const [alturaPagina, setAlturaPagina] = useState<string>('');

    const itemsCompletosApiRef = useRef<itemsCompletosApiProps[]>([]);
    const itemsSacolaLocalRef = useRef<itemsSacolaLocalProps[][]>([]);
    const quantidadeItemRef = useRef<number[]>([]);

    useEffect( () => {
        async function consultar(){
            try{
                let retorno: itemsCompletosApiProps[] = [];
                const response = await api.get('/db.json');
                for(var contador = 0; contador < itemsSacolaLocalRef.current.length; contador++){
                    retorno.push(response.data.geral[itemsSacolaLocalRef.current[contador][0].id - 1]);
                }
                itemsCompletosApiRef.current = [...retorno];
                console.log(quantidadeItemRef.current)
                setItemsCompletosApi(retorno);
                contarQuantidadeItems();
            }
            catch (error){
                console.error('Erro ao consultar:', error);
            }
        }

        window.addEventListener('resize', () => calcularAltura());
        calcularAltura();
        localStorage.getItem('produtos') != null ? itemsSacolaLocalRef.current = JSON.parse(localStorage.getItem('produtos') || '') : itemsSacolaLocalRef.current = [];
        setItemsSacolaLocal(itemsSacolaLocalRef.current);
        itemsSacolaLocalRef.current && consultar();
    }, []);

    function calcularAltura(): void{
        setAlturaPagina(`calc(100vh - ${document.getElementsByTagName('header')[0].clientHeight}px)`);
    }

    function removerItemSacola(idItem: number): void{
        let itemsApiRemovido = itemsCompletosApi.filter( (item: { id: number }) => item.id != idItem);
        console.log(itemsSacolaLocalRef.current)
        itemsSacolaLocalRef.current = itemsSacolaLocalRef.current.filter( (item: any) => {
            return item[0].id != idItem
        });

        itemsCompletosApiRef.current = [...itemsApiRemovido];
        setItemsCompletosApi([...itemsApiRemovido]);
        setItemsSacolaLocal([...itemsSacolaLocalRef.current]);
        localStorage.setItem('produtos', JSON.stringify(itemsSacolaLocalRef.current));
        contarQuantidadeItems();
    }

    function adicionarItem(idItem: number, tamanhoItem: string): void{
        let indiceDoItem = itemsSacolaLocal.findIndex( (item) => item[0].id == idItem);
        let indiceDoTamanho = itemsSacolaLocal[indiceDoItem].findIndex( (item: itemsSacolaLocalProps) => item.tamanho == tamanhoItem);

        itemsSacolaLocalRef.current[indiceDoItem][indiceDoTamanho].quantidade = itemsSacolaLocalRef.current[indiceDoItem][indiceDoTamanho].quantidade+1
        setItemsSacolaLocal([...itemsSacolaLocalRef.current]);
        localStorage.setItem('produtos', JSON.stringify(itemsSacolaLocalRef.current));
        contarQuantidadeItems()
    }

    function removerItem(idItem: number, tamanhoItem: string): void{
        let indiceDoItem = itemsSacolaLocal.findIndex( (item: itemsSacolaLocalProps[]) => item[0].id == idItem);
        let indiceDoTamanho = itemsSacolaLocal[indiceDoItem].findIndex( (item: itemsSacolaLocalProps) => item.tamanho == tamanhoItem);

        if(itemsSacolaLocalRef.current[indiceDoItem][indiceDoTamanho].quantidade <= 1){
            // Verificando se ele é o único tamanho da roupa, se for vai remover ela
            if(itemsSacolaLocalRef.current[indiceDoItem].length == 1){
                removerItemSacola(idItem)
                return;
            }
            itemsSacolaLocalRef.current[indiceDoItem] = itemsSacolaLocalRef.current[indiceDoItem].filter( (_: itemsSacolaLocalProps, indice: number) => indiceDoTamanho != indice)
            setItemsSacolaLocal([...itemsSacolaLocalRef.current]);
            localStorage.setItem('produtos', JSON.stringify(itemsSacolaLocalRef.current));
        }
        else{
            itemsSacolaLocalRef.current[indiceDoItem][indiceDoTamanho].quantidade = itemsSacolaLocalRef.current[indiceDoItem][indiceDoTamanho].quantidade-1
            setItemsSacolaLocal([...itemsSacolaLocalRef.current]);
            localStorage.setItem('produtos', JSON.stringify(itemsSacolaLocalRef.current));
        }
        contarQuantidadeItems()
    }

    function contarQuantidadeItems(): void{

        quantidadeItemRef.current=[];

        console.log(itemsCompletosApiRef.current)
        console.warn(itemsSacolaLocalRef.current)
        
        itemsCompletosApiRef.current?.forEach( (itemApi: itemsCompletosApiProps, indiceApi: number) => {
            itemsSacolaLocalRef.current[indiceApi].forEach( (itemLocal: itemsSacolaLocalProps) => {
                if(!quantidadeItemRef.current[indiceApi]){
                    quantidadeItemRef.current[indiceApi] = 0
                }
                quantidadeItemRef.current[indiceApi] += itemApi.valor * itemLocal.quantidade;
            })
        })
        setValorItems(quantidadeItemRef.current);
    }

    function converterNumeroParaReais(valor: number): string{
        let reais: string = valor.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        })
        return reais;
    }

    return(
        (itemsCompletosApi != null) ? (
            <div className='fundo-gradient w-full' style={{minHeight: alturaPagina}}>
                <div className='block max-w-5xl mx-auto px-6 py-12'>
                    { itemsCompletosApi.map( (itemApi: itemsCompletosApiProps, indiceApi: number) => (
                        <div className='grid grid-cols-1 md:grid-cols-2 mb-12' key={itemApi.id}>
                            <div className='w-full'>
                                <img className='w-full md:w-7/10 rounded-2xl object-cover' src={itemApi.imagem[0]} />
                            </div>
                            <div>
                                <p className='text-2xl font-bold text-center mt-4'>{itemApi.nome}</p>
                                <div className='grid grid-cols-2 gap-x-12'>
                                    { itemsSacolaLocal[indiceApi].map( (itemLocal: itemsSacolaLocalProps, indiceLocal: number) => (
                                        <div key={indiceLocal+indiceApi} className='block w-full'>
                                            <p className='pt-4 font-bold text-center'>Tamanho: {itemLocal.tamanho.toUpperCase()}</p>
                                            <p className='pt-1 text-center'>Quantidade: {itemLocal.quantidade}</p>
                                            <div className='flex justify-around py-2'>
                                                <button className='border px-3 py-1 cursor-pointer' data-id={itemApi.id} data-tamanho={itemLocal.tamanho} onClick={ (evento) => removerItem(Number((evento.target as HTMLButtonElement).dataset.id), (evento.target as HTMLButtonElement).dataset.tamanho || '') }>-</button>
                                                <button className='border px-3 py-1 cursor-pointer' data-id={itemApi.id} data-tamanho={itemLocal.tamanho} onClick={ (evento) => adicionarItem(Number((evento.target as HTMLButtonElement).dataset.id), (evento.target as HTMLButtonElement).dataset.tamanho || '') }>+</button>
                                            </div>
                                        </div>
                                    )) }
                                </div>
                                <p className='text-center'>Valor: { converterNumeroParaReais(valorItems[indiceApi]) } </p>
                                <button className='block border border-red-600 text-red-600 p-2 my-6 mx-auto cursor-pointer rounded-2xl' data-id={itemApi.id} onClick={ (evento) => removerItemSacola(Number((evento.target as HTMLButtonElement).dataset.id))}>Remover Item</button>
                            </div>
                        </div>
                    )) }
                {itemsCompletosApi.length > 0 ? (
                    <div>
                        <p className='text-center text-2xl pt-2 pb-12'>Valor Total: { converterNumeroParaReais(valorItems.reduce( (acumulador: number, numero: number) => acumulador += numero)) }</p>
                        <button className='block w-6/10 border border-[#f3c860] text-[#f3c860] bg-black p-2 mx-auto cursor-pointer rounded-2xl mb-8' onClick={ () => toast('Enviaria o pedido via WhatsApp usando a URL: "https://wa.me/<número>?text=<mensagem>"') }>Comprar</button>
                    </div>
                ):(
                    <p className='pt-22 text-center text-2xl font-bold'>Sacola está vazia</p>
                )}
                </div>
            </div>
        ):(
            <p>Carregando...</p>
        )
    )

}