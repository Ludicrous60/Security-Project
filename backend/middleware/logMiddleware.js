// src/middlewares/logMiddleware.js
import Log from '/models/logModel.js';

const logAction = (action) => async (req, res, next) => {
  try {
    const log = new Log({
      user: req.user ? req.user._id : null, // Log the user ID if available
      action: action,
    });
    await log.save();
  } catch (error) {
    console.error('Failed to log action:', error);
  }
  next();
};

export default logAction;
