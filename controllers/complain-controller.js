const Complain = require('../models/complainSchema.js');

const complainCreate = async (_req, res) => {
    try {
        const complain = new Complain(_req.body)
        const result = await complain.save()
        res.send(result)
    } catch (err) {
        res.status(500).json(err);
    }
};

const complainList = async (_req, res) => {
    try {
        let complains = await Complain.find({ school: _req.params.id }).populate("user", "name");
        if (complains.length > 0) {
            res.send(complains)
        } else {
            res.send({ message: "No complains found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports = { complainCreate, complainList };
