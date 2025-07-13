import { useState, useEffect, useRef } from "react";

const UpdateEmployee = () => {
    let [employeeInfo, setEmployee] = useState([]);
    let [name, pickName] = useState("");
    let [email, pickEmail] = useState("");
    let [mobile, pickMobile] = useState("");
    let [designation, pickDesignation] = useState("");
    let [gender, pickGender] = useState("");
    let [course, pickCourse] = useState([]);
    let [file, pickFile] = useState("");
    let [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
    const [preview, setPreview] = useState(""); // For previewing the image
    const fileInputRef = useRef(null);
    let [oldImage, setOldImage] = useState("");

    let [keyword, setKeyword] = useState(""); // for sorting
    let [errors, setErrors] = useState({
        name: "",
        email: "",
        mobile: "",
        gender: "",
        course: "",
        file: "",
        designation: ""
    });

    const getEmployee = () => {
        fetch("http://localhost:2222/t_Employee/data")
            .then(res => res.json())
            .then(eInfo => {
                setEmployee(eInfo);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const delEmployee = (id) => {
        let postdata = { method: "delete" };
        try {
            fetch("http://localhost:2222/t_Employee/" + id, postdata)
                .then(res => res.json())
                .then(() => {
                    alert("Employee Deleted Successfully");
                    getEmployee();
                });
        } catch (error) {
            alert(error);
        }
    };

    const editEmployee = (employee) => {
        pickName(employee.f_Name);
        pickEmail(employee.f_Email);
        pickMobile(employee.f_Mobile);
        pickGender(employee.f_Gender);
        pickDesignation(employee.f_Designation);
        pickCourse(employee.f_Course ? employee.f_Course.split(', ') : []);
        pickFile(employee.f_Image);       // also keep this for preview
        setOldImage(employee.f_Image);   // <-- store old image path
        setPreview(`http://localhost:2222${employee.f_Image}`);
        setSelectedEmployeeId(employee._id);
    };

    const handleCourseChange = (event) => {
        const value = event.target.value;
        if (course.includes(value)) {
            pickCourse(course.filter(item => item !== value));
        } else {
            pickCourse([...course, value]);
        }
    };

    // Check if email is already in use
    const checkDuplicateEmail = (emailToCheck) => {
        return employeeInfo.some((emp) => emp.f_Email === emailToCheck && emp._id !== selectedEmployeeId);
    };

    // Validate form data
    const validateForm = () => {
        let isValid = true;
        let validationErrors = {
            name: "",
            email: "",
            mobile: "",
            gender: "",
            course: "",
        };

        if (!name) {
            validationErrors.name = "Name is required.";
            isValid = false;
        }

        if (!email) {
            validationErrors.email = "Email is required.";
            isValid = false;
        } else if (checkDuplicateEmail(email)) {
            validationErrors.email = "Email is already in use.";
            isValid = false;
        }

        if (!mobile) {
            validationErrors.mobile = "Mobile number is required.";
            isValid = false;
        } else if (!/^\d{10}$/.test(mobile)) {
            validationErrors.mobile = "Mobile number must be 10 digits.";
            isValid = false;
        }

        // Designation validation
        if (!designation) {
            validationErrors.designation = "Please select a designation.";
            isValid = false;
        }

        if (!gender) {
            validationErrors.gender = "Gender is required.";
            isValid = false;
        }

        if (course.length === 0) {
            validationErrors.course = "At least one course must be selected.";
            isValid = false;
        }

        // File validation
        if (!file) {
            validationErrors.file = "Please upload an image.";
            isValid = false;
        } else if (file instanceof File) {
            // Only validate if it's a new uploaded file
            if (!(file.type === "image/jpeg" || file.type === "image/png")) {
                validationErrors.file = "Only JPG/PNG files are allowed.";
                isValid = false;
            }
        }


        setErrors(validationErrors);
        return isValid;
    };

    // const handleUpdate = (event) => {
    //     event.preventDefault();

    //     // Validate the form before submitting
    //     if (!validateForm()) {
    //         return;
    //     }

    //     const updatedEmployee = {
    //         f_Name: name,
    //         f_Email: email,
    //         f_Mobile: mobile,
    //         f_Designation: designation,
    //         f_Gender: gender,
    //         f_Course: course.join(", "),
    //         f_Image: file,
    //     };

    //     fetch(`http://localhost:2222/t_Employee/${selectedEmployeeId}`, {
    //         method: "PUT",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify(updatedEmployee),
    //     })
    //         .then((res) => res.json())
    //         .then(() => {
    //             alert("Employee updated successfully");
    //             getEmployee();
    //             resetForm();
    //         })
    //         .catch((error) => {
    //             console.error("Error updating employee:", error);
    //         });
    // };

    const handleUpdate = (event) => {
        event.preventDefault();

        // Validate the form before submitting
        if (!validateForm()) {
            return;
        }

        const formData = new FormData();
        formData.append("f_Name", name);
        formData.append("f_Email", email);
        formData.append("f_Mobile", mobile);
        formData.append("f_Designation", designation);
        formData.append("f_Gender", gender);
        formData.append("f_Course", course.join(", "));

        // Check if a new file (File object) was uploaded
        if (file instanceof File) {
            formData.append("file", file); // New image
        } else {
            formData.append("f_Image", oldImage); // Existing image path
        }

        fetch(`http://localhost:2222/t_Employee/${selectedEmployeeId}`, {
            method: "PUT",
            body: formData,
        })
            .then((res) => res.json())
            .then(() => {
                alert("Employee updated successfully");
                getEmployee();
                resetForm();
            })
            .catch((error) => {
                console.error("Error updating employee:", error);
            });
    };

    const resetForm = () => {
        pickName("");
        pickEmail("");
        pickMobile("");
        pickDesignation("");
        pickGender("");
        pickCourse([]);
        pickFile("");
        setPreview("");
        setSelectedEmployeeId(null);
        setErrors({});

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    useEffect(() => {
        getEmployee();
    }, []);

    return (
        <div className="container">
            <div className="text-center fs-5 bg-warning"> Employee Edit </div>
            <div className="row">
                <div className="col-lg-3"></div>
                <div className="col-lg-6">
                    <form onSubmit={handleUpdate}>
                        <div className="row mt-3 border p-2 rounded bg-light">
                            <caption className="text-center fs-4 mb-2 text-primary"> Employee Edit </caption>
                            <div className="col-lg-4"> Name </div>
                            <div className="col-lg-8 mb-3">
                                <input
                                    onChange={(obj) => pickName(obj.target.value)}
                                    type="text"
                                    className="form-control"
                                    value={name}
                                />
                                {errors.name && <span className="text-danger">{errors.name}</span>}
                            </div>
                            <div className="col-lg-4"> Email </div>
                            <div className="col-lg-8 mb-3">
                                <input
                                    onChange={(obj) => pickEmail(obj.target.value)}
                                    type="email"
                                    className="form-control"
                                    value={email}
                                />
                                {errors.email && <span className="text-danger">{errors.email}</span>}
                            </div>
                            <div className="col-lg-4"> Mobile No </div>
                            <div className="col-lg-8 mb-3">
                                <input
                                    onChange={(obj) => pickMobile(obj.target.value)}
                                    type="text"
                                    maxLength={10}
                                    className="form-control"
                                    value={mobile}
                                />
                                {errors.mobile && <span className="text-danger">{errors.mobile}</span>}
                            </div>
                            <div className="col-lg-4"> Designation </div>
                            <div className="col-lg-8 mb-3">
                                <select
                                    onChange={(obj) => pickDesignation(obj.target.value)}
                                    value={designation}
                                    className="form-select">
                                    <option> Select </option>
                                    <option> HR </option>
                                    <option> Manager </option>
                                    <option> Sales </option>
                                </select>
                                {errors.designation && <span className="text-danger">{errors.designation}</span>}
                            </div>
                            <div className="col-lg-4"> Gender </div>
                            <div className="col-lg-8 mb-3">
                                <div className="input-group">
                                    <div className="form-check">
                                        <input
                                            onChange={(obj) => pickGender(obj.target.value)}
                                            className="form-check-input"
                                            id="radio1"
                                            type="radio"
                                            value="Male"
                                            checked={gender === "Male"}
                                        />
                                        <label className="form-check-label me-3" htmlFor="radio1"> Male </label>
                                    </div>
                                    <div className="form-check">
                                        <input
                                            onChange={(obj) => pickGender(obj.target.value)}
                                            className="form-check-input" id="radio2"
                                            type="radio"
                                            value="Female"
                                            checked={gender === "Female"}
                                        />
                                        <label className="form-check-label" htmlFor="radio2"> Female </label>
                                    </div>
                                </div>
                                {errors.gender && <span className="text-danger">{errors.gender}</span>}
                            </div>
                            <div className="col-lg-4"> Course </div>
                            <div className="col-lg-8 mb-3">
                                <div className="input-group">
                                    <div className="form-check">
                                        <input
                                            onChange={handleCourseChange}
                                            className="form-check-input"
                                            id="check1"
                                            type="checkbox"
                                            value="MCA"
                                            checked={course.includes("MCA")}
                                        />
                                        <label className="form-check-label me-3" htmlFor="check1"> MCA </label>
                                    </div>
                                    <div className="form-check">
                                        <input
                                            onChange={handleCourseChange}
                                            className="form-check-input"
                                            id="check2"
                                            type="checkbox"
                                            value="BCA"
                                            checked={course.includes("BCA")}
                                        />
                                        <label className="form-check-label me-3" htmlFor="check2"> BCA </label>
                                    </div>
                                    <div className="form-check">
                                        <input
                                            onChange={handleCourseChange}
                                            className="form-check-input"
                                            id="check3"
                                            type="checkbox"
                                            value="BSC"
                                            checked={course.includes("BSC")}
                                        />
                                        <label className="form-check-label" htmlFor="check3"> BSC </label>
                                    </div>
                                </div>
                                {errors.course && <span className="text-danger">{errors.course}</span>}
                            </div>
                            <div className="col-lg-4"> Image Upload </div>
                            <div className="col-lg-8 mb-3">
                                <input
                                    type="file"
                                    className="form-control"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    onChange={(e) => {
                                        const selectedFile = e.target.files[0];
                                        if (selectedFile) {
                                            pickFile(selectedFile);
                                            const previewURL = URL.createObjectURL(selectedFile);
                                            setPreview(previewURL);
                                        }
                                    }}
                                />
                                {errors.file && <span className="text-danger">{errors.file}</span>}
                                
                                {file && (
                                    <div className="mt-2">
                                        <strong>Selected Image:</strong>{" "}
                                        {typeof file === "string"
                                            ? file.substring(file.lastIndexOf("/") + 1)
                                            : file.name}

                                        <br />
                                        <img
                                            src={
                                                typeof file === "string"
                                                    ? `http://localhost:2222${file}`
                                                    : URL.createObjectURL(file)
                                            }
                                            alt="Preview"
                                            width={100}
                                            height={70}
                                            className="mt-2"
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="text-center mt-3">
                                <button type="submit" className="btn btn-primary"> Update </button>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="col-lg-3"></div>
            </div>

            <div className="text-center mt-4 fs-5 bg-warning"> Employee List </div>
            <div className="row text-end mt-2 mb-2">
                <div className="col-lg-3"></div>
                <div className="col-lg-3"></div>
                <div className="row col-lg-6">
                    <div className="col-lg-4 text-danger fs-5"> Search </div>
                    <div className="col-lg-8">
                        <input
                            type="search"
                            className="form-control"
                            onChange={obj => setKeyword(obj.target.value)}
                        />
                    </div>
                </div>
            </div>
            <table className="table table-bordered">
                <thead>
                    <tr className="table-primary">
                        <th> Unique Id </th>
                        <th> Image </th>
                        <th> Name </th>
                        <th> Email </th>
                        <th> Mobile </th>
                        <th> Designation </th>
                        <th> Gender </th>
                        <th> Course </th>
                        <th> Create Date </th>
                        <th> Action </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        employeeInfo.map((employee, index) => {
                            if (employee.f_Name.toLowerCase().trim().match(keyword.toLowerCase()) || employee.f_Email.toString().match(keyword.toLowerCase()) || employee.f_Createdate.toString().match(keyword))
                                return (
                                    <tr key={index}>
                                        <td> {employee._id.slice(0, 8)} </td>
                                        {/* <td> <img src={employee.f_Image} alt="Image" height={40} width={40} className="bg-black" />  </td> */}
                                        <td> <img src={`http://localhost:2222${employee.f_Image}`} alt="Employee" height={70} width={100} /> </td>
                                        <td> {employee.f_Name} </td>
                                        <td> <a href={`mailto:${employee.f_Email}`}> {employee.f_Email} </a> </td>
                                        <td> {employee.f_Mobile} </td>
                                        <td> {employee.f_Designation} </td>
                                        <td> {employee.f_Gender} </td>
                                        <td> {employee.f_Course} </td>
                                        <td> {employee.f_Createdate} </td>
                                        <td>
                                            <button onClick={delEmployee.bind(this, employee._id)} className="btn btn-danger me-2 btn-sm"> Delete </button>
                                            <button onClick={editEmployee.bind(this, employee)} className="btn btn-warning btn-sm"> Edit </button>
                                        </td>
                                    </tr>
                                );
                        })
                    }
                </tbody>
            </table>
        </div>
    );
}

export default UpdateEmployee;
