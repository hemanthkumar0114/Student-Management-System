import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import {
  getStudents,
  deleteStudent,
  searchStudents
} from "../services/studentService";


function Students() {

  // Student data
  const [students, setStudents] = useState([]);

  // Loading state
  const [loading, setLoading] = useState(true);

  // Error message
  const [error, setError] = useState("");

  // Search text
  const [search, setSearch] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Sortby direction
  const [sortBy,setSortBy] = useState ("id");
  const [direction,setDirection] = useState("asc");

  // Load students when page opens
  useEffect(() => {

    loadStudents();

  }, []);


  // Get students from backend
  const loadStudents = async (page = 0) => {

    try {

      setLoading(true);
      setError("");

      const data = await getStudents(page, 10,sortBy,direction);

      console.log("Students From Backend:", data);

      setStudents(data.content);

      setCurrentPage(data.number);

      setTotalPages(data.totalPages);

    } catch (error) {

      console.error("Error:", error);

      setError("Failed to load students.");

    } finally {

      setLoading(false);

    }
  };


  // Previous page
  const handlePrevious = () => {

    if (currentPage > 0) {

      loadStudents(currentPage - 1);

    }

  };


  // Next page
  const handleNext = () => {

    if (currentPage < totalPages - 1) {

      loadStudents(currentPage + 1);

    }

  };


  // Delete student
  const handleDelete = async (id) => {

    const confirmed = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmed) {

      return;

    }


    try {

      await deleteStudent(id);

      // Remove deleted student from screen
      setStudents(
        students.filter((student) => student.id !== id)
      );

    } catch (error) {

      console.error("Delete Error:", error);

      setError("Failed to delete student.");

    }

  };


  // Search students
  const handleSearch = async () => {

    // If search box is empty
    if (search.trim() === "") {

      loadStudents();

      return;

    }


    try {

      setLoading(true);

      setError("");

      const data = await searchStudents(search);

      console.log("Search Results:", data);

      setStudents(data);

    } catch (error) {

      console.error("Search Error:", error);

      setError("Failed to search students.");

    } finally {

      setLoading(false);

    }

  };


  // Loading screen
  if (loading) {

    return <h2>Loading students...</h2>;

  }


  // Error screen
  if (error) {

    return <h2>{error}</h2>;

  }


  return (

    <div className="students-container">


      {/* HEADER */}

      <div className="students-header">


        {/* TITLE */}

        <div>

          <h1>Students</h1>

          <p>
            Manage student records
          </p>

        </div>


        {/* SEARCH */}

        <div className="search-container">

          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <button onClick={handleSearch}>

            Search

          </button>

          <div className="sort-container">
            <label>
              SORT BY:
            </label>
            <select value={sortBy}onChange={(e)=> {
              setSortBy(e.target.value);
            }}>
              <option value="id">ID</option>
              <option value="name">NAME</option>
              <option value="email">EMAIL</option>
            </select>
            <select value={direction}onChange={(e) =>{
              setDirection(e.target.value);
            }}>
              <option value="asc">ASCENDING</option>
              <option value="desc">DESCENDING</option>
            </select>
            <button onClick={()=>loadStudents(0)}>SORT</button>
            
          </div>

          <Link to="/students/add"
          className="add-button">
          +ADD STUDENT
          </Link>

        </div>


        {/* ADD STUDENT */}

        <Link
          to="/students/add"
          className="add-button"
        >

          + Add Student

        </Link>


      </div>


      {/* STUDENT TABLE */}

      {students.length === 0 ? (

        <p>No Students Found</p>

      ) : (

        <div className="table-container">


          <table>


            {/* TABLE HEADER */}

            <thead>

              <tr>

                <th>ID</th>

                <th>Name</th>

                <th>Email</th>

                <th>Actions</th>

              </tr>

            </thead>


            {/* TABLE BODY */}

            <tbody>

              {students.map((student) => (

                <tr key={student.id}>


                  <td>
                    {student.id}
                  </td>


                  <td>
                    {student.name}
                  </td>


                  <td>
                    {student.email}
                  </td>


                  <td className="actions">

                      <Link to={`/students/${student.id}`}>
                        <button>
                          View
                        </button>
                      </Link>
                    {/* EDIT */}

                    <Link
                      to={`/students/edit/${student.id}`}
                    >

                      <button className="edit-button">

                        Edit

                      </button>

                    </Link>


                    {/* DELETE */}

                    <button
                      className="delete-button"
                      onClick={() =>
                        handleDelete(student.id)
                      }
                    >

                      Delete

                    </button>


                  </td>


                </tr>

              ))}

            </tbody>


          </table>


          {/* PAGINATION */}

          <div className="pagination">


            {/* PREVIOUS */}

            <button
              onClick={handlePrevious}
              disabled={currentPage === 0}
            >

              ← Previous

            </button>


            {/* PAGE NUMBER */}

            <span>

              Page {currentPage + 1} of {totalPages}

            </span>


            {/* NEXT */}

            <button
              onClick={handleNext}
              disabled={
                currentPage === totalPages - 1
              }
            >

              Next →

            </button>


          </div>


        </div>

      )}

    </div>

  );

}


export default Students;