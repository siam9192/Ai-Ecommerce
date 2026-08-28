"use client"
import { useState } from 'react'
import { FaRobot } from 'react-icons/fa'
import AiBox from '../sections/ai-box'

function AiButton() {
    const [isOpen,setIsOpen] = useState<boolean>(false)
  return (
    <div >
       {
        !isOpen ?
          <button onClick={()=>setIsOpen(true)} className='fixed  right-10 bottom-10 p-4 rounded-full bg-primary text-white hover:scale-90 duration-75 '>
            <FaRobot   size={40}/>
         </button>
         :
         <div>
            <AiBox/>
         </div>
       }

    </div>
  )
}

export default AiButton