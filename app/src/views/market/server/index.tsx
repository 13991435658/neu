import neuRequest from "@/utils/request";

export const getGoods = ()=>{
    return neuRequest.get('/api/market/getgoods')
}
export const publishGoods = (publishInfo:any)=>{
    return neuRequest.post('/api/market/publishgoods',publishInfo,{
        headers:{
            'Content-Type': 'multipart/form-data'
        }
    })
}
export const getPublisherInfo = (userId:number)=>{
    return neuRequest.get(`/api/market/publisherinfo/${userId}`)
}