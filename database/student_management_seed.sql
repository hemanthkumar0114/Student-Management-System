-- ====================================================================
-- STUDENT MANAGEMENT SYSTEM (UCMS) - DATABASE SEED SCRIPT
-- Target Database: MySQL (hibernate)
-- ====================================================================

-- 1. Ensure target database exists and select it
CREATE DATABASE IF NOT EXISTS hibernate;
USE hibernate;

-- 2. Temporarily disable foreign key checks for safe cleanup
SET FOREIGN_KEY_CHECKS = 0;

-- 3. Clear existing test data in safe dependency order
DELETE FROM students;
DELETE FROM addresses;
DELETE FROM courses;

-- 4. Reset AUTO_INCREMENT counters to 1
ALTER TABLE courses AUTO_INCREMENT = 1;
ALTER TABLE addresses AUTO_INCREMENT = 1;
ALTER TABLE students AUTO_INCREMENT = 1;

-- 5. Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- ====================================================================
-- 6. INSERT 10 ACADEMIC COURSES (IDs 1-10)
-- ====================================================================
INSERT INTO courses (id, course_name, duration, department) VALUES
(1, 'Java Full Stack Development', '6 Months', 'Software Engineering'),
(2, 'Python Full Stack Development', '6 Months', 'Software Engineering'),
(3, 'Web Development', '4 Months', 'Web Technologies'),
(4, 'Data Science', '8 Months', 'Data & Analytics'),
(5, 'Artificial Intelligence', '10 Months', 'Intelligent Systems'),
(6, 'Machine Learning', '8 Months', 'Data & Analytics'),
(7, 'Cloud Computing', '6 Months', 'Infrastructure & Cloud'),
(8, 'Cyber Security', '6 Months', 'Information Security'),
(9, 'Mobile App Development', '5 Months', 'Mobile Technologies'),
(10, 'DevOps Engineering', '6 Months', 'Infrastructure & Cloud');

-- ====================================================================
-- 7. INSERT 20 RESIDENTIAL ADDRESSES (IDs 1-20)
-- ====================================================================
INSERT INTO addresses (id, city, state, pincode) VALUES
(1, 'Bengaluru', 'Karnataka', '560001'),
(2, 'Mysuru', 'Karnataka', '570001'),
(3, 'Mangaluru', 'Karnataka', '575001'),
(4, 'Hubballi', 'Karnataka', '580020'),
(5, 'Shivamogga', 'Karnataka', '577201'),
(6, 'Hassan', 'Karnataka', '573201'),
(7, 'Mandya', 'Karnataka', '571401'),
(8, 'Tumakuru', 'Karnataka', '572101'),
(9, 'Belagavi', 'Karnataka', '590001'),
(10, 'Chitradurga', 'Karnataka', '577501'),
(11, 'Bengaluru', 'Karnataka', '560034'),
(12, 'Mysuru', 'Karnataka', '570005'),
(13, 'Mangaluru', 'Karnataka', '575003'),
(14, 'Hubballi', 'Karnataka', '580030'),
(15, 'Shivamogga', 'Karnataka', '577202'),
(16, 'Hassan', 'Karnataka', '573202'),
(17, 'Mandya', 'Karnataka', '571402'),
(18, 'Tumakuru', 'Karnataka', '572102'),
(19, 'Belagavi', 'Karnataka', '590002'),
(20, 'Chitradurga', 'Karnataka', '577502');

-- ====================================================================
-- 8. INSERT 20 STUDENTS WITH 1-TO-1 ADDRESS & MANY-TO-1 COURSE
-- ====================================================================
INSERT INTO students (id, name, email, cgpa, address_id, course_id) VALUES
(1, 'Arjun Sharma', 'arjun.sharma@gmail.com', 9.20, 1, 1),
(2, 'Ananya Reddy', 'ananya.reddy@gmail.com', 8.85, 2, 2),
(3, 'Rahul Kumar', 'rahul.kumar@gmail.com', 7.90, 3, 3),
(4, 'Sneha Patil', 'sneha.patil@gmail.com', 9.40, 4, 4),
(5, 'Vijay Gowda', 'vijay.gowda@gmail.com', 8.20, 5, 5),
(6, 'Pooja Nair', 'pooja.nair@gmail.com', 8.95, 6, 6),
(7, 'Rohit Verma', 'rohit.verma@gmail.com', 7.65, 7, 7),
(8, 'Kavya Rao', 'kavya.rao@gmail.com', 9.15, 8, 8),
(9, 'Akash Bhat', 'akash.bhat@gmail.com', 8.40, 9, 9),
(10, 'Divya Shetty', 'divya.shetty@gmail.com', 9.50, 10, 10),
(11, 'Manish Singh', 'manish.singh@gmail.com', 8.10, 11, 1),
(12, 'Aishwarya Joshi', 'aishwarya.joshi@gmail.com', 9.30, 12, 2),
(13, 'Vivek Raj', 'vivek.raj@gmail.com', 7.80, 13, 3),
(14, 'Meghana Rao', 'meghana.rao@gmail.com', 8.70, 14, 4),
(15, 'Sandeep Kumar', 'sandeep.kumar@gmail.com', 8.05, 15, 5),
(16, 'Nandini Prasad', 'nandini.prasad@gmail.com', 9.60, 16, 6),
(17, 'Abhishek Gowda', 'abhishek.gowda@gmail.com', 7.95, 17, 7),
(18, 'Shreya Menon', 'shreya.menon@gmail.com', 9.25, 18, 8),
(19, 'Varun Kumar', 'varun.kumar@gmail.com', 8.55, 19, 9),
(20, 'Harshitha B M', 'harshitha.bm@gmail.com', 9.80, 20, 10);

-- ====================================================================
-- 9. VERIFICATION QUERIES
-- ====================================================================

-- Check Courses Count (Expect 10)
SELECT COUNT(*) AS total_courses FROM courses;
SELECT * FROM courses ORDER BY id ASC;

-- Check Addresses Count (Expect 20)
SELECT COUNT(*) AS total_addresses FROM addresses;
SELECT * FROM addresses ORDER BY id ASC;

-- Check Students Count (Expect 20)
SELECT COUNT(*) AS total_students FROM students;
SELECT * FROM students ORDER BY id ASC;

-- Complete Inner Join Verification Query
SELECT 
    s.id AS student_id,
    s.name AS student_name,
    s.email,
    s.cgpa,
    a.id AS address_id,
    a.city,
    a.state,
    a.pincode,
    c.id AS course_id,
    c.course_name,
    c.duration,
    c.department
FROM students s
LEFT JOIN addresses a ON s.address_id = a.id
LEFT JOIN courses c ON s.course_id = c.id
ORDER BY s.id ASC;
