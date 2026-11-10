import { Router } from "express";
import { AddJob, DeleteJob, EditJob, GetJobType, GetMyJobDetail, GetMyJobs } from "../Controller/Job.controller.js";
import { Cheaklogin } from "../Middleware/authMiddleware.js";

const route = Router()

route.get("/jobtype",Cheaklogin,GetJobType)
route.post("/add-job",Cheaklogin,AddJob)
route.get("/my-job",Cheaklogin,GetMyJobs)
route.get("/my-jobdetail",Cheaklogin,GetMyJobDetail)
route.put("/edit-job/:jobid",Cheaklogin,EditJob)
route.delete("/delete-job/:jobid",Cheaklogin,DeleteJob)

export default route