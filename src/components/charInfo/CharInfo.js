import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import './charInfo.scss';

import useMarverService from '../../services/MarverService';
import setContent from '../../utils/setContent';

const CharInfo = (props) => {
    const [char, setChar] = useState(null);

    const {getCurrentCharacter, clearError, process, setProcess} =  useMarverService();

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
            .then(() => setProcess('confirmed'))
            
    }

    const onCharLoaded = (char) => {
        setChar(char);
    }


    return (
        <div className="char__info">
            {setContent(process, View, char)}
        </div>
    )
}

const View = ({data}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = data;

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