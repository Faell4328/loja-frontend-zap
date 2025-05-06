import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function CarroselProduto({ produtosImagem }: {produtosImagem: string[]}){

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        cssEase: "linear",
        arrows: false
    };

    return(
        <div>
            { (produtosImagem.length > 1 ) ? 
                (
                    <Slider {...settings}>
                        {produtosImagem.map((produto) => (
                            <div className="container-item-carrosel" key={produto}>
                                <img className="w-full md:h-[600px] rounded-4xl p-5 object-cover" src={produto} alt={produto} />
                            </div>
                        ))}
                    </Slider>
                ) : (
                    <div key={produtosImagem[0]}>
                        <img className="w-full !md:h-[600px] rounded-4xl p-5 object-cover" src={produtosImagem[0]} alt={produtosImagem[0]} />
                    </div>
                )
            }
        </div>
    );
}