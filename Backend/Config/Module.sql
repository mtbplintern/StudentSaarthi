-- Active: 1793871667941@@mysql-6a060ad-mtbplintern-6bd0.c.aivencloud.com@17411@defaultdb
CREATE Table Roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
)

insert into roles (name) VALUES ("Recruiter"), ("Candidate")

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    roleid INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUEL,
    phone VARCHAR(10),
    password VARCHAR(255),
    FOREIGN KEY (roleid) REFERENCES roles (id)
);

CREATE TABLE jobtype (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE
);

INSERT INTO
    jobtype (name)
VALUES ('Full Time'),
    ('Part Time'),
    ('Remote'),
    ('Internship'),
    ('Contract'),
    ('Permanent'),
    ('Work From Home');

CREATE TABLE jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    job_title VARCHAR(255) NOT NULL,
    organization_name VARCHAR(255),
    location VARCHAR(255),
    application_fee VARCHAR(100),
    jobtype_id INT,
    description LONGTEXT,
    instructions LONGTEXT,
    contact_email VARCHAR(255),
    status ENUM(
        'Draft',
        'Published',
        'Closed'
    ) DEFAULT 'Draft',
    deleted BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (jobtype_id) REFERENCES jobtype (id)
);

 

select * FROM jobs

CREATE TABLE job_dates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT NOT NULL,
    date_title VARCHAR(100) NOT NULL,
    date_value DATE,
    FOREIGN KEY (job_id) REFERENCES jobs (id)
);

CREATE TABLE job_vacancies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT NOT NULL,
    post_name VARCHAR(150) NOT NULL,
    total_vacancies INT,
    eligibility VARCHAR(150),
    age_limit VARCHAR(100),
    salary VARCHAR(100),
    category VARCHAR(150),
    FOREIGN KEY (job_id) REFERENCES jobs (id)
);

select * FROM job_dates

CREATE TABLE job_links (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT NOT NULL,
    link_title VARCHAR(100),
    link_url TEXT,
    FOREIGN KEY (job_id) REFERENCES jobs (id)
);

CREATE TABLE email_otps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    otp VARCHAR(255) NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);