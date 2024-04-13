import React, { ReactNode, Suspense, memo } from "react";
import SecondNav from "@/components/secondNav";
import { Outlet } from "react-router-dom";
import { marketNavdata } from "@/assets/data/local-data";


interface IProps {
    children?: ReactNode
}

const Market: React.FC<IProps> = (props) => {
    
    return (
        <>
            <SecondNav navdata={marketNavdata} />
            <Suspense fallback="稍等一下......(●'◡'●)">
                <Outlet />
            </Suspense>
        </>
    )
}

export default memo(Market)


