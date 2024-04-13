import React, { ReactNode, memo, useState } from "react";

interface IProps{
    children?:ReactNode
}

const Grecord:React.FC<IProps> = (props)=>{
    const [a,seta] = useState(1)
    const b = a+1
    return <>544</>
    // return (
    //      <List
    //                     itemLayout="vertical"
    //                     size="large"
    //                     dataSource={allitems.slice(startIndex,endIndex)}
    //                     renderItem={(item) => (
    //                         <List.Item
    //                             key={item.title}
    //                             extra={
    //                                 <img
    //                                     style={{ width: '200px', height: '170px', objectFit: 'contain' }}
    //                                     width={272}
    //                                     alt="logo"
    //                                     src={item.itemimg}
    //                                 />
    //                             }
    //                         >
    //                             <List.Item.Meta
    //                                 avatar={<Avatar src={item.avatarfile} />}
    //                                 title={'物品：' + item.itemname}
    //                                 description={item.usertime}
    //                             />
    //                             <div className="itemcontent">
    //                                 <div className="ictop">
    //                                     <div className="ictleft"><span>详细描述：</span>{item.detailInfo}</div>
    //                                     <div className={item.type ? 'lost ictright' : 'found ictright'}>{item.type ? '丢失物品' : '捡到物品'}</div>
    //                                 </div>
    //                                 <div className="iccenter"><span>物品位置：</span>{item.address}</div>
    //                                 <div className="icbottom">
    //                                     <div className="icbleft"><span>联系方式：</span>{item.contact}</div>
    //                                     {item.userId === loginUser.id ?
    //                                         <div className="icbright">
    //                                             {/* <Popconfirm
    //                                                 title="确认删除？"
    //                                                 onConfirm={() => delitem(item.lostfoundId)}
    //                                                 okText="Yes"
    //                                                 cancelText="No"
    //                                             >
    //                                                 <RestOutlined style={{ color: 'red' }} />
    //                                             </Popconfirm>  */}
    //                                             您的发布
    //                                         </div>
    //                                         : <div className="icbright" onClick={() => contact(item.userId)}><MessageOutlined /> 平台私聊</div>}
    //                                 </div>
    //                             </div>
    //                         </List.Item>
    //                     )}
    //                 />
    // )
}

export default memo(Grecord)


