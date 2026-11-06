import db from "../Config/db.js";

export const GetJobType = async (req, res) => {
  const { id, roleid } = req.user;

  if (!id)
    return res.status(401).json({ success: false, message: "Not verify" });
  if (roleid != 1)
    return res
      .status(401)
      .json({ success: false, message: "You are not Recruiter to add job" });

  try {
    let [JobType] = await db.query(`SELECT  *  FROM jobtype  `);

    res.status(200).json({
      success: true,
      JobType,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Server error",
    });
  }
};

export const AddJob = async (req, res) => {
  const userId = req.user?.id;
  const { jobdata } = req.body;
  const roleid = req.user?.roleid;

  // User validation
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "User not verified",
    });
  }
  if (roleid != 1)
    return res
      .status(401)
      .json({ success: false, message: "You are not Recruiter to add job" });

  // Job data validation
  if (!jobdata || !jobdata.maindata) {
    return res.status(400).json({
      success: false,
      message: "Job details missing",
    });
  }

  const {
    maindata,
    importantDates = [],
    posts = [],
    officialLinks = [],
  } = jobdata;

  if (!maindata.title) {
    return res.status(400).json({
      success: false,
      message: "job title missing",
    });
  }

  if (
    !Array.isArray(importantDates) ||
    !Array.isArray(posts) ||
    !Array.isArray(officialLinks)
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid job data format",
    });
  }

  let connection;

  try {
    // Get connection from pool
    connection = await db.getConnection();

    // Start transaction
    await connection.beginTransaction();

    // 1. Insert main job
    const [jobResult] = await connection.query(
      `INSERT INTO jobs (
        user_id,
        job_title,
        organization_name,
        location,
        application_fee,
        jobtype_id,
        description,
        instructions,
        contact_email,
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        maindata.title,
        maindata.organization || null,
        maindata.location || null,
        maindata.applicationfee || null,
        maindata.jobtypeId || null,
        maindata.description || null,
        maindata.instructions || null,
        maindata.contactemail || null,
        maindata.status,
        ,
      ],
    );

    const jobId = jobResult.insertId;

    if (!jobId) {
      throw new Error("Job insertion failed");
    }

    // 2. Insert important dates
    if (importantDates.length > 0) {
      const formatDates = importantDates.map((date) => [
        jobId,
        date.title,
        date.date || null,
      ]);

      await connection.query(
        `INSERT INTO job_dates (
          job_id,
          date_title,
          date_value
        ) VALUES ?`,
        [formatDates],
      );
    }

    // 3. Insert vacancies/posts
    if (posts.length > 0) {
      const formatPosts = posts.map((post) => [
        jobId,
        post.postname,
        post.vacancies || null,
        post.eligibility || null,
        post.age || null,
        post.salary || null,
        post.category || null,
      ]);

      await connection.query(
        `INSERT INTO job_vacancies (
          job_id,
          post_name,
          total_vacancies,
          eligibility,
          age_limit,
          salary,
          category
        ) VALUES ?`,
        [formatPosts],
      );
    }

    // 4. Insert official links
    if (officialLinks.length > 0) {
      const formatLinks = officialLinks.map((link) => [
        jobId,
        link.title || null,
        link.url || null,
      ]);

      await connection.query(
        `INSERT INTO job_links (
          job_id,
          link_title,
          link_url
        ) VALUES ?`,
        [formatLinks],
      );
    }

    // Commit transaction
    await connection.commit();

    return res.status(201).json({
      success: true,
      message: "Job added successfully",
      jobId,
    });
  } catch (error) {
    // Rollback if anything fails
    if (connection) {
      await connection.rollback();
    }

    console.error("AddJob Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while adding job",
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

export const GetMyJobs = async (req, res) => {
  const userid = req.user?.id;
  const roleid = req.user?.roleid;

  if (!userid)
    return res.status(400).json({ success: false, message: "Not verify" });

  if (roleid != 1)
    return res
      .status(400)
      .json({ success: false, message: "You are not Recruiter to add job" });

  try {
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
      SELECT 
          job_id,
SUm(total_vacancies) AS total_vacancies
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

   WHERE JD.user_id = ? and JD.deleted = ?`,
      [userid, false],
    );

    res.status(200).json({
      success: true,
      myjobs: JobData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const EditJob = async (req, res) => {
  const userId = req.user?.id;
  const { jobdata } = req.body;
   const roleid = req.user?.roleid;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "User not verified",
    });
  }
  if (roleid != 1)
    return res
      .status(401)
      .json({ success: false, message: "You are not Recruiter to add job" });

  if (!jobdata || !jobdata.maindata) {
    return res.status(400).json({
      success: false,
      message: "Job details missing",
    });
  }

  const {
    maindata,
    importantDates = [],
    posts = [],
    officialLinks = [],
  } = jobdata;

  if (!maindata.title || !maindata.jobdataid) {
    return res.status(400).json({
      success: false,
      message: "Job title or ID missing",
    });
  }

  if (
    !Array.isArray(importantDates) ||
    !Array.isArray(posts) ||
    !Array.isArray(officialLinks)
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid job data format",
    });
  }

  let connection;

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const jobId = maindata.jobdataid;

    // 1. Update Main Job
    const [jobResult] = await connection.query(
      `UPDATE jobs SET
        job_title = ?,
        organization_name = ?,
        location = ?,
        application_fee = ?,
        jobtype_id = ?,
        description = ?,
        instructions = ?,
        contact_email = ?,
        status = ?
       WHERE id = ? AND user_id = ? and deleted = ?`,
      [
        maindata.title,
        maindata.organization || null,
        maindata.location || null,
        maindata.applicationfee || null,
        maindata.jobtypeId || null,
        maindata.description || null,
        maindata.instructions || null,
        maindata.contactemail || null,
        maindata.status || null,
        jobId,
        userId,
        false,
      ],
    );

    // Check job ownership (affectedRows can be 0 if data is unchanged)
    const [jobCheck] = await connection.query(
      `SELECT id FROM jobs WHERE id = ? AND user_id = ?`,
      [jobId, userId],
    );

    if (jobCheck.length === 0) {
      throw new Error("Job not found or unauthorized");
    }

    // 2. Important Dates

    const existingDates = importantDates.filter((date) => date.dateid);
    const newDates = importantDates.filter((date) => !date.dateid);

    //   Update
    if (existingDates.length > 0) {
      for (const date of existingDates) {
        await connection.query(
          `UPDATE job_dates SET
      date_title = ?,
      date_value = ?
     WHERE id = ? AND job_id = ?`,
          [date.title, date.date || null, date.dateid, jobId],
        );
      }
    }

    // Bulk Delete
    const dateIds = existingDates.map((date) => date.dateid);

    if (dateIds.length > 0) {
      await connection.query(
        `DELETE FROM job_dates
         WHERE job_id = ? AND id NOT IN (?)`,
        [jobId, dateIds],
      );
    } else {
      await connection.query(`DELETE FROM job_dates WHERE job_id = ?`, [jobId]);
    }

    // Bulk Insert
    if (newDates.length > 0) {
      const formatDates = newDates.map((date) => [
        jobId,
        date.title,
        date.date || null,
      ]);

      await connection.query(
        `INSERT INTO job_dates (
          job_id, date_title, date_value
        ) VALUES ?`,
        [formatDates],
      );
    }

    // 3. Vacancies / Posts

    const existingPost = posts.filter((post) => post.vacancieid);
    const newPosts = posts.filter((post) => !post.vacancieid);

    // Update Existing Posts
    if (existingPost.length > 0) {
      for (const post of existingPost) {
        await connection.query(
          `UPDATE job_vacancies SET
        post_name = ?,
        total_vacancies = ?,
        eligibility = ?,
        age_limit = ?,
        salary = ?,
        category = ?
       WHERE id = ? AND job_id = ?`,
          [
            post.postname,
            post.vacancies || null,
            post.eligibility || null,
            post.age || null,
            post.salary || null,
            post.category || null,
            post.vacancieid,
            jobId,
          ],
        );
      }
    }

     // Bulk Delete
    const postIds = existingPost.map((post) => post.vacancieid);

    if (postIds.length > 0) {
      await connection.query(
        `DELETE FROM job_vacancies
         WHERE job_id = ? AND id NOT IN (?)`,
        [jobId, postIds],
      );
    } else {
      await connection.query(`DELETE FROM job_vacancies WHERE job_id = ?`, [
        jobId,
      ]);
    }

    // Bulk Insert

    if (newPosts.length > 0) {
      const formatPosts = newPosts.map((post) => [
        jobId,
        post.postname,
        post.vacancies || null,
        post.eligibility || null,
        post.age || null,
        post.salary || null,
        post.category || null,
      ]);

      const insert = await connection.query(
        `INSERT INTO job_vacancies (
          job_id, post_name, total_vacancies,
          eligibility, age_limit, salary, category
        ) VALUES ?`,
        [formatPosts],
      );
    }

   

    // 4. Official Links

    const existingLink = officialLinks.filter((link) => link.linkid);
    const newLinks = officialLinks.filter((link) => !link.linkid);

    // Update Existing Links
    if (existingLink.length > 0) {
      for (const link of existingLink) {
        await connection.query(
          `UPDATE job_links SET
        link_title = ?,
        link_url = ?
       WHERE id = ? AND job_id = ?`,
          [link.title || null, link.url || null, link.linkid, jobId],
        );
      }
    }

      // Bulk Delete
    const linkIds = existingLink.map((link) => link.linkid);

    if (linkIds.length > 0) {
      await connection.query(
        `DELETE FROM job_links
         WHERE job_id = ? AND id NOT IN (?)`,
        [jobId, linkIds],
      );
    } else {
      await connection.query(`DELETE FROM job_links WHERE job_id = ?`, [jobId]);
    }


    // Bulk Insert
    if (newLinks.length > 0) {
      const formatLinks = newLinks.map((link) => [
        jobId,
        link.title || null,
        link.url || null,
      ]);

      await connection.query(
        `INSERT INTO job_links (
          job_id, link_title, link_url
        ) VALUES ?`,
        [formatLinks],
      );
    }

  
    // 5. Commit
    await connection.commit();

    return res.status(200).json({
      success: true,
      message: "Job updated successfully",
      jobId,
    });
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }

    console.error("Edit Job Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while updating job",
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

export const DeleteJob = async (req, res) => {
  const userid = req.user?.id;
  const roleid = req.user?.roleid;
  const { jobid } = req.params;

  if (!userid)
    return res.status(400).json({ success: false, message: "Not verify" });

  if (roleid != 1)
    return res
      .status(401)
      .json({ success: false, message: "You are not Recruiter to add job" });

  if (!jobid)
    return res.status(401).json({ success: false, message: "Job not found" });

  try {
    await db.query(
      `Update jobs set deleted = ? where id = ? and user_id = ? and deleted = ?`,
      [true, jobid, userid, false],
    );

    res.status(200).json({
      success: true,
      message: "job deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
