import React, { memo } from "react";
import styles from './gdetailcard.module.scss'
import { categoryArr, detailAddressArr, newArr } from "@/assets/data/local-data";
import { EnvironmentOutlined,SoundFilled } from "@ant-design/icons";
import moment from "moment";
moment.locale('zh-cn')

interface IProps {
    goodsInfo: any
}

const Gdetailcard: React.FC<IProps> = (props) => {
    const { goodsInfo } = props
    return (
        <div className={styles.gdBox}>
            <div className="gdetailcardBox">
                <img className="gdcleft" src={goodsInfo.imgUrl} alt="图片丢了" />
                <div className="gdcright">
                    <div className="gdctitle">
                        <div className="titletext"><div className="titlenew">{newArr[goodsInfo.newdegree]}</div>{goodsInfo.title}</div>
                    </div>
                    <div className="gdcrow">
                        <span>价格：</span>
                        <div className="gdcprice">￥{goodsInfo.price.toFixed(2)}</div>
                    </div>
                    <div className="gdcrow">
                        <span>新旧程度： </span>
                        <div className="gdcnewdegree">{newArr[goodsInfo.newdegree]}</div>
                    </div>
                    <div className="gdcrow">
                        <span>所在校区：</span>
                        <div className="gdcaddress"><EnvironmentOutlined style={{ fontSize: '15px', color: '#1e80ff', width: '20px' }} />{detailAddressArr[goodsInfo.address]}</div>
                    </div>
                    <div className="gdcrow">
                        <span>物品类别：</span>
                        <div className="gdccategory">{categoryArr[goodsInfo.category]}</div>
                    </div>
                    <div className="gdcrow">
                        <span>发布时间：</span>
                        <div className="gdctime">{moment(goodsInfo.time).format('lll')}</div>
                    </div>
                </div>
            </div>
            <div className="gdcremarkBox">
                <span>卖家备注 <SoundFilled />：</span>{goodsInfo.remark}
            </div>
        </div>
    )
}

export default memo(Gdetailcard)


