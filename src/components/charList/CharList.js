import React, { useState, useEffect, useRef } from 'react';
import { CSSTransition, TransitionGroup,} from 'react-transition-group';
import PropTypes from 'prop-types';

import './charList.scss';
import abyss from '../../resources/img/abyss.jpg';
import useMarverService from '../../services/MarverService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

const CharList = (props) => {

    const [chars, setChars] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

    const {error, loading, getAllCharacters} = useMarverService();

    const renderChars = (arr) => {
        let char = false;
        const items = arr.map((item, i) => {
            char = true;
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            return(
                <CSSTransition key={item.id} timeout={500} classNames="char__item">
                    <li 
                        tabIndex={0}
                        ref={(el) => elemRefs.current[i] = el}
                        className="char__item" 
                        onKeyPress = {(e) => {
                            if(e.key === ' ' || e.key === 'Enter'){
                                focusOnItem(i);
                                props.onCharSelected(item.id)
                            }
                        }}
                        onClick={
                            () => {
                                focusOnItem(i);
                                props.onCharSelected(item.id)
                            } }>
                        <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                        <div className="char__name">{item.name}</div>
                    </li>
                </CSSTransition>
            )
        });
        return (
            <ul className="char__grid">
                <TransitionGroup component={null}>
                {items}
                </TransitionGroup>
            </ul>
        )
        
    }
    const elemRefs = useRef([]);

    const focusOnItem = (id) => {
        elemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        elemRefs.current[id].classList.add('char__item_selected');
        elemRefs.current[id].focus();
    }

    useEffect(() => {
        onRequest(offset, true);
    },[]);


    // onScroll = () => {
    //     window.addEventListener('scroll', () => {
    //         if(document.documentElement.scrollTop + window.screen.height*1.5 >= document.documentElement.scrollHeight){
    //             this.onRequest();
    //         }
    //     })
    // }

    // componentWillUnmount() {
    //     window.removeEventListener('scroll', this.onScroll);
    // }

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);

        getAllCharacters(offset)
            .then(onCharsLoaded)
    }


    const onCharsLoaded = (newChars) => {

        let ended = false;
        if(newChars.length < 9) {
            ended = true;
        }
        setChars(chars => [...chars, ...newChars]);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 9);
        setCharEnded(charEnded => ended);
    }


    const items = renderChars(chars);

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newItemLoading ? <Spinner/> : null;

    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {items}

            <button 
                style={{'display' : charEnded ? 'none' : 'block', 'animation': newItemLoading ? 'load 1s ease-in-out infinite' : ''}}
                className="button button__main button__long"
                disabled={newItemLoading}
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )

}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;