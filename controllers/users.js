const User = require('../models/user')
const Advertisement = require('../models/advirtisement')
const Organization = require('../models/oraganization')



exports.addLike = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const advertisementId = req.params.advertisementId;
        const user = await User.findById(userId)
        if (!user) {
            return res.status(400).json({
                message: "bad request"
            })
        }
        const advirtisement = await Advertisement.findById(advertisementId);
        if (!advirtisement) {
            return res.status(404).json({
                message: "not founded"
            })
        }
        let x = 0;
        advirtisement.likes.forEach(like => {
            if (like.user) {
                if (req.user.id.toString() === like.user.toString()) {
                    x = 1
                }
            }
        });
        if (x == 1) {
            return res.status(400).json({
                message: "already liked"
            })
        }

        if (!advirtisement.likes[0]) {
            advirtisement.likes.unshift({ number: 1 })
            advirtisement.likes.push({ user: userId })
            await advirtisement.save();
        } else {
            var newNumber = advirtisement.likes[0].number;
            newNumber = newNumber + 1;
            advirtisement.likes[0].number = newNumber;
            advirtisement.likes.push({ user: userId })
            await advirtisement.save();

        }
        res.status(200).json({
            message: "like added",
            advirtisement
        })
    }
    catch (error) {
        res.status(500).json({ error })
    }
}


exports.addFollow = async (req, res, next) => {
    try {
        const organizationId =req.params.id;
        const organization = await Organization.findById(req.params.id);
        if (!organization) {
            return res.status(404).json({
                message: "not found"
            })
        }
        let x = 0;
        organization.followers.forEach(follow => {
            if (req.user.id.toString() === follow.toString()) {
                x = 1;
            }
        });
        if (x === 1) {
            return res.status(400).json({
                message: "already follow"
            })
        }
        organization.followers.push(req.user.id);
        await organization.save();
        res.status(200).json({
            message: "sucess",
            organization
        })
    }
    catch (error) {
        res.status(500).json({ error })
    }
}




exports.deleteLike = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const advertisementId = req.params.advertisementId;
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({
                message: "not found"
            })
        }
        const advirtisement = await Advertisement.findById(advertisementId);
        if (!advirtisement) {
            return res.status(404).json({
                message: "not founded"
            })
        }
        if (advirtisement.likes[0].number === 0) {
            return res.status(404).json({
                message: "no likes found"
            })
        }

        let x = 0;
        advirtisement.likes.forEach(like => {
            if (like.user) {
                if (req.user.id.toString() === like.user.toString()) {
                    x = 1
                }
            }
        })
        if (x === 0) {
            return res.status(404).json({
                message: "no likes found"
            })
        }

        var newNumber = advirtisement.likes[0].number;
        newNumber = newNumber - 1;
        advirtisement.likes[0].number = newNumber;
        advirtisement.likes = advirtisement.likes.filter(function (like) {
            if (like.user) {
                return req.user.id.toString() !== like.user.toString()
            }
        });
        await advirtisement.save();

        res.status(200).json({
            message: "like deleted",
            advirtisement
        })
    }
    catch (error) {
        res.status(500).json({ error })
    }
}




exports.deleteFollow = async (req, res, next) => {
    try {
        const organizationId = req.params.id;
        const organization = await Organization.findById(organizationId);
        if (!organization) {
            return res.status(404).json({
                message: "not found"
            })
        }
        let x = 0;
        organization.followers.forEach(follow => {
            if (req.user.id.toString() === follow.toString()) {
                x = 1;
            }
        });
        if (x === 0) {
            return res.status(404).json({
                message: "no follow found"
            })
        }
        organization.followers = organization.followers.filter(function (follow) {
            return req.user.id.toString() !== follow.toString()
        });

        await organization.save();
        res.status(200).json({
            message: "sucess",
            organization
        })
    }
    catch (error) {
        res.status(500).json({ error })
    }
}
