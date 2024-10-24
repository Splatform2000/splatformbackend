const Sclass = require('../models/sclassSchema.js');
const Student = require('../models/studentSchema.js');
const Subject = require('../models/subjectSchema.js');
const Teacher = require('../models/teacherSchema.js');

// Create a new class
const sclassCreate = async (req, res) => {
    try {
        const { sclassName, adminID } = req.body;

        const existingSclassByName = await Sclass.findOne({
            sclassName,
            school: adminID
        });

        if (existingSclassByName) {
            return res.status(400).json({ message: 'Sorry, this class name already exists' });
        }

        const sclass = new Sclass({
            sclassName,
            school: adminID
        });

        const result = await sclass.save();
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ message: 'Error creating class', error: err.message });
    }
};

// List all classes
const sclassList = async (req, res) => {
    try {
        const sclasses = await Sclass.find({ school: req.params.id });

        if (sclasses.length > 0) {
            return res.status(200).json(sclasses);
        } else {
            return res.status(404).json({ message: "No classes found" });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error fetching classes', error: err.message });
    }
};

// Get details of a specific class
const getSclassDetail = async (req, res) => {
    try {
        const sclass = await Sclass.findById(req.params.id).populate("school", "schoolName");

        if (sclass) {
            return res.status(200).json(sclass);
        } else {
            return res.status(404).json({ message: "No class found" });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error fetching class details', error: err.message });
    }
};

// Get all students in a specific class
const getSclassStudents = async (req, res) => {
    try {
        const students = await Student.find({ sclassName: req.params.id });

        if (students.length > 0) {
            const modifiedStudents = students.map(student => {
                return { ...student._doc, password: undefined };
            });
            return res.status(200).json(modifiedStudents);
        } else {
            return res.status(404).json({ message: "No students found" });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error fetching students', error: err.message });
    }
};

// Delete a specific class
const deleteSclass = async (req, res) => {
    try {
        const deletedClass = await Sclass.findByIdAndDelete(req.params.id);
        
        if (!deletedClass) {
            return res.status(404).json({ message: "Class not found" });
        }

        await Promise.all([
            Student.deleteMany({ sclassName: req.params.id }),
            Subject.deleteMany({ sclassName: req.params.id }),
            Teacher.deleteMany({ teachSclass: req.params.id })
        ]);

        return res.status(200).json({ message: 'Class and associated records deleted successfully', deletedClass });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting class', error: error.message });
    }
};

// Delete all classes for a specific school
const deleteSclasses = async (req, res) => {
    try {
        const deletedClasses = await Sclass.deleteMany({ school: req.params.id });

        if (deletedClasses.deletedCount === 0) {
            return res.status(404).json({ message: "No classes found to delete" });
        }

        await Promise.all([
            Student.deleteMany({ school: req.params.id }),
            Subject.deleteMany({ school: req.params.id }),
            Teacher.deleteMany({ school: req.params.id })
        ]);

        return res.status(200).json({ message: 'All classes and associated records deleted successfully', deletedClasses });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting classes', error: error.message });
    }
};

module.exports = {
    sclassCreate,
    sclassList,
    getSclassDetail,
    getSclassStudents,
    deleteSclass,
    deleteSclasses,
};
