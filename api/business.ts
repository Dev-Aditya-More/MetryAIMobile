import { handleApiResponse } from "@/utils/apiResponse";
import api from "../constants/api";
import { getFromSecureStore } from "../utils/secureStorage";

export const BusinessService= {
    //1 get businesses for current user
    async getBusinesses(){
        try{
            const token = await getFromSecureStore("access_token");
            if(!token){
                throw new Error("Authentication token not found");
            }
            const response = await api.get("/api/biz/business/list",{
                headers:{Authorization: `Bearer ${token}`}
            })
            return handleApiResponse(response.data);
        }catch(err){
            throw err;
        }
    }
};