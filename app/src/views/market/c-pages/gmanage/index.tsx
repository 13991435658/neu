import React, { ReactNode, memo, useEffect, useState } from "react";
import { flushSync } from "react-dom";

interface IProps{
    children?:ReactNode
}

const Gmanage:React.FC<IProps> = (props)=>{
    let [a,seta] = useState(0)
    let [b,setb] = useState(0)
    console.log(555)
    return (
        <div>
            <button onClick={()=>{
                seta(a+1)
                setb(b+1)
            }}>{a}</button>
        </div>
    )
}

export default memo(Gmanage)


