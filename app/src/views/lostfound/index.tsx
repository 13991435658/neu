import { LostfoundNav } from "@/assets/data/local-data";
import SecondNav from "@/components/secondNav";
import React, { memo } from "react";
import { Outlet } from "react-router-dom";

const Lostfound = ()=>{
    return (
        <div>
            <SecondNav navdata={LostfoundNav}/>
            <Outlet/>
        </div>
    )
}

export default memo(Lostfound)