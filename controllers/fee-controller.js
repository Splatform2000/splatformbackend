const Fee = require('../models/feeSchema');

// Fetch all fees
const feeList = async (_req, res) => {
    try {
        const fees = await Fee.find();
        res.status(200).json(fees);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching fees', error: error.message });
    }
};

// Fetch a single fee by ID
const feeDetail = async (_req, res) => {
    try {
        const fee = await Fee.findById(_req.params.id);
        if (!fee) return res.status(404).json({ message: 'Fee not found' });
        res.status(200).json(fee);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching fee', error: error.message });
    }
};

// Add a new fee
const addFee = async (_req, res) => {
    const { name, class: className, rollNumber, amount } = _req.body;

    const fee = new Fee({
        name,
        class: className,
        rollNumber,
        amount
    });

    try {
        const savedFee = await fee.save();
        res.status(201).json(savedFee);
    } catch (error) {
        res.status(400).json({ message: 'Error adding fee', error: error.message });
    }
};

// Update a fee
const updateFee = async (_req, res) => {
    const { id } = _req.params;
    const updateData = _req.body;

    try {
        const updatedFee = await Fee.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedFee) return res.status(404).json({ message: 'Fee not found' });
        res.status(200).json(updatedFee);
    } catch (error) {
        res.status(400).json({ message: 'Error updating fee', error: error.message });
    }
};

// Delete a fee
const deleteFee = async (_req, res) => {
    try {
        const deletedFee = await Fee.findByIdAndDelete(_req.params.id);
        if (!deletedFee) return res.status(404).json({ message: 'Fee not found' });
        res.status(200).json({ message: 'Fee deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting fee', error: error.message });
    }
};

// Fetch fees by class
const getFeesByClass = async (_req, res) => {
    const { className } = _req.params;
    try {
        const fees = await Fee.find({ class: className });
        res.status(200).json(fees);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching fees by class', error: error.message });
    }
};

module.exports = {
    feeList,
    feeDetail,
    addFee,
    updateFee,
    deleteFee,
    getFeesByClass,
};
