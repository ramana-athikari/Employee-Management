
import { useState } from "react";

const EmployeeList = () => {
    let [name, pickName] = useState("");
    let [email, pickEmail] = useState("");
    let [mobile, pickMobile] = useState("");
    let [designation, pickDesignation] = useState("");
    let [gender, pickGender] = useState("");
    let [course, pickCourse] = useState([]);
    let [file, pickFile] = useState("");
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const date = new Date();
    const ndate = date.toLocaleDateString();

    // Form validation function
    const validateForm = () => {
        let formErrors = {};
        let isValid = true;

        // Name validation
        if (!name) {
            formErrors.name = "Name is required.";
            isValid = false;
        }

        // Email validation
        if (!email) {
            formErrors.email = "Email is required.";
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            formErrors.email = "Please enter a valid email address.";
            isValid = false;
        }

        // Mobile validation
        if (!mobile) {
            formErrors.mobile = "Mobile number is required.";
            isValid = false;
        } else if (!/^\d{10}$/.test(mobile)) {
            formErrors.mobile = "Please enter a valid 10-digit mobile number.";
            isValid = false;
        }

        // Designation validation
        if (!designation) {
            formErrors.designation = "Please select a designation.";
            isValid = false;
        }

        // Gender validation
        if (!gender) {
            formErrors.gender = "Please select a gender.";
            isValid = false;
        }

        // Course validation
        if (course.length === 0) {
            formErrors.course = "Please select at least one course.";
            isValid = false;
        }

        // File validation
        if (!file) {
            formErrors.file = "Please upload an image.";
            isValid = false;
        }

        setErrors(formErrors);
        return isValid;
    };

    // Function to check if email already exists in the database
    const checkEmailExists = async (email) => {
        try {
            const response = await fetch("http://localhost:2222/t_Employee/check-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Server Error");
            }

            const data = await response.json();
            return data.message === "Email is available"; // Returns true if the email is not taken
        } catch (error) {
            alert(error.message);
            return false; // If any error occurs, assume the email is not valid
        }
    };

    // Save function that is triggered when the form is submitted
    // const save = async (obj) => {
    //     obj.preventDefault();

    //     // Step 1: Validate form before submission
    //     if (!validateForm()) {
    //         return;
    //     }

    //     // Step 2: Check for duplicate email in the backend
    //     const emailIsValid = await checkEmailExists(email);
    //     if (!emailIsValid) {
    //         setErrors((prevErrors) => ({
    //             ...prevErrors,
    //             email: "This email is already registered.",
    //         }));
    //         return;
    //     }

    //     // Step 3: If validation passes, submit the form
    //     const input = {
    //         file: file,
    //         ename: name,
    //         email: email,
    //         mobile: mobile,
    //         designation: designation,
    //         gender: gender,
    //         course: course.join(", "),
    //         date: ndate,
    //     };

    //     let url = "http://localhost:2222/t_Employee";
    //     let postdata = {
    //         headers: { "content-type": "application/json" },
    //         method: "POST",
    //         body: JSON.stringify(input),
    //     };

    //     setIsSubmitting(true);

    //     fetch(url, postdata)
    //         .then((res) => res.json())
    //         .then(() => {
    //             alert("Employee saved successfully!");
    //             pickName("");
    //             pickEmail("");
    //             pickMobile("");
    //             pickDesignation("");
    //             pickFile("");
    //             pickCourse([]);
    //             setErrors({});
    //             setIsSubmitting(false);
    //             obj.target.reset();
    //         })
    //         .catch((error) => {
    //             alert(error);
    //             setIsSubmitting(false);
    //         });
    // };

    const save = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const emailIsValid = await checkEmailExists(email);
        if (!emailIsValid) {
            setErrors((prev) => ({
                ...prev,
                email: "This email is already registered.",
            }));
            return;
        }

        const formData = new FormData();
        formData.append("ename", name);
        formData.append("email", email);
        formData.append("mobile", mobile);
        formData.append("designation", designation);
        formData.append("gender", gender);
        formData.append("course", course.join(", "));
        // formData.append("date", new Date().toLocaleDateString());
        formData.append("date", ndate);
        formData.append("file", file); // Actual file object

        setIsSubmitting(true);

        try {
            const response = await fetch("http://localhost:2222/t_Employee", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                alert("Employee saved successfully!");
                pickName("");
                pickEmail("");
                pickMobile("");
                pickDesignation("");
                pickFile("");
                pickCourse([]);
                setErrors({});
                e.target.reset();
            } else {
                const result = await response.json();
                alert(result.message || "Failed to save employee");
            }
        } catch (error) {
            alert("Error: " + error.message);
        }

        setIsSubmitting(false);
    };


    return (
        <div className="container">
            <div className="text-center fs-5 bg-warning">Create Employee</div>
            <div className="row">
                <div className="col-lg-3"></div>
                <div className="col-lg-6">
                    <form onSubmit={save}>
                        <div className="row mt-3 border p-2 rounded bg-light">
                            <caption className="text-center fs-4 mb-2 text-primary">Create Employee</caption>

                            {/* Name Field */}
                            <div className="col-lg-4">Name</div>
                            <div className="col-lg-8 mb-3">
                                <input
                                    onChange={(obj) => pickName(obj.target.value)}
                                    value={name}
                                    type="text"
                                    className="form-control"
                                />
                                {errors.name && <span className="text-danger">{errors.name}</span>}
                            </div>

                            {/* Email Field */}
                            <div className="col-lg-4">Email</div>
                            <div className="col-lg-8 mb-3">
                                <input
                                    onChange={(obj) => pickEmail(obj.target.value)}
                                    value={email}
                                    type="email"
                                    className="form-control"
                                />
                                {errors.email && <span className="text-danger">{errors.email}</span>}
                            </div>

                            {/* Mobile Field */}
                            <div className="col-lg-4">Mobile No</div>
                            <div className="col-lg-8 mb-3">
                                <input
                                    onChange={(obj) => pickMobile(obj.target.value)}
                                    value={mobile}
                                    type="text"
                                    maxLength={10}
                                    className="form-control"
                                />
                                {errors.mobile && <span className="text-danger">{errors.mobile}</span>}
                            </div>

                            {/* Designation Field */}
                            <div className="col-lg-4">Designation</div>
                            <div className="col-lg-8 mb-3">
                                <select
                                    onChange={(obj) => pickDesignation(obj.target.value)}
                                    value={designation}
                                    className="form-select"
                                >
                                    <option>Select Designation </option>
                                    <option>HR</option>
                                    <option>Manager</option>
                                    <option>Sales</option>
                                </select>
                                {errors.designation && <span className="text-danger">{errors.designation}</span>}
                            </div>

                            {/* Gender Field */}
                            <div className="col-lg-4">Gender</div>
                            <div className="col-lg-8 mb-3">
                                <div className="input-group">
                                    <div className="form-check">
                                        <input
                                            onChange={(obj) => pickGender(obj.target.value)}
                                            id="radio1"
                                            className="form-check-input"
                                            type="radio"
                                            name="gender"
                                            value="Male"
                                        />
                                        <label htmlFor="radio1" className="form-check-label me-3">
                                            Male
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input
                                            onChange={(obj) => pickGender(obj.target.value)}
                                            id="radio2"
                                            className="form-check-input"
                                            type="radio"
                                            name="gender"
                                            value="Female"
                                        />
                                        <label htmlFor="radio2" className="form-check-label">
                                            Female
                                        </label>
                                    </div>
                                </div>
                                {errors.gender && <span className="text-danger">{errors.gender}</span>}
                            </div>

                            {/* Course Field */}
                            <div className="col-lg-4">Course</div>
                            <div className="col-lg-8 mb-3">
                                <div className="input-group">
                                    <div className="form-check">
                                        <input
                                            onChange={(obj) => {
                                                const value = obj.target.value;
                                                pickCourse((prev) =>
                                                    prev.includes(value)
                                                        ? prev.filter((item) => item !== value)
                                                        : [...prev, value]
                                                );
                                            }}
                                            id="check1"
                                            className="form-check-input"
                                            type="checkbox"
                                            name="courses"
                                            value="MCA"
                                        />
                                        <label htmlFor="check1" className="form-check-label me-3">
                                            MCA
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input
                                            onChange={(obj) => {
                                                const value = obj.target.value;
                                                pickCourse((prev) =>
                                                    prev.includes(value)
                                                        ? prev.filter((item) => item !== value)
                                                        : [...prev, value]
                                                );
                                            }}
                                            id="check2"
                                            className="form-check-input"
                                            type="checkbox"
                                            name="courses"
                                            value="BCA"
                                        />
                                        <label htmlFor="check2" className="form-check-label me-3">
                                            BCA
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input
                                            onChange={(obj) => {
                                                const value = obj.target.value;
                                                pickCourse((prev) =>
                                                    prev.includes(value)
                                                        ? prev.filter((item) => item !== value)
                                                        : [...prev, value]
                                                );
                                            }}
                                            id="check3"
                                            className="form-check-input"
                                            type="checkbox"
                                            name="courses"
                                            value="BSC"
                                        />
                                        <label htmlFor="check3" className="form-check-label">
                                            BSC
                                        </label>
                                    </div>
                                </div>
                                {errors.course && <span className="text-danger">{errors.course}</span>}
                            </div>

                            {/* File Upload Field */}
                            <div className="col-lg-4">Image Upload</div>
                            <div className="col-lg-8 mb-3">
                                <input
                                    type="file"
                                    className="form-control"
                                    onChange={(e) => pickFile(e.target.files[0])}
                                />
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
                                {errors.file && <span className="text-danger">{errors.file}</span>}
                            </div>


                            <div className="text-center mt-2">
                                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                    Submit
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="col-lg-3"></div>
            </div>
        </div>
    );
};

export default EmployeeList;