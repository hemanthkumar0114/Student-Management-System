import { useState } from "react";
import { addStudent } from "../services/studentService";

function AddStudent(){
    const[student, setStudent] = useState ({
        name : "",
        email: "",
    });

    const [message,setMessage] = useState("");
    const handleChange = (event) => {
        const { name, value } = event.target;
        setStudent({
            ...student,
            [name]: value,
        });
    };

    const handleSubmit = async(event) => {
        event.preventDefault();
        try{
            const savedStudent = await addStudent(student);

            console.log("Student saved : " , savedStudent);

            setMessage("Student added Successfully!");

            setStudent({
                name : "",
                email : "",
            });

    } catch (error){
        console.error("Error : ",error);
        setMessage("Failed to add student.");
    }
};
    return (
        <div>
            <h1>Add Student</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Student Name</label>
                        <input 
                        type="text"
                        name="name"
                        value={student.name}
                        onChange={handleChange}
                        placeholder="Enter Student Name"
                        />
                </div>
                <div>
                    <label>Email</label>
                    <input 
                    type="email"
                    name="email"
                    value={student.email}
                    onChange={handleChange}
                    placeholder="Enter Email"
                    />
                </div>
                <button type="submit">Add Studnet</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}
export default AddStudent;