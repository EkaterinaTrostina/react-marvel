import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Formik} from 'formik';
import useMarverService from '../../services/MarverService';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charSearchForm.scss'

const CustomForm = () => {
    const [char, setChar] = useState(null);
    const {getCharacterByName, clearError, process, setProcess} = useMarverService();

    const onCharLoaded = (char) => {
        setChar(char);
    }

    const updateChar = (name) => {
        clearError();

        getCharacterByName(name)
            .then(onCharLoaded)
            .then(() => setProcess('confirmed'));
    }

    const errorMessage = process == 'error' ? <div className="char__search-critical-error"><ErrorMessage/></div> : null;
    const result = !char ? null : char.length > 0 ? 
        <div className='charSearchForm__success-wrap'> 
            <div className="charSearchForm__success"> There is! Visit {char[0].name} page?</div> 
            <Link to={`/char/${char[0].id}`} className="button button__secondary">
                <div className="inner">TO PAGE</div>
            </Link> 
        </div> : 
        <div className="charSearchForm__error"> The character was not found. Check the name and try again</div> 

    return ( 
        <Formik 
            initialValues={{name: ''}}
            validate = {values => {
                const errors = {};

                if(!values.name) {
                    errors.name = 'This field is required'
                } 

                return errors;
            }}
            onSubmit = { ({name}) => {
                updateChar(name);
            }}
        >
        {({
            values,
            errors,
            touched,
            handleChange,
            handleSubmit
        }) => (
            <form onSubmit={handleSubmit}
                className="charSearchForm">
                <span className="charSearchForm__title">Or find a character by name:</span>
                <input
                    name='name' 
                    id='name'
                    placeholder="Enter name"
                    className="charSearchForm__input"
                    onChange={handleChange}
                    value={values.name}
                />
                <button 
                    type="submit"
                    className="button button__main"
                    disabled={process == 'loading'}>
                    <div className="inner">FIND</div>
                </button>
                {errors.name && touched.name ? <div className="charSearchForm__error"> {errors.name}</div> : null}
                {result}
                {errorMessage}
            </form>
        )}
        </Formik>
    )
}

export default CustomForm;