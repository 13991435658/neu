import { topicNav } from '@/assets/data/local-data'
import SecondNav from '@/components/secondNav'
import React, { memo } from 'react'
import { Outlet } from 'react-router-dom'

interface IProps{

}
const Topic:React.FC<IProps> = (props)=>{
    return (
        <div>
            <SecondNav navdata={topicNav} />
            <Outlet/>
        </div>
    )
}

export default memo(Topic)