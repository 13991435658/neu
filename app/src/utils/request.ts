import axios from 'axios'
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { message } from 'antd'

const neuRequest: AxiosInstance = axios.create({
    baseURL: '',
    // timeout: 2000,
    // withCredentials: true            //如需要携带cookie 该值需设为true
})

neuRequest.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        let token = localStorage.getItem("accessToken")
        if (token) {
            config.headers['authorization'] = `Bearer ${token}`
        }
        return config
    },
    (err) => {
        return err
    }
)
async function refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
        throw new Error('缺少刷新令牌');
    }
    const res = await neuRequest.post('/api/refreshtoken', { refreshToken });
    const {newAccessToken,newRefreshToken} = res.data
    localStorage.setItem('accessToken', newAccessToken);
    localStorage.setItem('refreshToken', newRefreshToken);
    return newAccessToken;
}

neuRequest.interceptors.response.use(
    async (response: AxiosResponse) => {
        return response;
    },
    async (err) => {
        console.log(err)
        const response = err.response
        if (response.status !== 200) {
            if (response.status === 401 && !response.config.url.includes('refreshtoken')) {
                try {
                    const newAccessToken = await refreshToken();
                    const originalRequest = response.config;
                    originalRequest.headers['authorization'] = `Bearer ${newAccessToken}`;
                    return neuRequest(originalRequest);
                } catch (error) {
                    message.info("无法刷新令牌，您需要重新登录");
                }
            } else if (response.status === 500 || response.status === 505) {
                message.info("服务器错误");
            } else if (response.status === 404) {
                message.info("找不到请求地址");
            } else {
                message.info("请求错误");
            }
        }
        return err
    }
)

export default neuRequest