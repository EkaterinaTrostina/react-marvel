import { useState, useEffect } from 'react';
import { useParams } from 'react-router';

import useMarverService from '../../services/MarverService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import AppBanner from "../appBanner/AppBanner";

const SingleItemPage = ({Component, dataType}) => {
    const [item, setItem] = useState(null);

    const {id} = useParams();

    const {getCurrentComics, getCurrentCharacter, loading, error, clearError} = useMarverService();

    const onItemLoaded = (item) => {
        setItem(item)
    }

    useEffect(() => {
        updataItem()
    }, [id])

    const updataItem = () => {
        clearError();

        switch (dataType) {
            case 'comic':
                getCurrentComics(id).then(onItemLoaded);
                break;
            case 'character':
                getCurrentCharacter(id).then(onItemLoaded);
        }
    }

    const errorMessage = error ? <ErrorMessage/> : null
    const spinner = loading ? <Spinner/> : null
    const content = !(loading || error || !item) ? <Component data ={item}/> : null

    return (
        <>
            <AppBanner/>
            {errorMessage}
            {spinner}
            {content}
        </>
        

    )
}

export default SingleItemPage;