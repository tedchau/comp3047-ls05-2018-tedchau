// isAdmin.js
module.exports = async function (req, res, proceed) {

    const username = req.session.username || null;

    if (username=='admin') {
        return proceed();   //proceed to the next policy,
    }

    //--•
    // Otherwise, this request did not come from a logged-in user.
    return res.forbidden();

};