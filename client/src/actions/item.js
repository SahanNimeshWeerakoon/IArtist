import axios from 'axios';
import {setAlert} from './alert';
import {GET_ITEMS, POST_ERROR, DELETE_ITEM, ADD_ITEM, GET_ITEM} from './types';

//get items
export const getPosts=()=> async dispatch=>{
    try {
        const res = await axios.get('/api/items');

        dispatch({
            type: GET_ITEMS,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
}

//Remove Post
export const deleteItem=id=> async dispatch=>{
    try {
        await axios.delete(`/api/items/${id}`);

        dispatch({
            type: DELETE_ITEM,
            payload: id
        })
        dispatch(setAlert('Post Revoved', 'success'));
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
}

//Add Post
export const addItem = formData=> async dispatch=>{
    const config={
        headers: {
            'Content-Type': 'application/json'
        }
    }
    try {
        const res = await axios.post(`/api/items`, formData, config);

        dispatch({
            type: ADD_ITEM,
            payload: res.data
        })
        dispatch(setAlert('Item Created', 'success'));
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
}

//get post
export const getItem = id => async dispatch=>{
    try {
        const res = await axios.get(`/api/posts/${id}`);

        dispatch({
            type: GET_ITEM,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
}