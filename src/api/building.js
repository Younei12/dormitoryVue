import request from "@/api/index";
// axios的request方法调用接口
export const getAllBuildings = () => request.get('/api/building/findAll');
