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

export const GetJobDetail = async (req, res) => {
  const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
  const page = Math.max(Number(req.query.page) || 1, 1);
  const offset = (page - 1) * limit;

  try {
    // 1. Get total jobs count
    const [[countResult]] = await db.query(
      `SELECT COUNT(*) AS total
       FROM jobs
       WHERE deleted = ?`,
      [false],
    );

    const totalJobs = countResult.total;

    // 2. Get paginated jobs
    const [JobData] = await db.query(
      `SELECT
        JD.id AS jobdataid,
        JD.job_title AS title,
        JD.organization_name AS organization,
        JD.location,
        JD.status,
        JD.application_fee AS applicationfee,
        JD.contact_email AS contactemail,
        JD.description,
        JD.instructions,
        JT.name AS jobtype,
        JT.id AS jobtypeId
      FROM jobs JD
      LEFT JOIN jobtype JT ON JD.jobtype_id = JT.id
      WHERE JD.deleted = ?
      ORDER BY JD.id DESC
      LIMIT ? OFFSET ?`,
      [false, limit, offset],
    );

    // 3. If no jobs found
    if (JobData.length === 0) {
      return res.status(200).json({
        success: true,
        jobs: [],
        pagination: {
          totalJobs,
          totalPages: Math.ceil(totalJobs / limit),
          currentPage: page,
          limit,
          hasNextPage: false,
          hasPrevPage: page > 1,
        },
      });
    }

    // 4. Get all job IDs
    const jobIds = JobData.map((job) => job.jobdataid);

    // 5. Fetch all important dates
    const [jobDate] = await db.query(
      `SELECT
        JD.job_id AS jobid,
        JD.id AS dateid,
        JD.date_title AS title,
        DATE_FORMAT(JD.date_value, '%d-%m-%Y') AS date
      FROM job_dates JD
      WHERE JD.job_id IN (?)`,
      [jobIds],
    );

    // 6. Fetch all official links
    const [jobLink] = await db.query(
      `SELECT
        JL.job_id AS jobid,
        JL.id AS linkid,
        JL.link_title AS title,
        JL.link_url AS url
      FROM job_links JL
      WHERE JL.job_id IN (?)`,
      [jobIds],
    );

    // 7. Fetch all vacancies/posts
    const [jobVacancies] = await db.query(
      `SELECT
        JV.job_id AS jobid,
        JV.id AS vacancieid,
        JV.post_name AS postname,
        JV.total_vacancies AS vacancies,
        JV.eligibility,
        JV.age_limit AS age,
        JV.salary,
        JV.category
      FROM job_vacancies JV
      WHERE JV.job_id IN (?)`,
      [jobIds],
    );

    // 8. Format each job with its related details
    const formattedJobs = JobData.map((job) => {
      const currentJobId = job.jobdataid;

      return {
        maindata: job,

        importantDates: jobDate
          .filter((date) => date.jobid === currentJobId)
          .map(({ jobid, ...date }) => date),

        posts: jobVacancies
          .filter((post) => post.jobid === currentJobId)
          .map(({ jobid, ...post }) => post),

        officialLinks: jobLink
          .filter((link) => link.jobid === currentJobId)
          .map(({ jobid, ...link }) => link),
      };
    });

    // 9. Final response
    return res.status(200).json({
      success: true,
      jobs: formattedJobs,
      pagination: {
        totalJobs,
        totalPages: Math.ceil(totalJobs / limit),
        currentPage: page,
        limit,
        hasNextPage: page < Math.ceil(totalJobs / limit),
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.log("GetJobDetailbyId Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


export const GetSerchJobDetail = async (req, res) => {
  try {
    const limit = Math.min(
      Math.max(Number(req.query.limit) || 20, 1),
      30
    );

    const page = Math.max(Number(req.query.page) || 1, 1);
    const offset = (page - 1) * limit;

    const searchtext = (req.query.searchtext || "").trim();
    const searchlocation = (req.query.searchlocation || "").trim();

    const locationSearch = `%${searchlocation}%`;
    const textSearch = `%${searchtext}%`;

    // 1. Get total searched jobs count
    const [[countResult]] = await db.query(
      `SELECT COUNT(*) AS total
       FROM jobs JD
       LEFT JOIN jobtype JT ON JD.jobtype_id = JT.id
       WHERE
         JD.deleted = ?
         AND JD.status = ?
         AND (? = '' OR JD.location LIKE ?)
         AND (
           ? = ''
           OR JD.organization_name LIKE ?
           OR JD.job_title LIKE ?
           OR JT.name LIKE ?
         )`,
      [
        false,
        "Published",
        searchlocation,
        locationSearch,
        searchtext,
        textSearch,
        textSearch,
        textSearch,
      ]
    );

    const totalJobs = countResult.total;
    const totalPages = Math.ceil(totalJobs / limit);

    // 2. Get paginated searched jobs
    const [JobData] = await db.query(
      `SELECT
        JD.id AS jobdataid,
        JD.job_title AS title,
        JD.organization_name AS organization,
        JD.location,
        JD.status,
        JD.application_fee AS applicationfee,
        JD.contact_email AS contactemail,
        JD.description,
        JD.instructions,
        JT.name AS jobtype,
        JT.id AS jobtypeId
      FROM jobs JD
      LEFT JOIN jobtype JT ON JD.jobtype_id = JT.id
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
        locationSearch,
        searchtext,
        textSearch,
        textSearch,
        textSearch,
        limit,
        offset,
      ]
    );

    // 3. If no jobs found
    if (JobData.length === 0) {
      return res.status(200).json({
        success: true,
        jobs: [],
        pagination: {
          totalJobs,
          totalPages,
          currentPage: page,
          limit,
          hasNextPage: false,
          hasPrevPage: page > 1 && page <= totalPages,
        },
      });
    }

    // 4. Get all job IDs
    const jobIds = JobData.map((job) => job.jobdataid);

    // 5. Fetch all important dates
    const [jobDate] = await db.query(
      `SELECT
        JD.job_id AS jobid,
        JD.id AS dateid,
        JD.date_title AS title,
        DATE_FORMAT(JD.date_value, '%d-%m-%Y') AS date
      FROM job_dates JD
      WHERE JD.job_id IN (?)`,
      [jobIds]
    );

    // 6. Fetch all official links
    const [jobLink] = await db.query(
      `SELECT
        JL.job_id AS jobid,
        JL.id AS linkid,
        JL.link_title AS title,
        JL.link_url AS url
      FROM job_links JL
      WHERE JL.job_id IN (?)`,
      [jobIds]
    );

    // 7. Fetch all vacancies/posts
    const [jobVacancies] = await db.query(
      `SELECT
        JV.job_id AS jobid,
        JV.id AS vacancieid,
        JV.post_name AS postname,
        JV.total_vacancies AS vacancies,
        JV.eligibility,
        JV.age_limit AS age,
        JV.salary,
        JV.category
      FROM job_vacancies JV
      WHERE JV.job_id IN (?)`,
      [jobIds]
    );

    // 8. Format each job with related details
    const formattedJobs = JobData.map((job) => {
      const currentJobId = job.jobdataid;

      return {
        maindata: job,

        importantDates: jobDate
          .filter((date) => date.jobid === currentJobId)
          .map(({ jobid, ...date }) => date),

        posts: jobVacancies
          .filter((post) => post.jobid === currentJobId)
          .map(({ jobid, ...post }) => post),

        officialLinks: jobLink
          .filter((link) => link.jobid === currentJobId)
          .map(({ jobid, ...link }) => link),
      };
    });

    // 9. Final response
    return res.status(200).json({
      success: true,
      jobs: formattedJobs,
      pagination: {
        totalJobs,
        totalPages,
        currentPage: page,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });

  } catch (error) {
    console.log("GetSerchJobDetail Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

