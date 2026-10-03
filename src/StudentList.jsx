function StudentList({ students, onEdit, onDelete }) {

  const handleDelete = (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this student?");
    if (confirmed) {
      onDelete(id);
    }
  };

  return (
    <div>
      <h2>Student List</h2>
      {students.length === 0 ? (
        <p className="no-students">No students available.</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Age</th>
                <th>Course</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={student.id} className={index % 2 === 0 ? "row-even" : "row-odd"}>
                  <td>{student.id}</td>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.age}</td>
                  <td>{student.course}</td>
                  <td>
                    <button className="btn btn-edit" onClick={() => onEdit(student)}>
                      Edit
                    </button>
                    <button className="btn btn-delete" onClick={() => handleDelete(student.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default StudentList;
