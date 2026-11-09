import db from "../Config/db.js";

export const GetJobs = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 20;
    const page = Number(req.query.page) || 1;
    const offset = (page - 1) * limit;

    const [JobData] = await db.query(
      `SELECT 
        JD.id AS jobdataid,
        JD.job_title,
        JD.organization_name,
        JD.location,
        JD.status,
        JD.application_fee,
        JT.name AS jobtype,
        JDT.last_date,
        JTV.total_vacancies

      FROM jobs JD

      LEFT JOIN jobtype JT 
        ON JD.jobtype_id = JT.id

      LEFT JOIN (
        SELECT job_id, SUM(total_vacancies) AS total_vacancies
        FROM job_vacancies
        GROUP BY job_id
      ) JTV ON JTV.job_id = JD.id

      LEFT JOIN (
        SELECT 
          job_id,
          DATE_FORMAT(MAX(date_value), '%d-%m-%Y') AS last_date
        FROM job_dates
        WHERE date_title = 'Application Last Date'
        GROUP BY job_id
      ) JDT ON JDT.job_id = JD.id

      WHERE JD.deleted = ? AND JD.status = ?

      ORDER BY JD.id DESC
      LIMIT ? OFFSET ?`,
      [false, "Published", limit, offset],
    );

    res.status(200).json({
      success: true,
      jobs: JobData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const GetSerchJobs = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 20;
    const page = Number(req.query.page) || 1;
    const offset = (page - 1) * limit;

    const { searchtext, searchlocation } = req.query;

    const [JobData] = await db.query(
      `SELECT 
        JD.id AS jobdataid,
        JD.job_title,
        JD.organization_name,
        JD.location,
        JD.status,
        JD.application_fee,
        JT.name AS jobtype,
        JDT.last_date,
        JTV.total_vacancies

      FROM jobs JD

      LEFT JOIN jobtype JT 
        ON JD.jobtype_id = JT.id

      LEFT JOIN (
        SELECT job_id, SUM(total_vacancies) AS total_vacancies
        FROM job_vacancies
        GROUP BY job_id
      ) JTV ON JTV.job_id = JD.id

      LEFT JOIN (
        SELECT 
          job_id,
          DATE_FORMAT(MAX(date_value), '%d-%m-%Y') AS last_date
        FROM job_dates
        WHERE date_title = 'Application Last Date'
        GROUP BY job_id
      ) JDT ON JDT.job_id = JD.id

    WHERE 
    JD.deleted = ?
    AND JD.status = ?
    AND (? = '' OR JD.location LIKE ?)
    AND (
        ? = ''
        OR JD.organization_name LIKE ?
        OR JD.job_title LIKE ?
            OR JT.name LIKE ?

    )
    

      ORDER BY JD.id DESC
      LIMIT ? OFFSET ?`,
      [
        false,
        "Published",
        searchlocation,
        `%${searchlocation}%`,
        searchtext,
        `%${searchtext}%`,
        `%${searchtext}%`,
        `%${searchtext}%`,
        limit,
        offset,
      ],
    );

    res.status(200).json({
      success: true,
      jobs: JobData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const GetJobDetailbyId = async (req, res) => {
  const { jobid } = req.params;

  if (!jobid)
    return res.status(400).json({ success: false, message: "Job not found" });

  try {
    const [JobData] = await db.query(
      `SELECT 
      JD.id AS jobdataid,
      JD.job_title as title,
      JD.organization_name as organization,
      JD.location,
      JD.status,
      JD.application_fee as applicationfee,
      JD.contact_email as contactemail,
      JD.description as description,
      JD.instructions as instructions,
      JT.name AS jobtype    , 
      JT.id AS jobtypeId     
      FROM jobs JD
      LEFT JOIN jobtype JT   ON JD.jobtype_id = JT.id
      WHERE JD.id = ? and JD.deleted = ? `,
      [jobid, false],
    );

    if (JobData.length == 0)
      return res.status(400).json({ success: false, message: "Job not found" });

    const [jobDate] = await db.query(
      `SELECT 
      JD.id AS dateid,
      JD.date_title as title ,

       DATE_FORMAT(JD.date_value, '%d-%m-%Y')  as date
        
      FROM job_dates JD
    
      WHERE JD.job_id = ?`,
      [jobid],
    );
    const [jobLink] = await db.query(
      `SELECT 
      JL.id AS linkid,
      JL.link_title as title,
      JL.link_url as url
      FROM job_links JL 
      WHERE JL.job_id = ?`,
      [jobid],
    );
    const [jobVacancies] = await db.query(
      `SELECT 
      JV.id AS vacancieid,
      JV.post_name as postname,
      JV.total_vacancies as vacancies,
      JV.eligibility,
      JV.age_limit as age,
      JV.salary as salary,
      JV.category
      FROM job_vacancies JV 
      WHERE JV.job_id = ?`,
      [jobid],
    );

    const foramtjobdetail = {
      maindata: JobData[0],
      importantDates: jobDate,
      posts: jobVacancies,
      officialLinks: jobLink,
    };

    res.status(200).json({
      success: true,
      job: foramtjobdetail,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
