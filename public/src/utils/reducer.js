import { roleCases } from "./constants"

const initialState = {
    currentUserRole: "",
    currentUser: null
}

const reducer = (state, action) => {
    switch (action.type) {
        case roleCases.SET_USER:
        case roleCases.SET_ADMIN:
        case roleCases.SET_AFFILIATOR:
            return {
                ...state,
                currentUserRole: action.currentUserRole
            };
        case roleCases.SET_CURRENT_USER:
            return {
                ...state,
                currentUser: action.user
            }
        default:
            return state;
    }
}



export { initialState, reducer };