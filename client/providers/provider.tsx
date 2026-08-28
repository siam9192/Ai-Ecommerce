"use client";
import AiButton from '@/components/ui/ai-button';
import { store } from '@/redux/store'
import React from 'react'
import { Provider as ReduxProvider } from 'react-redux'
interface Props {
    children:React.ReactNode
}
function Provider({children}:Props) {
  return (
    <div>
   <ReduxProvider store={store}>
      {
        children
     }
    <AiButton/>
   </ReduxProvider>
    </div>
  )
}

export default Provider