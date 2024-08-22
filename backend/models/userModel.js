import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    passwordHistory: [String], // Array to store previous hashed passwords
    lastPasswordChange: {
      type: Date,
      default: Date.now, // Set to current date on creation
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    lockoutUntil: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Method to match entered password with stored password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to check if a new password is in history
userSchema.methods.checkPasswordHistory = async function (newPassword) {
  for (let i = 0; i < this.passwordHistory.length; i++) {
    const match = await bcrypt.compare(newPassword, this.passwordHistory[i]);
    if (match) {
      return true; // Password matches one in history
    }
  }
  return false; // Password is new
};

// Method to check if the password has expired (e.g., after 90 days)
userSchema.methods.isPasswordExpired = function () {
  const now = Date.now();
  const passwordAge = Math.floor((now - this.lastPasswordChange) / (1000 * 60 * 60 * 24)); // Age in days
  return passwordAge >= 90; // Returns true if password is 90 days or older
};

// Method to check if the account is locked
userSchema.methods.isLocked = function () {
  return this.lockoutUntil && this.lockoutUntil > Date.now();
};

// Method to increment failed login attempts and lock the account if needed
userSchema.methods.incrementFailedLoginAttempts = async function () {
  this.failedLoginAttempts += 1;
  if (this.failedLoginAttempts >= 5) {
    this.lockoutUntil = Date.now() + 10 * 60 * 1000; // 10 minutes lockout
  }
  await this.save();
};

// Method to reset failed login attempts and lockout
userSchema.methods.resetLoginAttempts = async function () {
  this.failedLoginAttempts = 0;
  this.lockoutUntil = null;
  await this.save();
};

// Pre-save hook to handle password hashing and history
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  // Hash new password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  // Manage password history
  if (this.isNew) {
    // If user is new, add the initial password to history
    this.passwordHistory.push(this.password);
  } else {
    // For existing users, manage history
    if (this.passwordHistory.length >= 5) {
      this.passwordHistory.shift(); // Remove oldest password if history size exceeds limit
    }
    this.passwordHistory.push(this.password);
    this.lastPasswordChange = Date.now(); // Update the last password change date
  }

  next();
});

const User = mongoose.model('User', userSchema);
export default User;
