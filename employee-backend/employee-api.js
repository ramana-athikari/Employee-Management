const express = require("express");
const router = express.Router();
const Employee = require("./employee-schema");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure Multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = "./uploads";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    // cb(null, file.fieldname + "-" + uniqueSuffix + ext); // to save the modified file name
    cb(null, file.originalname); // to save the original file name
  },
});

const upload = multer({ storage: storage });

// ✅ Create a new employee with image upload
router.post("/", upload.single("file"), async (req, res) => {
  const {
    ename,
    email,
    mobile,
    designation,
    gender,
    course,
    date,
  } = req.body;

  const filePath = req.file ? `/uploads/${req.file.filename}` : "";

  const newEmp = new Employee({
    f_Name: ename,
    f_Email: email,
    f_Mobile: mobile,
    f_Designation: designation,
    f_Gender: gender,
    f_Course: course,
    f_Createdate: date,
    f_Image: filePath,
  });

  try {
    const eInfo = await newEmp.save();
    res.status(200).json(eInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to save employee" });
  }
});

// ✅ Get all employee data
router.get("/data", async (req, res) => {
  try {
    const employeeInfo = await Employee.find();
    res.status(200).json(employeeInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch employee data" });
  }
});

// ✅ Check if email already exists
router.post("/check-email", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const employee = await Employee.findOne({ f_Email: email });
    if (employee) {
      return res.status(409).json({ message: "Email already exists" });
    } else {
      return res.status(200).json({ message: "Email is available" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// // ✅ Delete employee by ID
// router.delete("/:empId", async (req, res) => {
//   const id = req.params.empId;

//   try {
//     const empInfo = await Employee.findById(id);
//     if (!empInfo) {
//       return res.status(404).json({ message: "No such record" });
//     }

//     // Optional: Delete image file from disk
//     if (empInfo.f_Image) {
//       const filePath = path.join(__dirname, "..", empInfo.f_Image);
//       if (fs.existsSync(filePath)) {
//         fs.unlinkSync(filePath);
//       }
//     }

//     await empInfo.deleteOne();
//     res.status(200).json({ message: "Employee Deleted Successfully" });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Error deleting employee" });
//   }
// });

router.delete("/:empId", async (req, res) => {
  let id = req.params.empId;
  try {
    let empInfo = await Employee.findById(id);
    if (!empInfo) {
      return res.status(404).json({ message: "No such employee record" });
    }

    // Delete the image file from the server if it exists
    if (empInfo.f_Image) {
      const imagePath = path.join(__dirname, "uploads", path.basename(empInfo.f_Image));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath); // delete the file
      }
    }

    await empInfo.deleteOne(); // delete the DB record
    res.status(200).json({ message: "Employee and image deleted successfully" });

  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Error deleting employee" });
  }
});


// ✅ Update employee by ID (supports optional new image upload)
// router.put("/:id", upload.single("file"), async (req, res) => {
//   const { id } = req.params;

//   const {
//     f_Name,
//     f_Email,
//     f_Mobile,
//     f_Designation,
//     f_Gender,
//     f_Course,
//     f_Image // in case no new file is uploaded
//   } = req.body;

//   const newImagePath = req.file ? `/uploads/${req.file.filename}` : f_Image;

//   try {
//     const updated = await Employee.findByIdAndUpdate(
//       id,
//       {
//         f_Name,
//         f_Email,
//         f_Mobile,
//         f_Designation,
//         f_Gender,
//         f_Course,
//         f_Image: newImagePath,
//       },
//       { new: true }
//     );

//     if (!updated) {
//       return res.status(404).json({ message: "Employee not found" });
//     }

//     res.status(200).json(updated);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Error updating employee" });
//   }
// });

// Update employee with image deletion if a new one is uploaded
router.put("/:id", upload.single("file"), async (req, res) => {
  const { id } = req.params;
  const {
    f_Name,
    f_Email,
    f_Mobile,
    f_Designation,
    f_Gender,
    f_Course,
  } = req.body;

  try {
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // ✅ Delete previous image if a new image is uploaded
    if (req.file && employee.f_Image) {
      const oldFilename = path.basename(employee.f_Image); // Extract only filename
      const oldImagePath = path.join(__dirname, "uploads", oldFilename); // Direct to uploads folder

      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
        // console.log("Old image deleted:", oldImagePath);
      } else {
        console.log("Old image not found:", oldImagePath);
      }
    }


    // ✅ Update employee details
    employee.f_Name = f_Name;
    employee.f_Email = f_Email;
    employee.f_Mobile = f_Mobile;
    employee.f_Designation = f_Designation;
    employee.f_Gender = f_Gender;
    employee.f_Course = f_Course;
    if (req.file) {
      employee.f_Image = "/uploads/" + req.file.filename;
    }

    const updated = await employee.save();
    res.status(200).json(updated);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Error updating employee" });
  }
});

module.exports = router;

module.exports = router;
