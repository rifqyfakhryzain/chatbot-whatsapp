const prisma = require("../config/prisma");

const findAll = async () => {
  return await prisma.schedule.findMany();
};

const findById = async (id) => {
  return await prisma.schedule.findUnique({
    where: {
      id,
    },
  });
};

const findByUserAndDate = async (userId, date) => {
  return await prisma.schedule.findFirst({
    where: {
      userId,
      date,
    },
    include: {
      shift: true,
    },
  });
};

const findByUserAndDateRange = async (userId, startDate, endDate) => {
  return await prisma.schedule.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lt: endDate,
      },
    },
    include: {
      shift: true,
    },
    orderBy: {
      date: "asc",
    },
  });
};

const create = async (data) => {
  return await prisma.schedule.create({
    data,
  });
};

const updateById = async (id, data) => {
  return await prisma.schedule.update({
    where: {
      id,
    },
    data,
  });
};

const deleteById = async (id) => {
  return await prisma.schedule.delete({
    where: {
      id,
    },
  });
};

module.exports = {
  findAll,
  findById,
  findByUserAndDate,
  findByUserAndDateRange,
  create,
  updateById,
  deleteById,
};
