const prisma = require("../config/prisma");

const findByPhoneNumber = async (phoneNumber) => {
  return await prisma.user.findUnique({
    where: {
      phoneNumber,
    },
  });
};

const findById = async (id) => {
  return await prisma.user.findUnique({
    where: {
      id,
    },
  });
};

const updateTravelDuration = async (userId, travelDuration) => {
  return await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      travelDuration,
    },
  });
};

module.exports = {
  findByPhoneNumber,
  findById,
  updateTravelDuration,
};

