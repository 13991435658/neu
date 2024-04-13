import neuRequest from "@/utils/request";

export const publishFounditem = (data:any)=> neuRequest.post<any>('/api/lostfound/founditem',data)
export const getfound = ()=>neuRequest.get('/api/lostfound/getfound')
export const deletefound = (lostfoundId:number)=>neuRequest.delete(`/api/lostfound/deleteitem?lostfoundId=${lostfoundId}`)