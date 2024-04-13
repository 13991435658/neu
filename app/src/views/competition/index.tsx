import { competitionNav } from "@/assets/data/local-data";
import SecondNav from "@/components/secondNav";
import React, { ReactNode, memo } from "react";
import { Outlet } from "react-router-dom";

interface IProps {
    children?: ReactNode
}

const Competition: React.FC<IProps> = (props) => {
    return (
        <div>
            <SecondNav navdata={competitionNav} />
            <Outlet />
        </div>
    )
}

export default memo(Competition)

