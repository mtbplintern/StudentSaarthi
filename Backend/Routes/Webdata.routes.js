import { Router } from "express";
import { GetJobDetail, GetJobDetailbyId, GetJobs ,GetSerchJobDetail,GetSerchJobs } from "../Controller/Webdata.controller.js";
 

const route = Router()

 
route.get("/jobs",GetJobs)
route.get("/jobdetail",GetJobDetail)
route.get("/serch-jobs",GetSerchJobs)
route.get("/serch-jobsdetail",GetSerchJobDetail)

 route.get("/job-detail/:jobid",GetJobDetailbyId)
 

export default route