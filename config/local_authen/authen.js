module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error_msg", "Please log in to view that resource");
    res.redirect("/login");

    // console.log(req.username);

  },
  forwardAuthenticated: function (req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    if (req.user.priority == 1) {
      res.redirect("/index");
    } else if (req.user.priority == 2) {
      res.redirect("/indexuser");
    }
  }
};
