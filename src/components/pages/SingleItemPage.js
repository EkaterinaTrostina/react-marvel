import { useState, useEffect } from 'react';
import { useParams } from 'react-router';

import AppBanner from "../appBanner/AppBanner";

import useMarverService from '../../services/MarverService';
import setContent from '../../utils/setContent';


const SingleItemPage = ({Component, dataType}) => {
    const [item, setItem] = useState(null);

    const {id} = useParams();

    const {getCurrentComics, getCurrentCharacter, clearError, process, setProcess} = useMarverService();

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
                getCurrentComics(id).then(onItemLoaded).then(() => setProcess('confirmed'));
                break;
            case 'character':
                getCurrentCharacter(id).then(onItemLoaded).then(() => setProcess('confirmed'));
        }
    }

    return (
        <>
            <AppBanner/>
            {setContent(process, Component, item)}
        </>
        

    )
}

export default SingleItemPage;