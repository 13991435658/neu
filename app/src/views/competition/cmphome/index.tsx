import classNames from "classnames";
import React from "react";
import stys from './cmphome.module.scss'
import MyCarousel from "../c-cpns/myswiper";
const CmpHome = () => {
    return (
        <div className={classNames(stys.cmphomeBox, 'bgc-v1')}>
            <div className={stys.carousel}>
                <MyCarousel />
            </div>
        </div>
    )
}

export default CmpHome