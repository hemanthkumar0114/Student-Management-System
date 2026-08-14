import { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import { getStudents,deleteStudent, } from "../services/studentService";

function Students() {
  const [students, setStudents] = useState([]);
  const [loading , setLoading] = useState(true);
  const [error , setError] = useState("");

  useEffect (() => {
    loadStudnets();
  },[]);
  const loadStudnets = async () => {
    try {
        const data = await getStudents();

        console.log("Students From Backend:" , data);
        setStudents(data.content);
    } catch (error) {
        console.error("Error : ", error);
        setError("Failed to load students..");
    } finally {
        setLoading(false);
    }
  };
  if (loading) {
    return <h2>Loading students....</h2>
  }
  if(error){
    return <h2>{error}</h2>
  }
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
        "Are you sure you want to delete this student?"
    );
    if(!confirmed){
        return;
    }
    try{
        await deleteStudent(id);
        setStudents(
            students.filter((student) => students.id !== id)
        );
    } catch (error){
            console.log("Delete Error :" , error);

            setError ( " Failed to delete student.");   
        }
  };

  return (
    <div className="students-container">
        <div className="students=header">
            <h1>Students</h1>
            <Link to="/students/add" className="add-button"> 
            + Add Studnet 
            </Link>
            </div>

            {students.length === 0 ? (
                <p> No Stundets Found</p>
            ) : ( 
                <table>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
  {students.map((student) => (
    <tr key={student.id}>
      <td>{student.id}</td>
      <td>{student.name}</td>
      <td>{student.email}</td>

      <td>
        <Link to={`/students/edit/${student.id}`}>
          <button>Edit</button>
        </Link>

        <button onClick={() => handleDelete(student.id)}>
          Delete
        </button>
      </td>
    </tr>
  ))}
</tbody>
                </table>
            )}
        
    </div>
  );
}

export default Students;