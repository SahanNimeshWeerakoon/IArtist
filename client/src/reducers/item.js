import{
    GET_ITEMS,
    ITEM_ERROR,
    DELETE_ITEM, 
    ADD_ITEM, 
    GET_ITEM
} from '../actions/types';

const initialState={
    items: [],
    item: null,
    loading: true,
    error: {}
}

export default function(state= initialState, action){
    const {type, payload}= action;
    switch(type){
        case GET_ITEMS:
            return {
                ...state,
                items: payload,
                loading: false
            }
        case GET_ITEM: 
            return {
                ...state,
                item: payload,
                loading: false
            }
        case ADD_ITEM:
             return{
                 ...state,
                 items: [payload,...state.items],
                 loading: false
             }
        case DELETE_ITEM:
            return {
                ...state,
                items: state.items.filter(item=> item._id!==payload),
                loading: false
            }
        case ITEM_ERROR:
            return {
                ...state,
                error: payload,
                loading: false
            }
        default:
            return state;

    }
}
