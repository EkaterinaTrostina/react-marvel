import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import useMarverService from '../../services/MarverService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

import './comicsList.scss';

const setContent = (process, Component, newItemLoading) => {
    switch (process) {
        case 'waiting':
            return <Spinner/>
            break;
        case 'loading': 
            return newItemLoading ? <Component/> : <Spinner/>
            break;
        case 'error': 
            return <ErrorMessage/>
            break;  
        case 'confirmed': 
            return <Component/>
            break;        
        default:
            throw new Error('unexpected process state');
            break;
    }
}

const ComicsList = (props) => {
    const [comicsList, setComicsList] = useState([]);
    const [offset, setOffset] = useState(0);
    const [newItemLoading, setNewItemLoading] = useState(null);
    const [comicsEnded, setComicsEnded] = useState(false);

    const {loading, error, getAllComics, process, setProcess} = useMarverService();

    useEffect(() => {
        onRequest(offset, true);
    }, []);

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true)

        getAllComics(offset)
            .then(onComicsLoaded)
            .then(() => setProcess('confirmed'))
    
    }

    const onComicsLoaded = (newComics) => {
        let ended = false;
        if(newComics.length < 8) {
            ended = true;
        }

        setComicsList(comicsList => [...comicsList, ...newComics]);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 8);
        setComicsEnded(comicsEnded => ended)
    }

    const renderComics = (arr) => {
        const comics = arr.map((item, i) => {
            return (
                <li 
                className="comics__item" 
                key={i} >
                    <Link to={`/comics/${item.id}`}>
                        <img src={item.thumbnail} alt={item.name} className="comics__item-img"/>
                        <div className="comics__item-name">{item.name}</div>
                        <div className="comics__item-price">{item.price}</div>
                    </Link>
                </li>
            )
        })
        return (
            <ul className="comics__grid">
                {comics}
            </ul>
        )

    }

    return (
        <div className="comics__list">
            {setContent(process, () => renderComics(comicsList), newItemLoading)}
            <button 
                style={{'display' : comicsEnded ? 'none' : 'block', 'animation': newItemLoading ? 'load 1.5s ease infinite' : ''}}
                disabled={(newItemLoading)}
                className="button button__main button__long"
                onClick={() => onRequest(offset)}
               >
                <div className="inner">load more</div>
            </button>
        </div>
    )
}
export default ComicsList;