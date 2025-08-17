const { z } = require("zod");
const createProfileDto = z.object({
  age: z.number().min(0).max(120),
  gender: z.enum(["male", "female", "other"]),
  weight: z.number().min(0).max(1000),
  weightUnit: z.enum(["kg", "lb"]).default("kg"),
  height: z.number().min(0).max(300),
  heightUnit: z.enum(["cm", "ft"]).default("cm"),
  bodyFat: z.enum(["Low", "Normal", "High"]).default("Normal"),
  activityLevel: z
    .enum(["very light", "light", "active", "very active", "extremely active"])
    .default("very light"),
  allergies: z.array(z.string()),
  goal: z.enum(["lose", "maintain", "gain"]),
  preferredDiet: z.string(),
  mealsInDay: z.array(
    z.object({
      mealType: z.enum(["breakfast", "lunch", "dinner", "supper", "snack"]),
      foodCategories: z.array(z.string()),
    })
  ),
  calorieIntake: z.number().min(0).max(10000),
  carbs: z.object({
    from: z
      .number()
      .min(0, { message: "From must be at least 0" })
      .max(1000, { message: "From cannot exceed 1000" }),
    to: z.number().max(1000, { message: "To cannot exceed 1000" }).optional(),
  }),
  fat: z.object({
    from: z
      .number()
      .min(0, { message: "From must be at least 0" })
      .max(1000, { message: "From cannot exceed 1000" }),
    to: z.number().max(1000, { message: "To cannot exceed 1000" }).optional(),
  }),
  protein: z.object({
    from: z
      .number()
      .min(0, { message: "From must be at least 0" })
      .max(1000, { message: "From cannot exceed 1000" }),
    to: z.number().max(1000, { message: "To cannot exceed 1000" }).optional(),
  }),
});

module.exports = {
  createProfileDto,
  updateProfileDto: createProfileDto.partial(), // Allow partial updates
};
