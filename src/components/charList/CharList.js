import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './charList.scss';
import abyss from '../../resources/img/abyss.jpg';
import MarverService from '../../services/MarverService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

class CharList extends Component {

    state = {
        chars: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 210,
        charEnded: false,
    }

    marverService = new MarverService();

    renderChars(arr) {
        const items = arr.map((item, i) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }

            return(
                <li 
                    tabIndex={0}
                    ref={this.setRef}
                    className="char__item" 
                    key={item.id} 
                    onKeyPress = {(e) => {
                        if(e.key === ' ' || e.key === 'Enter'){
                            this.focusOnItem(i);
                            this.props.onCharSelected(item.id)
                        }
                    }}
                    onClick={
                        () => {
                            this.focusOnItem(i);
                            this.props.onCharSelected(item.id)
                        } }>
                    <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                    <div className="char__name">{item.name}</div>
                </li>
            )
        });
        return items;
        
    }
    elemRefs =[];

    setRef = (ref) => {
        this.elemRefs.push(ref);
    }

    focusOnItem = (id) => {
        this.elemRefs.forEach(item => item.classList.remove('char__item_selected'));
        this.elemRefs[id].classList.add('char__item_selected');
        this.elemRefs[id].focus();
    }

    componentDidMount() {
        this.onRequest();
    }

    onRequest = (offset) => {
        this.onCharLoading();

        this.marverService
            .getAllCharacters(offset)
            .then(this.onCharsLoaded)
            .catch(this.onError)
    }

    onCharLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }
    
    onCharsLoaded = (newChars) => {

        let ended = false;
        if(newChars.length < 9) {
            ended = true;
        }


        this.setState(({offset, chars}) => ({
            chars: [...chars, ...newChars],
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: ended,
        }))
    }
    onError = () => {
        this.setState({
            error: true,
            loading: false
        })
    }

    render () {
        const {chars, loading, error, offset, newItemLoading, charEnded} = this.state;
        const items = this.renderChars(chars);

        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? items : null;

        return (
            <div className="char__list">
                <ul className="char__grid">
                    {errorMessage}
                    {spinner}
                    {content}
                </ul>
                <button 
                    style={{'display' : charEnded ? 'none' : 'block'}}
                    className="button button__main button__long"
                    disabled={newItemLoading}
                    onClick={() => this.onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }

}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;