import { serviceHandler } from "@/utils/serviceHandler";
import api from "../../constants/api";
import { getFromSecureStore } from "../../utils/secureStorage";

export const BusinessService = {
  //1 get shop by id
  async getBusinesses() {
    return serviceHandler(async () => {
      const token = await getFromSecureStore("access_token");
      if (!token) throw new Error("Authentication token not found");

      const response = await api.get("/api/biz/customer/business/get?id=1", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    });
  },

  //2 get all shops 
  async getBusinessesDropDown(payload: { name: string | null; pageNo: number; pageSize: number } = { name: null, pageNo: 1, pageSize: 10 }) {
    return serviceHandler(async () => {
      const token = await getFromSecureStore("access_token");
      if (!token) throw new Error("Authentication token not found");

      const response = await api.post(
        "/api/biz/customer/business/page",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    });
  },
};


//  api 1 response that we get 

/*
{
    "code": "0",
    "msg": "Success",
    "data": {
        "merchantId": "7397110941072101376",
        "name": "test",
        "logoUrl":"urldata",
        "website": "https://example.com",
        "location": "北京市朝阳区xxx街道",
        "rooms": 5,
        "chairs": 50,
        "description": "这是一个商家描述",
        "businessHours": {
            "monday": [
                {
                    "startTime": "09:00 am",
                    "endTime": "12:00 pm"
                },
                {
                    "startTime": "06:00 pm",
                    "endTime": "10:00 pm"
                }
            ],
            "tuesday": [
                {
                    "startTime": "09:00 am",
                    "endTime": "12:00 pm"
                },
                {
                    "startTime": "06:00 pm",
                    "endTime": "10:00 pm"
                }
            ],
            "wednesday": [
                {
                    "startTime": "09:00 am",
                    "endTime": "12:00 pm"
                }
            ],
            "thursday": [
                {
                    "startTime": "09:00 am",
                    "endTime": "12:00 pm"
                }
            ],
            "friday": [
                {
                    "startTime": "09:00 am",
                    "endTime": "12:00 pm"
                }
            ],
            "saturday": [],
            "sunday": []
        },
        "id": "1",
        "deleted": false,
        "updateTime": 1765799380520,
        "createTime": null
    }
}
*/


//  api 2 response that we get 
/*

{
  "code": "0",
  "msg": "Success",
  "data": {
    "list": [
      {
        "id": "210ac425-af5e-4e36-9aff-1d063b80ca18",
        "name": "New salon",
        "logoUrl": "https://salon.com/logo.png",
        "website": "https://salon.com",
        "location": "Bangalore",
        "rooms": 5,
        "chairs": 10,
        "description": "new description",
        "businessHours": {
          "monday": [
            {
              "startTime": "09:00 am",
              "endTime": "12:00 pm"
            },
            {
              "startTime": "06:00 pm",
              "endTime": "10:00 pm"
            }
          ],
          "tuesday": [
            {
              "startTime": "09:00 am",
              "endTime": "12:00 pm"
            },
            {
              "startTime": "06:00 pm",
              "endTime": "10:00 pm"
            }
          ],
          "wednesday": [
            {
              "startTime": "09:00 am",
              "endTime": "12:00 pm"
            }
          ],
          "thursday": [
            {
              "startTime": "09:00 am",
              "endTime": "12:00 pm"
            }
          ],
          "friday": [
            {
              "startTime": "09:00 am",
              "endTime": "12:00 pm"
            }
          ],
          "saturday": [],
          "sunday": []
        }
      },
      {
        "id": "b2bac634-ff99-4174-aefa-f00b5f86ec3c",
        "name": "test02",
        "logoUrl": "https://test02.png",
        "website": "https://test02.com",
        "location": "Bengaluru",
        "rooms": 5,
        "chairs": 30,
        "description": "test02",
        "businessHours": {
          "monday": [
            {
              "startTime": "09:00 am",
              "endTime": "12:00 pm"
            },
            {
              "startTime": "06:00 pm",
              "endTime": "10:00 pm"
            }
          ],
          "tuesday": [
            {
              "startTime": "09:00 am",
              "endTime": "12:00 pm"
            },
            {
              "startTime": "06:00 pm",
              "endTime": "10:00 pm"
            }
          ],
          "wednesday": [
            {
              "startTime": "09:00 am",
              "endTime": "12:00 pm"
            }
          ],
          "thursday": [
            {
              "startTime": "09:00 am",
              "endTime": "12:00 pm"
            }
          ],
          "friday": [
            {
              "startTime": "09:00 am",
              "endTime": "12:00 pm"
            }
          ],
          "saturday": [],
          "sunday": []
        }
      }
    ],
    "total": 30
  }
}

*/