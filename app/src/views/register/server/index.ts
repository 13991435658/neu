import neuRequest from "@/utils/request"

export const register = (useinfo:any)=>{
    return neuRequest.post('/api/register',useinfo,{
        headers:{
            'Content-Type': 'multipart/form-data'
        },
        onUploadProgress:(ev)=>{
            let rate = (ev.loaded)/(ev.total as number)
            console.log(`已完成${rate}`)
        }
    })
}