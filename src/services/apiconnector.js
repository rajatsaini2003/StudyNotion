import axios from 'axios'

export const axiosInstance = axios.create({});

export const apiConnector =async(method,uri,bodyData,headers,params)=>{
    return axiosInstance({
        method: `${method}`,
        url: `${uri}`,
        data: bodyData ? bodyData : null,
        headers: headers ? headers : null,
        params: params ? params : null
    })
}