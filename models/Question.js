const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  value: { type: String, required: true },
  correct: { type: Boolean, required: true },
});

const questionSchema = new mongoose.Schema({
  value: { type: String, required: true },
  responses: [responseSchema],
});

module.exports = mongoose.model('Question', questionSchema);