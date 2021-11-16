import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import AppHeader from "../appHeader/AppHeader";
import Spinner from "../spinner/Spinner";
// import {MainPage, ComicsPage, SingleComicPage} from '../pages';

const Page404 = lazy(() => import('../pages/404'));
const MainPage = lazy(() => import('../pages/MainPage'));
const ComicsPage = lazy(() => import('../pages/ComicsPage'));
const SingleItemPage = lazy(() => import('../pages/SingleItemPage'));
const SingleComicLayout = lazy(() => import('../pages/singleComicLayout/SingleComicLayout'));
const SingleCharLayout = lazy(() => import('../pages/singleCharLayout/SingleCharLayout'));

const App = () => {

    return (
        <Router>
            <div className="app">
                <AppHeader/>
                <main>
                    <Suspense fallback={<Spinner/>}>
                        <Routes>
                            <Route path="/comics/" element={<ComicsPage/>} />
                            <Route exact path="/comics/:id" element={<SingleItemPage Component={SingleComicLayout} dataType='comic'/>}>
                            </Route>
                            <Route exact path="/char/:id" element={<SingleItemPage Component={SingleCharLayout} dataType='character'/>}>
                            </Route>

                            <Route path="/" element={<MainPage/>} />
                            <Route path="*" element={<Page404/>} />
                        </Routes>
                    </Suspense>
                </main>
            </div>
        </Router>
    )
}

export default App;

