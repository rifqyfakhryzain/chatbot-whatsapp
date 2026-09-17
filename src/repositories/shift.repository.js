const prisma = require("../config/prisma");

async function findAll() {
  return await prisma.shift.findMany({
    orderBy: {
      code: "asc",
    },
  });
}

async function findByCode(code) {
  return await prisma.shift.findUnique({
    where: {
      code,
    },
  });
}

async function create(data) {
  return await prisma.shift.create({
    data,
  });
}

async function updateByCode(code, data) {
  return await prisma.shift.update({
    where: {
      code,
    },
    data,
  });
}

async function deleteByCode(code) {
  return await prisma.shift.delete({
    where: {
      code,
    },
  });
}

module.exports = {
  findAll,
  findByCode,
  updateByCode,
  deleteByCode,
  create,
};
