class Session {
  constructor() {

  }

  static reset(req) {
    // Custom "reset" for session (req.session.destroy() doesn't work)
    req.session.login_views = 0
  }

  static incrementViews(req, viewName) {
    if (req.session[`${viewName}_views`]) {
      req.session[`${viewName}_views`]++
    } else {
      req.session[`${viewName}_views`] = 1
    }
  }

  static getViews(req, viewName) {
    return req.session[`${viewName}_views`]
  }
}

module.exports = {
  Session: Session
}