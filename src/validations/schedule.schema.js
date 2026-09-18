const { z } = require("zod");
const scheduleSchema = z.object({
  userId: z.string(),
  shiftId: z.string(),
  date: z.coerce.date(),
});

module.exports = {
  scheduleSchema,
};
