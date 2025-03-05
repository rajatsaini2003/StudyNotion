import {createSlice} from "@reduxjs/toolkit"

const initialState={
    user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
    loading:false
}

const profileSlice = createSlice({
    name:'profile',
    initialState:initialState,
    reducers:{
        setUser(state,value){
            state.user = value.payload;
        },
        updateProfilePicture: (state, value) => {
            if (state.user) {
                // Update only the image field
                state.user.image = value.payload; 
            }
        },
        setLoading(state,value){
            state.loading = value.payload;
        }
    },
});
export const {setUser,updateProfilePicture,setLoading} = profileSlice.actions;
export default profileSlice.reducer