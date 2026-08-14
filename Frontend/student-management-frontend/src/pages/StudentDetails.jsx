import { useEffect,useState } from "react";
import { Link,useParams } from "react-router-dom";
import { getStudentsById } from "../services/studentService";

function StudentDetails(){
    const {id} = useParams();
    const [student, setStudent] = useState(null);
    const [loading,setLoading] = useState(null);
    const [error,SetError] = useState("");
    useEffect (() => {
        loadStudent();
    },[id]);
    const loadStudent = async () => {
        try{
            setLoading(true);
            SetError("");
            const data = await getStudentsById(id);
            console.log("Student Detils : ", data);
            setStudent(data);
        } catch(error){
            console.error("Student Details Error : ", error);
            SetError("Failed to load student details.");    
        } finally {
            setLoading(false);
        }
    };
    if(loading){
        return<h2>LOading Studnets....</h2>
    }
    if(error){
        return<h2>{error}</h2>
    }
    if(!student){
        return <h2>Student not found.</h2>
    }
    return(
        <div className="student-details-container">
            <h1>Student Detail</h1>
            <div className="student-details-card">
                <h2>{student.name}</h2>
                <div className="student-detail">
                    <strong>ID :</strong>
                    <span>{student.id}</span>
                </div>
                <div className="sdudent-detail">
                    <strong>NAME :</strong>
                    <span>{student.name}</span>
                </div>
                <div className="student-detail">
                    <strong>EMAIL :</strong>
                    <span>{student.email}</span>
                </div>
                <div className="student-detail">
                    <strong>CITY :</strong>
                    <span>{student.address?.city || "Not available"}</span>
                </div>
                <div className="student-detail">
                    <strong>STATE :</strong>
                    <span>{student.address?.state || "Not avalible"}</span>
                </div>
                <div className="student-detail">
                    <strong>PINCODE :</strong>
                    <span>{student.address?.pincode || "Not available"}</span>
                </div>
                <div className="student-detail">
                    <strong>COURSE :</strong>
                    <span>{student.course?.courseName || "Not available"}</span>
                </div>
            </div>
            <Link to="students" className="back-button">
            ← Back to Students
            </Link>
        </div>
    );
}
export default StudentDetails;