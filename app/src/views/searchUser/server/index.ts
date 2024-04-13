import neuRequest from "@/utils/request"

export const getAllUser = (userId:number)=>{
    return neuRequest.get(`/api/alluser?userId=${userId}`)
}
export const getRecommendUser = (userId:number)=>{
    return neuRequest.get(`/api/recommenduser?userId=${userId}`)
}

export const getfollowInfo = (id:number)=>{
    return neuRequest.post('/api/followinfo',{id})
}

export const followUser = (followInfo:any)=>{
    return neuRequest.post('/api/followuser',followInfo)
}

export const unfollowUser = (followId:number,isfollowedId:number)=>{
    return neuRequest.delete(`/api/unfollowuser?followId=${followId}&isfollowedId=${isfollowedId}`)
}


