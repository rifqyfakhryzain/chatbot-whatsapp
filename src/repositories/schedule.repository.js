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
  create,
  updateById,
  deleteById,
};
