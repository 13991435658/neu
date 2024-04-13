import React, { ElementRef, memo, useEffect, useRef, useState } from 'react'
import styles from './css/searchUser.module.scss'
import { Input, AutoComplete, Avatar, Empty, Pagination, message, Dropdown } from 'antd'
import Search from 'antd/es/input/Search'
import { useAppDispatch, useAppSelector } from '@/store'
import { AsyncGetallUser, AsyncGetfollowInfo } from './store'
import { shallowEqual } from 'react-redux'
import { occupationArr } from '@/assets/data/local-data'
import { ManOutlined, WomanOutlined, UserDeleteOutlined, MailOutlined, CaretDownOutlined, UserAddOutlined } from '@ant-design/icons'
import { followUser, getRecommendUser, unfollowUser } from './server'
import { useNavigate } from 'react-router-dom'
import type { MenuProps } from 'antd';
import { relationship } from '@/utils/fc'

interface IProps { }

const SearchUser: React.FC<IProps> = (props) => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const searchRef = useRef<ElementRef<typeof Search>>(null)
    const loginUser = useAppSelector(state => state.loginReducer.userInfo, shallowEqual)
    const myfollowArr = useAppSelector(state => state.searchUserReducer.myfollowArr, shallowEqual)
    const followmeArr = useAppSelector(state => state.searchUserReducer.followmeArr, shallowEqual)
    const allUser = useAppSelector(state => state.searchUserReducer.allUser, shallowEqual)
    const userValue = allUser.map(item => ({ value: item.username }))
    const [searchRes, setsearchRes] = useState<any[]>([''])    //数组里给了个''是因为分页器初始化默认值设为1的时候，由于没有值，默认0
    const [loading, setloading] = useState<boolean>(false)
    const [options, setoptions] = useState<any[]>([])
    const [result, setresult] = useState<any[]>([])
    const [randomUser, setrandomUser] = useState<any[]>([])
    const [isRecommend, setisRecommend] = useState<boolean>(true)
    const [handleId, sethandleId] = useState<number>(0)
    const followedItems: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <div onClick={() => navigate('/center')}>
                    <MailOutlined /><span style={{ marginLeft: '6px' }}>私信</span>
                </div>
            ),
        },
        {
            key: '2',
            label: (
                <div onClick={() => unfollow()}>
                    <UserDeleteOutlined /><span style={{ marginLeft: '6px' }}>取消关注</span>
                </div>
            ),
        },
    ];
    const fansItems: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <div onClick={() => navigate('/center')}>
                    <MailOutlined /><span style={{ marginLeft: '6px' }}>私信</span>
                </div>
            ),
        },
        {
            key: '2',
            label: (
                <div onClick={() => follow(handleId)}>
                    <UserAddOutlined /><span style={{ marginLeft: '6px' }}>回关</span>
                </div>
            ),
        },
    ];
    const friendItems: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <div onClick={() => navigate('/center')}>
                    <MailOutlined /><span style={{ marginLeft: '6px' }}>私信</span>
                </div>
            ),
        },
        {
            key: '2',
            label: (
                <div onClick={() => unfollow()}>
                    <UserAddOutlined /><span style={{ marginLeft: '6px' }}>取消关注</span>
                </div>
            ),
        },
    ];
    const unfollow = async () => {
        const res = await unfollowUser(loginUser.id, handleId)
        res.data.ok && message.success('取关成功')
        dispatch(AsyncGetfollowInfo(loginUser.id))
    }
    const randomRecommend = () => {
        randomUser.sort(() => Math.random() > 0.5 ? -1 : 1)
        setresult(randomUser.slice(0, 9))
        setsearchRes([])
    }
    const pageChange = (page: number) => {
        setresult(searchRes.slice(9 * (page - 1), 9 * page))
    }
    const onChange = (value: string) => {
        value ? setoptions(userValue.filter(item => item.value.includes(value))) : setoptions([])
    }
    const goCenter = () => {
        navigate('/center')
    }
    const follow = async (id: number) => {
        const followInfo = {
            followId: loginUser.id,
            isfollowedId: id
        }
        const res = await followUser(followInfo)
        res.data.ok && message.success('关注成功')
        dispatch(AsyncGetfollowInfo(loginUser.id))
    }
    const onSearch = (value: string) => {
        if (value) {
            setoptions([])
            setisRecommend(false)
            setloading(true)
            setTimeout(() => {
                setresult(allUser.filter(item => item.username.includes(value)).slice(0, 9))
                setsearchRes(allUser.filter(item => item.username.includes(value)))
                setloading(false)
            }, 300);
        }
    }
    useEffect(() => {
        getRecommendUser(loginUser.id).then(
            res => {
                setresult(res.data.recommendUser.slice(0, 9))
                setrandomUser(res.data.recommendUser)
            }
        )
        dispatch(AsyncGetallUser(loginUser.id))
        dispatch(AsyncGetfollowInfo(loginUser.id))
    }, [])
    return (
        <div className={styles.searchUserBox}>
            <div className='content wrap-v3'>
                <div className='searchbox'>
                    <AutoComplete
                        className='searchInput'
                        popupMatchSelectWidth={450}
                        options={options}
                        // filterOption={(inputValue, option) =>option!.value.indexOf(inputValue)!==-1}
                        onChange={onChange}
                    >
                        <Input.Search size="large" loading={loading} ref={searchRef} placeholder="input search text" onSearch={onSearch} enterButton />
                    </AutoComplete>
                </div>
                {isRecommend ? <div onClick={randomRecommend} className='reText'>为您推荐(可摇)</div> : <div onClick={randomRecommend} className='reText'>摇一摇😄</div>}
                <div className='result'>
                    {result.length ? result.map(item => {
                        return (
                            <div className='usercard' key={item.id}>
                                <Avatar onClick={goCenter} style={{ cursor: 'pointer' }} size={70} src={<img src={item.avatarfile} alt="头像" />} />
                                <div className='cardright'>
                                    <div className='username' onClick={goCenter}>{item.username}</div>
                                    <div className='occupation'>
                                        <div>{item.sex ? <WomanOutlined style={{ color: '#ff1493', fontSize: '14px' }} /> : <ManOutlined style={{ color: '#1e80ff', fontSize: '14px' }} />}</div>
                                        <div style={{ marginLeft: '5px' }}>{occupationArr[item.occupation]}</div>
                                    </div>
                                    {
                                        relationship(item.id, myfollowArr, followmeArr) === 1 ?
                                            <Dropdown menu={{ items: followedItems }} overlayStyle={{ border: '1px solid #ccc', borderRadius: '10px' }} trigger={['click']} placement="bottom" arrow>
                                                <div className='ship followed' onClick={() => sethandleId(item.id)}>✔ 已关注 <CaretDownOutlined /></div>
                                            </Dropdown>
                                            :
                                            relationship(item.id, myfollowArr, followmeArr) === -1 ?
                                                <Dropdown menu={{ items: fansItems }} overlayStyle={{ border: '1px solid #ccc', borderRadius: '10px' }} trigger={['click']} placement="bottom" arrow>
                                                    <div className='ship fans' onClick={() => sethandleId(item.id)}>🧔🏻你的粉丝<CaretDownOutlined /></div>
                                                </Dropdown> :
                                                relationship(item.id, myfollowArr, followmeArr) === 0 ?
                                                    <div className='ship follow' onClick={() => follow(item.id)}>✚ 关注</div> :
                                                    <Dropdown menu={{ items: friendItems }} overlayStyle={{ border: '1px solid #ccc', borderRadius: '10px' }} trigger={['click']} placement="bottom" arrow>
                                                        <div className='ship friend' onClick={() => sethandleId(item.id)}>⇋ 互相关注<CaretDownOutlined /></div>
                                                    </Dropdown>
                                    }
                                </div>
                            </div>
                        )
                    }) : <div style={{ margin: '70px auto' }}><Empty /></div>}
                </div>
                <div className='pagination'><Pagination simple hideOnSinglePage={true} onChange={pageChange} defaultCurrent={1} total={searchRes.length} defaultPageSize={9} /></div>
            </div>
        </div>
    )
}

export default memo(SearchUser)