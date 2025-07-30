 const mongoose= require("mongoose");
 const foodCategorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    image:{ type: String, required: true },
    type: { type: String, required: true,enum: ["breakfast", "lunch", "dinner", "supper","snack"],}
 });