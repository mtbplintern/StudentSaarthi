import { Router } from "express";
import { GetJobDetailbyId, GetJobs ,GetSerchJobs } from "../Controller/Webdata.controller.js";
 

const route = Router()

 
route.get("/jobs",GetJobs)
route.get("/serch-jobs",GetSerchJobs)

 route.get("/job-detail/:jobid",GetJobDetailbyId)
 

export default route