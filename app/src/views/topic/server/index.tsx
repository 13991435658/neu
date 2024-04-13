import neuRequest from "@/utils/request";

export const publishTopic = (data:any)=>neuRequest.post('/api/topic/publishtopic',data,{
    headers:{
        'Content-Type': 'multipart/form-data'
    }
})
export const getallTopic = (userId:number)=>neuRequest.get(`/api/topic/alltopic/${userId}`)
export const updateSupport = (data:any)=>neuRequest.post('/api/topic/updatesupport',data)
export const showfullText = (topicId:number)=>neuRequest.get(`/api/topic/addhot?topicId=${topicId}`)
export const getTopicDetail = (topicId:number)=>neuRequest.get(`/api/topic/gettopicdetail?topicId=${topicId}`)
export const publishComment = (data:any)=>neuRequest.post('/api/topic/publishcomment',data)
export const getTopicComment = (topicId:number)=>neuRequest.get(`api/topic/gettopiccomment?topicId=${topicId}`)
export const publishReply = (data:any)=>neuRequest.post('/api/topic/publishreply',data)
export const getCommentReply = (topicId:number)=>neuRequest.get(`/api/topic/getcommentreply?topicId=${topicId}`)
export const getTopicRank = ()=>neuRequest.get(`/api/topic/gettopicrank`)