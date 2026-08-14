import { useState,useEffect } from "react";
import { useNavigate,useParams } from "react-router-dom";
import { getStudents,updateStudent } from "../services/studentService";

function EditStudent (){
    const { id } = useParams ();
    const navigate = useNavigate();
    const [student,setStudent] = useState({
        id : "",
        name : "",
        email : "",
    });

    const [loading , setLoading] = useState(true);
    const [message, setMessage] = useState("");
    useEffect (() => {
        loadStudent();
    },[]);
    const loadStudent = async () => {
        try {
            const data = await getStudents();
            const existingStudent = data.content.find(
                (student) => student.id === Number(id)
            );
            if(existingStudent){
                setStudent({
                    id : existingStudent.id,
                    name : existingStudent.name,
                    email : existingStudent.email,
                });
            }else {
                setMessage("Student not found.");
            }
        } catch (error){
            console.log("Error : ",error);
            setMessage("Failed to Load Student.");
        }  finally {
            setLoading(false);
        }
    };
    const handleChange = (event) => {
        const {name,value} = event.target;
        setStudent({
            ...student,
            [name] : value,
        });
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        try{
            await updateStudent(student);
            setMessage("Studnet updated Successfully!");
            setTimeout(() => {
                navigate("/studnets");
            },1000);
        } catch (error) {
            console.log("Update error : ", error);
            setMessage("Failed to update student.");
        }
    };
    if (loading) {
        return <h2>Loading Student...</h2>
    }
    return(
        <div>
            <h1>Edit Student</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label> Student Name </label>
                    <input 
                        type="text" 
                        name="name"
                        value={student.name}
                        onChange={handleChange}   
                    />
                </div>
                <div>
                    <label>Email</label>
                    <input type="email"
                           name="email"
                           value={student.email}
                           onChange={handleChange}  
                    />
                </div>
                <button type="submit">Update Student</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}
export default EditStudent;