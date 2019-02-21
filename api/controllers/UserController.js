/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    login: async function (req, res) {

        if (req.method == "GET") return res.view('user/login');

        if (typeof req.body.username === "undefined") return res.badRequest();
        if (typeof req.body.password === "undefined") return res.badRequest();

        var user = await User.findOne({ username: req.body.username });

        if (!user) {
            res.status(401);
            return res.send("User not found");
        }

        const match = await sails.bcrypt.compare(req.body.password, user.password);

        if (!match) {
            res.status(401);
            return res.send("Wrong Password");
        }

        req.session.regenerate(function (err) {

            if (err) return res.serverError(err);

            req.session.username = req.body.username;

            sails.log("Session: " + JSON.stringify(req.session));

            // return res.json(req.session);

            return res.ok("Login successfully");

        });

    },

    logout: async function (req, res) {

        req.session.destroy(function (err) {

            return res.ok("Log out successfully");
        });
    },

    populate: async function (req, res) {

        if (!['supervises'].includes(req.params.association)) return res.notFound();

        const message = sails.getInvalidIdMsg(req.params);

        if (message) return res.badRequest(message);

        var model = await User.findOne(req.params.id).populate(req.params.association);

        if (!model) return res.notFound();

        return res.json(model);

    },
    
    add: async function (req, res) {

        if (!['supervises'].includes(req.params.association)) return res.notFound();
    
        const message = sails.getInvalidIdMsg(req.params);
    
        if (message) return res.badRequest(message);
    
        if (!await User.findOne(req.params.id)) return res.notFound();
    
        if (req.params.association == "supervises") {
            if (!await Person.findOne(req.params.fk)) return res.notFound();
        }
    
        await User.addToCollection(req.params.id, req.params.association).members(req.params.fk);
    
        return res.ok('Operation completed.');
    
    },

    remove: async function (req, res) {

        if (!['supervises'].includes(req.params.association)) return res.notFound();
    
        const message = sails.getInvalidIdMsg(req.params);
    
        if (message) return res.badRequest(message);
    
        if (!await User.findOne(req.params.id)) return res.notFound();
    
        if (req.params.association == "supervises") {
            if (!await Person.findOne(req.params.fk)) return res.notFound();
        }
    
        await User.removeFromCollection(req.params.id, req.params.association).members(req.params.fk);
    
        return res.ok('Operation completed.');
    
    },

};

