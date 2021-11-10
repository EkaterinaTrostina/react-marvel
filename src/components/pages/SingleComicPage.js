import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';

import './singleComicPage.scss';

import useMarverService from '../../services/MarverService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

const SingleComicPage = () => {
    const [comic, setComic] = useState(null);

    const {comicId} = useParams();

    const {getCurrentComics, loading, error, clearError} = useMarverService();

    const onComicsLoaded = (comic) => {
        setComic(comic)
    }

    useEffect(() => {
        updataComic()
    }, [comicId])

    const updataComic = () => {
        clearError();

        if(!comicId) {
            return;
        }
        getCurrentComics(comicId).then(onComicsLoaded)
    }

    const errorMessage = error ? <ErrorMessage/> : null
    const spinner = loading ? <Spinner/> : null
    const content = !(loading || error || !comic) ? <View comic ={comic}/> : null

    return (
        <div className="single-comic">
            {errorMessage}
            {spinner}
            {content}
        </div>
        

    )
}

const View = ({comic}) => {
    const {name, price, thumbnail, description, pageCount, language} = comic;

    return (
        <>
            <img src={thumbnail} alt={name} className="single-comic__img"/>
            <div className="single-comic__info">
                <h2 className="single-comic__name">{name}</h2>
                <p className="single-comic__descr">{description}</p>
                <p className="single-comic__descr">{`${pageCount} pages`}</p>
                <p className="single-comic__descr">Language: {language}</p>
                <div className="single-comic__price">{`${price}$`}</div>
            </div>
            <Link to="/comics" className="single-comic__back">Back to all</Link>
        </>
    )
}

export default SingleComicPage;