const Admin = require('../models/adminSchema.js');

// const adminRegister = async (_req, res) => {
//     try {
//         const salt = await bcrypt.genSalt(10);
//         const hashedPass = await bcrypt.hash(_req.body.password, salt);

//         const admin = new Admin({
//             ..._req.body,
//             password: hashedPass
//         });

//         const existingAdminByEmail = await Admin.findOne({ email: _req.body.email });
//         const existingSchool = await Admin.findOne({ schoolName: _req.body.schoolName });

//         if (existingAdminByEmail) {
//             res.send({ message: 'Email already exists' });
//         }
//         else if (existingSchool) {
//             res.send({ message: 'School name already exists' });
//         }
//         else {
//             let result = await admin.save();
//             result.password = undefined;
//             res.send(result);
//         }
//     } catch (err) {
//         res.status(500).json(err);
//     }
// };

// const adminLogIn = async (_req, res) => {
//     if (_req.body.email && _req.body.password) {
//         let admin = await Admin.findOne({ email: _req.body.email });
//         if (admin) {
//             const validated = await bcrypt.compare(_req.body.password, admin.password);
//             if (validated) {
//                 admin.password = undefined;
//                 res.send(admin);
//             } else {
//                 res.send({ message: "Invalid password" });
//             }
//         } else {
//             res.send({ message: "User not found" });
//         }
//     } else {
//         res.send({ message: "Email and password are _required" });
//     }
// };

const adminRegister = async (_req, res) => {
    try {
        const admin = new Admin({
            ..._req.body
        });

        const existingAdminByEmail = await Admin.findOne({ email: _req.body.email });
        const existingSchool = await Admin.findOne({ schoolName: _req.body.schoolName });

        if (existingAdminByEmail) {
            res.send({ message: 'Email already exists' });
        }
        else if (existingSchool) {
            res.send({ message: 'School name already exists' });
        }
        else {
            let result = await admin.save();
            result.password = undefined;
            res.send(result);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const adminLogIn = async (_req, res) => {
    if (_req.body.email && _req.body.password) {
        let admin = await Admin.findOne({ email: _req.body.email });
        if (admin) {
            if (_req.body.password === admin.password) {
                admin.password = undefined;
                res.send(admin);
            } else {
                res.send({ message: "Invalid password" });
            }
        } else {
            res.send({ message: "User not found" });
        }
    } else {
        res.send({ message: "Email and password are _required" });
    }
};

const getAdminDetail = async (_req, res) => {
    try {
        let admin = await Admin.findById(_req.params.id);
        if (admin) {
            admin.password = undefined;
            res.send(admin);
        }
        else {
            res.send({ message: "No admin found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
}

// const deleteAdmin = async (_req, res) => {
//     try {
//         const result = await Admin.findByIdAndDelete(_req.params.id)

//         await Sclass.deleteMany({ school: _req.params.id });
//         await Student.deleteMany({ school: _req.params.id });
//         await Teacher.deleteMany({ school: _req.params.id });
//         await Subject.deleteMany({ school: _req.params.id });
//         await Notice.deleteMany({ school: _req.params.id });
//         await Complain.deleteMany({ school: _req.params.id });

//         res.send(result)
//     } catch (error) {
//         res.status(500).json(err);
//     }
// }

// const updateAdmin = async (_req, res) => {
//     try {
//         if (_req.body.password) {
//             const salt = await bcrypt.genSalt(10)
//             res.body.password = await bcrypt.hash(res.body.password, salt)
//         }
//         let result = await Admin.findByIdAndUpdate(_req.params.id,
//             { $set: _req.body },
//             { new: true })

//         result.password = undefined;
//         res.send(result)
//     } catch (error) {
//         res.status(500).json(err);
//     }
// }

// module.exports = { adminRegister, adminLogIn, getAdminDetail, deleteAdmin, updateAdmin };

module.exports = { adminRegister, adminLogIn, getAdminDetail };
