import { useState, useEffect, useRef, CSSProperties } from 'react';
import { useParams } from "react-router";
import toast from 'react-hot-toast';

import api from "../../services/api";
import CarroselProduto from '../../components/CarroselProduto';

interface baseProdutoApiProps{
    id: number;
    nome: string;
    descricao: string;
    tamanho: string[];
    valor: number;
    imagem: string[];
}

interface produtoApiProps{
    data: {
        geral: baseProdutoApiProps[];
    }
}

interface novoProdutoProps{
    id: number;
    tamanho: string;
    quantidade: number;
}

interface itemsSacolaProps{
    id: number;
    tamanho: string;
    quantidade: number
}

export default function Produto(){

    const [produto, setProduto] = useState<baseProdutoApiProps | null>(null);
    const [alturaPagina, setAlturaPagina] = useState<string>("");
    const [estiloBotaoAdicionarSacola, setEstiloBotaoAdicionarSacola] = useState<CSSProperties | undefined>(undefined)

    const tamanhoSelecionado = useRef<any>(null);
    const itemsSacola = useRef<itemsSacolaProps[][]>([]);

    const { id } = useParams<string>();

    useEffect( () => {
        async function consultar(){
            try{
                const response: produtoApiProps = await api.get(`/db.json`);
                setProduto(response.data.geral[Number(id) - 1]);
            }
            catch (error){
                console.error('Erro ao consultar:', error);
            }
        }

        window.addEventListener('resize', () => calcularAltura());
        calcularAltura();
        consultar();
        localStorage.getItem('produtos') != null ? itemsSacola.current = JSON.parse(localStorage.getItem('produtos') || '') : itemsSacola.current = [];
        console.warn('Do arquivo Produto/index.tsx')
        console.log(itemsSacola.current);
    }, [])

    function calcularAltura(): void{
        setAlturaPagina(`calc(100dvh - ${document.getElementsByTagName('header')[0].clientHeight}px)`);
    }

    function selecionarTamanho(evento: any): void{

        if(tamanhoSelecionado.current != null){
            tamanhoSelecionado.current.style.removeProperty('background-color');
            tamanhoSelecionado.current.style.removeProperty('color');
        }

        tamanhoSelecionado.current = evento.target;
        evento.target.style='background-color: #000; color: #f3c860'
        setEstiloBotaoAdicionarSacola({backgroundColor: '#000', color: '#f3c860'});
    }

    function adicionarProdutoSacola(): void{
        let novoProduto: novoProdutoProps = {
            id: produto?.id as number,
            tamanho: tamanhoSelecionado.current.textContent.toLowerCase(),
            quantidade: 1
        };

        // Verificando se já existe o item com esse id
        if(itemsSacola.current.some( (item: { id: number }[]) => item[0].id == produto?.id )){
            // Verificando se já existe produto com esse ID
            let indiceDoItemExistente = itemsSacola.current.findIndex((item) => item[0].id === produto?.id);
            // Verificando se tamanho já existe
            let indiceDoTamanhoExistente = itemsSacola.current[indiceDoItemExistente].findIndex(item => item.tamanho === novoProduto.tamanho);

            if(indiceDoTamanhoExistente != -1){
                console.log('Ja existe produto com esse ID');
                novoProduto = {...novoProduto, quantidade: (itemsSacola.current[indiceDoItemExistente][indiceDoTamanhoExistente].quantidade+1)}
                itemsSacola.current[indiceDoItemExistente][indiceDoTamanhoExistente] = novoProduto;
                console.log(itemsSacola.current)
            }
            else{
                console.log('Não existe produto com esse ID');
                itemsSacola.current[indiceDoItemExistente].push(novoProduto);
                console.log(itemsSacola.current)
            }
        }
        else{
            itemsSacola.current.push([novoProduto]);
            console.log(itemsSacola.current)
        }

        localStorage.setItem('produtos', JSON.stringify(itemsSacola.current));
        toast.success('Adicionado na sacola');
    }

    function converterNumeroParaReais(valor: number){
        let reais: string = valor.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        })
        return reais;
    }

    return(
            ( produto !== null &&  (Object.keys(produto).length > 0)) ? (
                <div className='block lg:flex items-center fundo-gradient w-full h-full' style={{minHeight: alturaPagina}}>
                    <div className='md:flex max-w-5xl md:h-full mx-auto py-12'>
                        <div className='w-9/10 md:w-4/10 mx-auto'>
                            <CarroselProduto produtosImagem={produto.imagem} />
                        </div>
                        <div className='flex md:block flex-col md:flex-none items-center md:items-start w-8/10 md:w-5/12 mt-12 md:mt-24 mx-auto md:mx-4'>
                            <p className='font-bold text-3xl my-2'>{produto.nome}</p>
                            <p className='font-medium my-2'>Valor: { converterNumeroParaReais(produto.valor) }</p>
                            {produto.descricao && (
                                <>
                                    <br />
                                    <p className='font-medium my-2'>{produto.descricao}</p>
                                </>
                            )}
                            {produto.tamanho &&(
                                <>
                                    <br />
                                    <p className='font-medium my/-2'>Tamanho:</p>
                                    <div className='inline'>
                                        {produto.tamanho.map( (tamanhoAtual) => {
                                            return(
                                                <button className='border rounded-2xl text-[18px] py-2 px-4 m-3 cursor-pointer' key={tamanhoAtual} onClick={ (evento) => selecionarTamanho(evento)}>{tamanhoAtual.toUpperCase()}</button>
                                            )
                                        })}
                                    </div>
                                    <br />
                                    <button className='w-2xs border rounded-2xl font-medium p-4 my-2 cursor-pointer' style={estiloBotaoAdicionarSacola} onClick={ () => (estiloBotaoAdicionarSacola != undefined ) ? adicionarProdutoSacola() : toast.error('Seleciona algum tamanho')}>Adicionar ao Carrinho</button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            ):(
                <div></div>
            )
    )
}