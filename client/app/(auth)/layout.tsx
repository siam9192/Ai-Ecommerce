import Footer from '@/components/sections/footer'
import Header from '@/components/shared/header'
import React, { ReactNode } from 'react'

interface Props {
    children:ReactNode
}
function layout({children}:Props) {
  return (
    <div>
        <Header/>
        {children}
        <Footer/>
    </div>
  )
}

export default layout