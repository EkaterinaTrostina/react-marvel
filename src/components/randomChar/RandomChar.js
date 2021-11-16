import { useState, useEffect } from 'react';
import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';

import useMarverService from '../../services/MarverService';
import setContent from '../../utils/setContent';

const RandomChar = () => {
    const [char, setChar] = useState({});

    const {loading, error, getCurrentCharacter, clearError, process, setProcess} = useMarverService();

    useEffect(() => {
        updateChar();

        // const timerId = setInterval(updateChar, 3000);

        // return () => {
        //     clearInterval(timerId)
        // }
    }, []);

    const onCharLoaded = (char) => {
        setChar(char);
    }

    const updateChar = () => {
        clearError();
        
        const id  = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);

        getCurrentCharacter(id)
            .then(onCharLoaded)
            .then(() => setProcess('confirmed'))
    }


    return (
        <div className="randomchar">
            {setContent(process, View, char)}
            <div className="randomchar__static">
                <p className="randomchar__title">
                    Random character for today!<br/>
                    Do you want to get to know him better?
                </p>
                <p className="randomchar__title">
                    Or choose another one
                </p>
                <button 
                    className="button button__main"
                    onClick ={updateChar}>
                    <div className="inner">try it</div>
                </button>
                <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
            </div>
        </div>
    )
}

const View = ({data}) => {
    const {name, description, thumbnail, homepage, wiki} = data;
    const notDescr = "we don't have description for this character";

    let imgClassName = 'randomchar__img';

    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgClassName += ' randomchar__img--contain'

    } 
   
    return(
        <div className="randomchar__block"> 
            <img src={thumbnail} alt="Random character" className={imgClassName}/>
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">
                    {description ? description : notDescr}
                </p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default RandomChar;