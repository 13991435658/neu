import React, { memo, useEffect } from "react";
import { Button, Form, Input} from 'antd';
import { useDispatch, useSelector } from "react-redux";
import { AsyncGetuserInfo, changeUserData } from "./store";
import { useNavigate } from "react-router-dom";
import { RootState } from "@/store";
import neuRequest from "@/utils/request";

interface IProps { }

const Login: React.FC<IProps> = (props) => {
    const userInfo = useSelector((state:RootState)=>state.loginReducer.userInfo)
    const dispatch = useDispatch<any>()
    const navigate = useNavigate()
    const onFinish = (values: any) => {
        dispatch(AsyncGetuserInfo(values))
    };
    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };
    useEffect(()=>{
        const isSaveLogin = async () => {
            const accessToken = localStorage.getItem('accessToken')
            if (!accessToken) return 
            const res = await neuRequest.get(`/api/savelogin?accessToken=${accessToken}`)
            if (res.data.ok === 1) dispatch(changeUserData(res.data.userInfo))
        }
        isSaveLogin()
        Object.keys(userInfo).length && navigate('/market')
    },[userInfo])
    return (
        <div>
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    label="用户名"
                    name="username"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input placeholder="username" />
                </Form.Item>

                <Form.Item
                    label="密码"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password placeholder="password" />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        登录
                    </Button>
                </Form.Item>

            </Form>
        </div>
    )
}

export default memo(Login)

