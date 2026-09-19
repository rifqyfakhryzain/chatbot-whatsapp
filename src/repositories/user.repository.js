const prisma = require("../config/prisma");

const findByPhoneNumber = async (phoneNumber) => {
  return await prisma.user.findUnique({
    where: {
      phoneNumber,
    },
  });
};

module.exports = {
  findByPhoneNumber,
};
