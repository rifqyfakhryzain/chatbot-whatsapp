const userRepository = require("../repositories/user.repository");

const getUserByPhoneNumber = async (phoneNumber) => {
  return await userRepository.findByPhoneNumber(phoneNumber);
};

module.exports = {
  getUserByPhoneNumber,
};
