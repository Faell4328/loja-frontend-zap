import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface produtosApiProps{
    id: number,
    nome: string,
    valor: number,
    imagem: string;
}

export default function CarroselHome({produtosApi}: {produtosApi: produtosApiProps[]}){

    const [quantidadeSlidesCarrosel, setQuantidadeSlidesCarrosel] = useState<number>( window.innerWidth > 769 ? 3 : 1 );
    const posicaoMouse = useRef<number>(0)

    const navigate = useNavigate();

    useEffect( () => {
        window.addEventListener('resize', () => setQuantidadeSlidesCarrosel( window.innerWidth > 769 ? 3 : 1 ))
    }, [])

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: quantidadeSlidesCarrosel,
        slidesToScroll: 1,
        cssEase: "linear",
        arrows: false
    };

    function converterNumeroParaReais(valor: number){
        let reais: string = valor.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        })
        return reais;
    }

    return(
        <>
            { produtosApi.length > 0  && (
                <div className='bg-[rgba(204,204,204,0.5)] slider-container max-w-5xl w-11/12 justify-between items-center mx-auto pb-10 rounded-3xl'>
                    <h1 className='font-bold text-4xl text-center py-5'>Promoção</h1>
                    <Slider {...settings}>
                        {produtosApi.map((produto) => (
                            // O onMouseDown e onMouseUp é para evitar o problema de arrastar para ver mais produtos e ele abrir (o que não era desejado)
                            <div className="container-item-carrosel cursor-pointer" onMouseDown={(e) => posicaoMouse.current=(e.clientX + e.clientY)} onMouseUp={(e) => (e.clientX + e.clientY == posicaoMouse.current) && navigate(`/produto/${produto.id}`)} key={produto.id}>
                                <img className="w-8/10 !h-[400px] mx-auto rounded-4xl p-5 object-cover" src={produto.imagem} alt={produto.nome} />
                                <p className='text-center'>{ produto.nome }</p>
                                <p className='text-center'>{ converterNumeroParaReais(produto.valor) }</p>
                            </div>
                        ))}
                    </Slider>
                </div>
            )}
        </>
    );
}