import { useState,useEffect, use } from "react";
import { getStudents } from "../services/studentService";

function Dashboard(){

  const [totalStudents,setTotalStudents] = useState(0);
  const [totalPages,setTotalPages] = useState(0);
  const [currentPage,setCurrentPage] = useState(0);
  const [loading,setLoading ] = useState (true);
  const [ error,setError] = useState("");

  useEffect (() => {
    loadStudentCount();
  },[]);
  const loadStudentCount =async () => {
    try{
      setLoading(true)
      const data = await getStudents(
        0,10,"id","acs"
      );
      console.log("DashBoard Data : ", data);
      setTotalStudents(data.totalElements);
      setTotalPages(data.totalPages);
      setCurrentPage(data.number);
    } catch (error) {
      console.log("DashBoard Error : ", error);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };
  if(loading){
    return(
      <h2>LOADING DASHBOARD...</h2>
    );
  }
  if(error){
    return(
      <h2>{error}</h2>
    )
  }
  return(
    <div className="dashboard-container">
      <h1>DashBoard</h1>
      <p>Welcome to hte Student Management System</p>
      <div className="dashboard-cards">
        {/*TOTAL STUDENTS*/}
        <div className="dashboard-card">
          <h2>Total students</h2>
          <p>{totalStudents}</p>
        </div>
        {/*Current Page*/}
        <div className="dashboard-card">
          <h2>Current page</h2>
          <p>{currentPage+1}</p>
        </div>
        {/*Total pages*/}
        <div className="dashboard-card">
          <h2>TOtal pages</h2>
          <p>{totalPages}</p>
        </div>
      </div>
      <div className="dashboard-info">
        <h2>Student Managment</h2>
        <p>MAnage students,view student details,update records and delete students</p>
      </div>
    </div>
  );
}
export default Dashboard;