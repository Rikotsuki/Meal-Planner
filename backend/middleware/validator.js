const {StatusCodes} = require("http-status-codes")
const validate = (schema) => async (req, res, next) => {
   try {
      await schema.parse(req.body, { abortEarly: false })
      next();
   } catch (error) {
      const original = error.issues;
      const errors = original.reduce((acc, error) => {
      acc[error.path[0] || error.code] = error.message;
      return acc;
    }, {});
      return res.status(StatusCodes.BAD_REQUEST).json(errors)
   }
}

module.exports = validate