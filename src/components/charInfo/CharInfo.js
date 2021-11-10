import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import './charInfo.scss';
import thor from '../../resources/img/thor.jpeg';
import useMarverService from '../../services/MarverService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';

const CharInfo = (props) => {
    const [char, setChar] = useState(null);

    const {error, loading, getCurrentCharacter, clearError} =  useMarverService();

    useEffect(() => {
        updateChar();
    }, [props.charId]);

    const updateChar = () => {

        const {charId} = props;
        if(!charId) {
            return;
        }
        clearError();

        getCurrentCharacter(charId)
            .then(onCharLoaded)
            
    }

    const onCharLoaded = (char) => {
        setChar(char);
    }

    const skeleton =  char || loading || error ? null : <Skeleton/>
    const errorMessage = error ? <ErrorMessage/> : null
    const spinner = loading ? <Spinner/> : null
    const content = !(loading || error || !char) ? <View char ={char}/> : null

    return (
        <div className="char__info">
            {skeleton}
            {errorMessage}
            {spinner}
            {content}
        </div>
    )
}

const View = ({char}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = char;

    let clazz = 'char__basics';

    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        clazz += ' char__basics--contain'

    } 
    return (
        <>
            <div className={clazz}>
                <img src={thumbnail} alt={name}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comics.length > 0 ? null : 'there is none of comics'}
                {
                    comics.map((item, i) => {
                        if(i > 9) {
                            return;
                        } 

                        return (
                            <li className="char__comics-item" key={i}>
                                {item.name}
                            </li>
                        )

                    })
                }
            </ul>
        </>
    )
}

CharInfo.propTypes = {
    charId: PropTypes.number
}

export default CharInfo;