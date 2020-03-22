import request from "@/api/index";

export const getAllBuildings = () => request.get('/api/building/findAll');
