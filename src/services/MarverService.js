import { useHttp } from "../hooks/http.hook";

const useMarverService = () => {

    const { request, clearError, process, setProcess} = useHttp();

    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=2e160b7931b95087d4ca2a9b78916d11';
    const _baseOffset = 210;

    const getAllCharacters = async (offset = _baseOffset) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformCharacter);
    }
    const getCurrentCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`)
        return _transformCharacter(res.data.results[0]);
    }

    const getCharacterByName = async (name) => {
        const res = await request(`${_apiBase}characters?name=${name}&${_apiKey}`);
        return res.data.results.map(_transformCharacter);
    }

    const getAllComics = async (offset) => {
        const res = await request(`${_apiBase}comics?limit=8&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformComics);
    }

    const getCurrentComics = async(id) => {
        const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
        return _transformComics(res.data.results[0])
    }

    const _transformCharacter = (char) => {
        return {
            id: char.id,
            name: char.name,
            description: char.description,
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items
        }
    }

    const _transformComics = (comics) => {
        return {
            id: comics.id,
            name: comics.title,
            price: comics.prices[0].price === 0 ? 'NOT AVAILABLE' : `${comics.prices[0].price}$`,
            thumbnail: comics.thumbnail.path + '.' + comics.thumbnail.extension,
            description: comics.description === null ? 'description of none' : comics.description,
            pageCount: comics.pageCount === 0 ? 'Unknown count of' : comics.pageCount,
            language: comics.language ? comics.language : 'Unknown'
        }
    }

    return { process, 
            setProcess,
            getAllCharacters, 
            getCurrentCharacter, 
            getAllComics, 
            getCurrentComics, 
            getCharacterByName, 
            clearError};
}

export default useMarverService;
