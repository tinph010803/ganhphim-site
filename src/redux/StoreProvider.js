"use client"

import {Provider} from "react-redux";
import {store} from "@/redux/store";
import {useAppDispatch} from "@/hooks/redux";
import {useEffect} from "react";
import {socketActions} from '@/redux/middlewares/socketMiddleware';

const InitSocketOnce = () => {
    // const dispatch = useAppDispatch()
    // useEffect(() => {
    //     dispatch({type: socketActions.init});
    // }, [dispatch])
    return null
}

const StoreProvider = ({children}) => {
    return <Provider store={store}>
        <InitSocketOnce/>
        {children}
    </Provider>
}

export default StoreProvider