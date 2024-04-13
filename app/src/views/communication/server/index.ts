import neuRequest from "@/utils/request";

export const addConversation = (currentId:number,targetId:number)=>{
    return neuRequest.get(`/api/addconversation?currentId=${currentId}&targetId=${targetId}`)
}

export const getConversations = (currentId:number)=>{
    return neuRequest.get(`/api/getconversations/${currentId}`)
}

export const getMessages = (conversationId:number)=>{
    return neuRequest.get(`/api/getmessages/${conversationId}`)
}

export const sendMessage = (sendMsgInfo:any)=>{
    return neuRequest.post('/api/sendmessage',sendMsgInfo)
}

export const lastMessage = (cvsidArr:number[],userId:number)=>{
    return neuRequest.post('/api/lastmessage',{cvsidArr,userId})
}

export const unreadAdd = (data:any)=>{
    return neuRequest.post('/api/addunread',data)
}

export const read = (data:any)=>{
    return neuRequest.post('/api/read',data)
}

export const getfileExistInfo = (data:any)=>neuRequest.post('http://127.0.0.1:9000/upload/fileexistinfo',data)
export const uploadChunk = (data:any)=>neuRequest.post('http://127.0.0.1:9000/upload/uploadchunk',data,{
    headers:{
        'Content-Type': 'multipart/form-data'
    }
})
export const mergeChunk = (data:any)=>neuRequest.post('http://127.0.0.1:9000/upload/mergechunk',data)
