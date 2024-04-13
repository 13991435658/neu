import React, { memo, useState } from "react";
import { Button, Form, Input, Radio, Select, Upload, message } from 'antd';
import type { RadioChangeEvent } from 'antd';
import { register } from "./server";
import { PlusOutlined } from '@ant-design/icons';
import type { UploadChangeParam } from 'antd/es/upload';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import styles from './css/register.module.scss'
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
    const navigate = useNavigate()
    const [imageUrl, setImageUrl] = useState<string>('');
    const [isSelect, setisSelect] = useState<Boolean>(false)
    const onFinish = (values: any) => {
        const formData = new FormData()
        for (let i in values) {
            formData.append(i, values[i])
        }
        formData.append('avatarfile', isSelect ? values.avatar.file : imageUrl)
        register(formData).then(res => {
            if (res.data.ok) {
                message.success('注册成功')
                navigate('/login')
            } else {
                message.warning('该用户已存在')
            }
        })
    };

    // const normFile = (e:any) => { //如果是typescript, 那么参数写成 e: any  //这段不用管 解决Upload在Form里导致的报错 不解决也不影响
    //     console.log('Upload event:', e);
    //     if (Array.isArray(e)) {
    //     return e;
    //     }
    //     return e && e.fileList;
    //     };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const avatarChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
        setisSelect(true)
        setImageUrl(URL.createObjectURL(info.file as any))
    };

    const randomAvatar = () => {
        const randomNum = Math.floor(Math.random() * 12 + 1)
        setisSelect(false)
        setImageUrl(`/avatar/${randomNum}.jpg`)
    }

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8, fontSize: '12px' }}>点击上传</div>
        </div>
    );
    const [sex, setSex] = useState<number>(0);
    const sexChange = (e: RadioChangeEvent) => {
        setSex(e.target.value);
    };
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

                <Form.Item
                    label="所属人群"
                    name="occupation"
                    initialValue={0}
                >
                    <Select
                        style={{ width: 120 }}
                        options={[
                            { value: 0, label: '教师' },
                            { value: 1, label: '本科生' },
                            { value: 2, label: '硕士生' },
                            { value: 3, label: '博士生' },
                            { value: 4, label: '学校员工', disabled: true },
                            { value: 5, label: '其他' },
                        ]}
                    />
                </Form.Item>


                <Form.Item
                    label="性别"
                    name="sex"
                    initialValue={0}
                >
                    <Radio.Group onChange={sexChange} value={sex}>
                        <Radio value={0}>男</Radio>
                        <Radio value={1}>女</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item
                    label="头像"
                    name="avatar"
                // valuePropName="fileList"     //这两行解决Upload在Form里的报错
                // getValueFromEvent={normFile}
                >
                    <Upload
                        name="avatar"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        action=""
                        beforeUpload={() => false}
                        onChange={avatarChange}
                    >
                        {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                    </Upload>
                </Form.Item>
                <button type='button' className={styles.btn} onClick={randomAvatar}>随机一张</button>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        submit
                    </Button>
                </Form.Item>

            </Form>
        </div>
    )
}

export default memo(Register)

