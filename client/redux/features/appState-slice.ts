import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface AppStateSlice {
      isAiOpen:boolean
}


const initialState:AppStateSlice = {
 isAiOpen:false
} 



export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    setAiOpen:(state,action:PayloadAction<boolean>)=>{
      state.isAiOpen =  action.payload
    }
  }
})



// Action creators are generated for each case reducer function
export const {setAiOpen} = counterSlice.actions

export default counterSlice.reducer