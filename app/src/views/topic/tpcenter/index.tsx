import React, { memo, useEffect, useRef, useState } from "react";
import { FireFilled, MessageFilled, LikeFilled, HeartFilled } from '@ant-design/icons';
import { Avatar, Divider, List, Select, message } from 'antd';
import styles from './tpcenter.module.scss'
import classNames from "classnames";
import { useAppSelector } from "@/store";
import { getallTopic, showfullText, updateSupport } from "../server";
import { debounce } from 'lodash'
import { useNavigate } from "react-router-dom";
import Usercard from "@/components/usercard";
interface IProps { }
const Topic: React.FC<IProps> = (props) => {
    const navigate = useNavigate()
    const loginUser = useAppSelector(state => state.loginReducer.userInfo)
    const [alltopics, setalltopics] = useState<any[]>([])
    const [topics, settopics] = useState<any[]>([])
    const [supportInfo, setsupportInfo] = useState<any>(null)
    const initsupportInfoRef = useRef(null)
    const [hotNum, sethotNum] = useState<any>(null)
    const [commentMap, setcommentMap] = useState<any>(null)
    const debounceSupport = debounce(() => {
        const diffres = diff(initsupportInfoRef.current, supportInfo)
        const postdata = {
            userId: loginUser.id,
            diffres
        }
        if (diffres.length) {
            updateSupport(postdata).then(res => console.log(res.data))
            initsupportInfoRef.current = supportInfo
        }
    }, 500)
    const changeSupport = (topicId: number) => {
        supportInfo[topicId][1] ? setsupportInfo({ ...supportInfo, [topicId]: [supportInfo[topicId][0] - 1, !supportInfo[topicId][1]] })
            : setsupportInfo({ ...supportInfo, [topicId]: [supportInfo[topicId][0] + 1, !supportInfo[topicId][1]] })
        supportInfo[topicId][1] ? message.success('已取消') : message.success('已赞同')
    }
    const diff = (obj1: any, obj2: any) => {
        const diffres: any[] = []
        if (obj2) {
            for (let key in obj1) {
                if (obj1[key][1] !== obj2[key][1]) {
                    diffres.push([key, obj2[key][1]])
                }
            }
        }
        return diffres
    }
    useEffect(() => {
        getallTopic(loginUser.id).then((res: any) => {
            setalltopics(res.data.allTopic)
            settopics(res.data.allTopic)
            setsupportInfo(res.data.supportInfo)
            sethotNum(res.data.hotNum)
            setcommentMap(res.data.commentMap)
            initsupportInfoRef.current = res.data.supportInfo
        })
    }, [])
    useEffect(() => {
        debounceSupport()
        return () => {
            debounceSupport.cancel()
        }
    }, [supportInfo])
    // useEffect(() => {
    //     supportInfoRef.current = supportInfo
    //     const diffres = diff(initsupportInfoRef.current, supportInfoRef.current)
    //     const postdata = {
    //         userId: loginUser.id,
    //         diffres
    //     }
    //     const fun = (event: any) => {
    //         event.preventDefault();
    //         updateSupport(postdata).then(res => console.log(5))
    //     }
    //     window.addEventListener('beforeunload', fun)
    //     return () => {
    //         window.removeEventListener('beforeunload', fun)
    //         diffres.length && updateSupport(postdata).then(res => console.log(res.data))
    //     }
    // }, [supportInfo, initsupportInfoRef.current])

    const handleChange = (value: string) => {
        if (value === '2') settopics(alltopics.filter(item => item.userId === loginUser.id))
        if (value === '3') settopics(alltopics)
    };
    const handlefullText = (topicId: number) => {
        showfullText(topicId).then((res: any) => {
            navigate(`/topic/tpdetail?topicId=${topicId}`)
        })
    }
    return (
        <div className={classNames(styles.tpcenterBox, 'wrap-v2')}>
            <div className='tpcontent'>
                <div className="tpboxtop">
                    <div className="select">
                        <Select
                            defaultValue="全部"
                            style={{ width: 100 }}
                            onChange={handleChange}
                            options={[
                                { value: '2', label: '只看我的' },
                                { value: '3', label: '全部' },
                            ]}
                        />
                    </div>
                </div>
                <List
                    itemLayout="vertical"
                    size="large"
                    pagination={{
                        onChange: (page) => {
                            console.log(page);
                        },
                        pageSize: 3,
                        align: 'center'
                    }}
                    dataSource={topics}
                    renderItem={(item) => (
                        <List.Item
                            key={item.topicId}
                        >
                            <div className="tpctitle">
                                <div className="t1">
                                    <div><Avatar src={item.avatarfile} /></div>
                                    <div onClick={() => navigate(`/topic/tpdetail?topicId=${item.topicId}`)}>{item.title}</div>
                                </div>
                                <div className="t2">{item.usertime}</div>
                            </div>
                            <div className="tpcenter">
                                <div className="tpdetail">
                                    {item.cover && <img className="img" src={item.cover} alt="" />}
                                    <div className="html" dangerouslySetInnerHTML={{ __html: item.detail }}></div>
                                </div>
                                <div className="tpbottom">
                                    <div className="tpoperation">
                                        <div><FireFilled /> 点击量 {hotNum[item.topicId]}<Divider type="vertical" /></div>
                                        <div><MessageFilled /> {commentMap[item.topicId] || 0}条评论<Divider type="vertical" /></div>
                                        <div className={supportInfo[item.topicId][1] ? 'support' : ''} onClick={() => changeSupport(item.topicId)} >
                                            <LikeFilled /> {supportInfo[item.topicId][1] ? '已赞同' : '赞同'}
                                            {supportInfo && supportInfo[item.topicId][0]}<Divider type="vertical" />
                                        </div>
                                        <div><HeartFilled /> 收藏</div>
                                    </div>
                                    <div className="tpmore" onClick={() => handlefullText(item.topicId)}>
                                        查看全文
                                    </div>
                                </div>
                            </div>
                        </List.Item>
                    )}
                />
            </div>
            <div className="tpctright">
                <div className='tpusercard'>
                    <Usercard own={true} btn1text="进入创作" btn1callback={() => navigate('/topic/tppublish')} panel1Num={alltopics.filter((topic) => topic.userId === loginUser.id).length} panel1text="话题" userId={loginUser.id} />
                </div>
                <div className='tprecommend'></div>
            </div>
        </div>
    )
}

export default memo(Topic)