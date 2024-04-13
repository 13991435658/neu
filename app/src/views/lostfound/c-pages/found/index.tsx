import React, { ReactNode, memo, useEffect, useRef, useState } from "react";
import { MessageOutlined, SoundOutlined, RestOutlined } from '@ant-design/icons';
import { Avatar, List, Popconfirm, Select, message } from 'antd';
import styles from './found.module.scss'
import classnames from "classnames";
import { deletefound, getfound } from "../../server";
import { addConversation } from "@/views/communication/server";
import { useAppSelector } from "@/store";
import { useNavigate } from "react-router-dom";

interface IProps {
    children?: ReactNode
}
const Found: React.FC<IProps> = (props) => {
    const loginUser = useAppSelector(state => state.loginReducer.userInfo)
    const [allitems, setallitems] = useState<any[]>([])
    const [showitems, setshowitems] = useState<any[]>([])
    const containerRef = useRef<HTMLDivElement>(null)
    const containerHeight = 500
    const listItemHeight = 209
    const [totalHeight, setTotalHeight] = useState<number>(1500)
    const [startIndex, setstartIndex] = useState<number>(0)
    const [endIndex, setendIndex] = useState<number>(3)
    const navigate = useNavigate()
    useEffect(() => {
        getfound().then(res => {
            setallitems(res.data.founditems)
            // setshowitems(res.data.founditems)
        })

    }, [])
    useEffect(() => {
        const handleScroll = (e:any) => {
            const scrollTop = containerRef.current!.scrollTop
            const start = Math.floor(scrollTop / listItemHeight)
            const end = Math.min(start + Math.ceil(containerHeight / listItemHeight), allitems.length)
            setstartIndex(start)
            setendIndex(end)
        }
        if (containerRef.current) {
            containerRef.current.addEventListener('scroll', handleScroll)
        }
        setTotalHeight(allitems.length * listItemHeight)
    }, [allitems])
    // const handleChange = (value: string) => {
    //     if (value === '0') setshowitems(allitems.filter(item => item.type === 0))
    //     if (value === '1') setshowitems(allitems.filter(item => item.type === 1))
    //     if (value === '2') setshowitems(allitems.filter(item => item.userId === loginUser.id))
    //     if (value === '3') setshowitems(allitems)
    // };
    // const delitem = (itemid: number) => {
    //     deletefound(itemid).then(res => {
    //         res.data.ok ? message.success('删除成功') : message.error('服务器错误')
    //         setshowitems((prev) => prev.filter(item => item.lostfoundId !== itemid))
    //     })
    // }
    const contact = (userId: number) => {
        addConversation(loginUser.id, userId).then(
            res => {
                console.log(res.data)
                navigate(`/communication/conversations?friendId=${userId}`)
            }
        )
    }

    return (
        <div className={classnames(styles.foundBox, 'wrap-v3')}>
            <div className="fboxtop">
                <h2 className="losttitle">
                    失物招领 <SoundOutlined />
                </h2>
                {/* <div className="select">
                    <Select
                        defaultValue="全部"
                        style={{ width: 100 }}
                        onChange={handleChange}
                        options={[
                            { value: '0', label: '只看捡到' },
                            { value: '1', label: '只看丢失' },
                            { value: '2', label: '只看我的' },
                            { value: '3', label: '全部' },
                        ]}
                    />
                </div> */}
            </div>
            <div ref={containerRef} style={{ height: '700px', width: '900px', overflowY: 'auto'}}>
                <div style={{ height: `${totalHeight}px` }}>
                    <div style={{position:'absolute',top:80,left:50}}>
                    <List
                        itemLayout="vertical"
                        size="large"
                        dataSource={allitems.slice(startIndex,endIndex)}
                        renderItem={(item) => (
                            <List.Item
                                key={item.time}
                                extra={
                                    <img
                                        style={{ width: '200px', height: '170px', objectFit: 'contain' }}
                                        width={272}
                                        alt="logo"
                                        src={item.itemimg}
                                    />
                                }
                            >
                                <List.Item.Meta
                                    avatar={<Avatar src={item.avatarfile} />}
                                    title={'物品：' + item.itemname}
                                    description={item.usertime}
                                />
                                <div className="itemcontent">
                                    <div className="ictop">
                                        <div className="ictleft"><span>详细描述：</span>{item.detailInfo}</div>
                                        <div className={item.type ? 'lost ictright' : 'found ictright'}>{item.type ? '丢失物品' : '捡到物品'}</div>
                                    </div>
                                    <div className="iccenter"><span>物品位置：</span>{item.address}</div>
                                    <div className="icbottom">
                                        <div className="icbleft"><span>联系方式：</span>{item.contact}</div>
                                        {item.userId === loginUser.id ?
                                            <div className="icbright">
                                                {/* <Popconfirm
                                                    title="确认删除？"
                                                    onConfirm={() => delitem(item.lostfoundId)}
                                                    okText="Yes"
                                                    cancelText="No"
                                                >
                                                    <RestOutlined style={{ color: 'red' }} />
                                                </Popconfirm>  */}
                                                您的发布
                                            </div>
                                            : <div className="icbright" onClick={() => contact(item.userId)}><MessageOutlined /> 平台私聊</div>}
                                    </div>
                                </div>
                            </List.Item>
                        )}
                    />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default memo(Found)

