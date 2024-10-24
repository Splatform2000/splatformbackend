const Notice = require('../models/noticeSchema.js');

const noticeCreate = async (_req, res) => {
    try {
        const notice = new Notice({
            ..._req.body,
            school: _req.body.adminID
        })
        const result = await notice.save()
        res.send(result)
    } catch (err) {
        res.status(500).json(err);
    }
};

const noticeList = async (_req, res) => {
    try {
        let notices = await Notice.find({ school: _req.params.id })
        if (notices.length > 0) {
            res.send(notices)
        } else {
            res.send({ message: "No notices found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const updateNotice = async (_req, res) => {
    try {
        const result = await Notice.findByIdAndUpdate(_req.params.id,
            { $set: _req.body },
            { new: true })
        res.send(result)
    } catch (error) {
        res.status(500).json(error);
    }
}

const deleteNotice = async (_req, res) => {
    try {
        const result = await Notice.findByIdAndDelete(_req.params.id)
        res.send(result)
    } catch (error) {
        res.status(500).json(err);
    }
}

const deleteNotices = async (_req, res) => {
    try {
        const result = await Notice.deleteMany({ school: _req.params.id })
        if (result.deletedCount === 0) {
            res.send({ message: "No notices found to delete" })
        } else {
            res.send(result)
        }
    } catch (error) {
        res.status(500).json(err);
    }
}

module.exports = { noticeCreate, noticeList, updateNotice, deleteNotice, deleteNotices };