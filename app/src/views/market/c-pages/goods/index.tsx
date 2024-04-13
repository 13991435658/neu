import React, { ReactNode, memo, useEffect, useState } from "react";
import styles from './goods.module.scss'
import NeuV1 from "../../c-cpns/neu-v1";
import GoodsCard from "../../c-cpns/goodsCard";
import { categoryArr } from "@/assets/data/local-data";
import { Pagination } from "antd";
import { useAppDispatch, useAppSelector } from "@/store";
import { useNavigate } from "react-router-dom";
import { AsyncGetAllgoods } from "../../store";
import { AsyncGetallUser } from "@/views/searchUser/store";

interface IProps {
    children?: ReactNode
}

const Goods: React.FC<IProps> = (props) => {
    const dispatch = useAppDispatch()
    const allgoods = useAppSelector(state => state.marketReducer.allgoods)
    const loginUser = useAppSelector(state=>state.loginReducer.userInfo)
    const navigate = useNavigate()
    const [showgoods, setshowgoods] = useState<any[]>([''])
    const [page, setpage] = useState<number>(1)
    const pageChange = (p: number) => {
        setpage(p)
        window.scrollTo(0, 0)
    }
    const getIndex = (index: number) => {
        index !== 6 ? setshowgoods(allgoods.filter(goods => goods.category === index)) : setshowgoods([...allgoods])
    }
    useEffect(() => {
        dispatch(AsyncGetAllgoods())
        dispatch(AsyncGetallUser(loginUser.id))
        // setshowgoods(allgoods)  //报错，某些库内部冻结了对象或者数组，把原数组地址传过去，下面对数组进行操作就会出现问题
    }, [])
    useEffect(()=>{
        setshowgoods([...allgoods])
    },[allgoods])
    return (
        <div className={styles.goodsBox}>
            <div className="content wrap-v3">
                <div className="neuv1">
                    <NeuV1 title="全部商品" keywords={categoryArr} moretext="发布" moreLink="http://localhost:3000/#/market/gpublish" getIndex={getIndex} />
                </div>
                <div className="goodscards">
                    {
                        showgoods[0] && showgoods.slice(12 * (page - 1), 12 * page).map(
                            goods => <div className="gcard" onClick={() => navigate(`/market/gdetail?goodsInfo=${JSON.stringify(goods)}`)} key={goods.goodsId}>
                                <GoodsCard {...goods} />
                            </div>
                        )
                    }
                </div>
                <div className='pagination'><Pagination showSizeChanger={false} hideOnSinglePage={true} onChange={pageChange} defaultCurrent={1} total={showgoods.length} defaultPageSize={12} /></div>
            </div>
        </div>
    )
}

export default memo(Goods)


