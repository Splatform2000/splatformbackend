const bcrypt = require('bcrypt');
const Student = require('../models/studentSchema.js');
const Subject = require('../models/subjectSchema.js');

const studentRegister = async (_req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(_req.body.password, salt);

        const existingStudent = await Student.findOne({
            rollNum: _req.body.rollNum,
            school: _req.body.adminID,
            sclassName: _req.body.sclassName,
        });

        if (existingStudent) {
            res.send({ message: 'Roll Number already exists' });
        }
        else {
            const student = new Student({
                ..._req.body,
                school: _req.body.adminID,
                password: hashedPass
            });

            let result = await student.save();

            result.password = undefined;
            res.send(result);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const studentLogIn = async (_req, res) => {
    try {
        let student = await Student.findOne({ rollNum: _req.body.rollNum, name: _req.body.studentName });
        if (student) {
            const validated = await bcrypt.compare(_req.body.password, student.password);
            if (validated) {
                student = await student.populate("school", "schoolName")
                student = await student.populate("sclassName", "sclassName")
                student.password = undefined;
                student.examResult = undefined;
                student.attendance = undefined;
                res.send(student);
            } else {
                res.send({ message: "Invalid password" });
            }
        } else {
            res.send({ message: "Student not found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getStudents = async (_req, res) => {
    try {
        let students = await Student.find({ school: _req.params.id }).populate("sclassName", "sclassName");
        if (students.length > 0) {
            let modifiedStudents = students.map((student) => {
                return { ...student._doc, password: undefined };
            });
            res.send(modifiedStudents);
        } else {
            res.send({ message: "No students found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getStudentDetail = async (_req, res) => {
    try {
        let student = await Student.findById(_req.params.id)
            .populate("school", "schoolName")
            .populate("sclassName", "sclassName")
            .populate("examResult.subName", "subName")
            .populate("attendance.subName", "subName sessions");
        if (student) {
            student.password = undefined;
            res.send(student);
        }
        else {
            res.send({ message: "No student found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
}

const deleteStudent = async (_req, res) => {
    try {
        const result = await Student.findByIdAndDelete(_req.params.id)
        res.send(result)
    } catch (error) {
        res.status(500).json(err);
    }
}

const deleteStudents = async (_req, res) => {
    try {
        const result = await Student.deleteMany({ school: _req.params.id })
        if (result.deletedCount === 0) {
            res.send({ message: "No students found to delete" })
        } else {
            res.send(result)
        }
    } catch (error) {
        res.status(500).json(err);
    }
}

const deleteStudentsByClass = async (_req, res) => {
    try {
        const result = await Student.deleteMany({ sclassName: _req.params.id })
        if (result.deletedCount === 0) {
            res.send({ message: "No students found to delete" })
        } else {
            res.send(result)
        }
    } catch (error) {
        res.status(500).json(err);
    }
}

const updateStudent = async (_req, res) => {
    try {
        if (_req.body.password) {
            const salt = await bcrypt.genSalt(10)
            res.body.password = await bcrypt.hash(res.body.password, salt)
        }
        let result = await Student.findByIdAndUpdate(_req.params.id,
            { $set: _req.body },
            { new: true })

        result.password = undefined;
        res.send(result)
    } catch (error) {
        res.status(500).json(error);
    }
}

const updateExamResult = async (_req, res) => {
    const { subName, marksObtained } = _req.body;

    try {
        const student = await Student.findById(_req.params.id);

        if (!student) {
            return res.send({ message: 'Student not found' });
        }

        const existingResult = student.examResult.find(
            (result) => result.subName.toString() === subName
        );

        if (existingResult) {
            existingResult.marksObtained = marksObtained;
        } else {
            student.examResult.push({ subName, marksObtained });
        }

        const result = await student.save();
        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const studentAttendance = async (_req, res) => {
    const { subName, status, date } = _req.body;

    try {
        const student = await Student.findById(_req.params.id);

        if (!student) {
            return res.send({ message: 'Student not found' });
        }

        const subject = await Subject.findById(subName);

        const existingAttendance = student.attendance.find(
            (a) =>
                a.date.toDateString() === new Date(date).toDateString() &&
                a.subName.toString() === subName
        );

        if (existingAttendance) {
            existingAttendance.status = status;
        } else {
            // Check if the student has already attended the maximum number of sessions
            const attendedSessions = student.attendance.filter(
                (a) => a.subName.toString() === subName
            ).length;

            if (attendedSessions >= subject.sessions) {
                return res.send({ message: 'Maximum attendance limit reached' });
            }

            student.attendance.push({ date, status, subName });
        }

        const result = await student.save();
        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const clearAllStudentsAttendanceBySubject = async (_req, res) => {
    const subName = _req.params.id;

    try {
        const result = await Student.updateMany(
            { 'attendance.subName': subName },
            { $pull: { attendance: { subName } } }
        );
        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const clearAllStudentsAttendance = async (_req, res) => {
    const schoolId = _req.params.id

    try {
        const result = await Student.updateMany(
            { school: schoolId },
            { $set: { attendance: [] } }
        );

        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const removeStudentAttendanceBySubject = async (_req, res) => {
    const studentId = _req.params.id;
    const subName = _req.body.subId

    try {
        const result = await Student.updateOne(
            { _id: studentId },
            { $pull: { attendance: { subName: subName } } }
        );

        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};


const removeStudentAttendance = async (_req, res) => {
    const studentId = _req.params.id;

    try {
        const result = await Student.updateOne(
            { _id: studentId },
            { $set: { attendance: [] } }
        );

        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};


module.exports = {
    studentRegister,
    studentLogIn,
    getStudents,
    getStudentDetail,
    deleteStudents,
    deleteStudent,
    updateStudent,
    studentAttendance,
    deleteStudentsByClass,
    updateExamResult,

    clearAllStudentsAttendanceBySubject,
    clearAllStudentsAttendance,
    removeStudentAttendanceBySubject,
    removeStudentAttendance,
};