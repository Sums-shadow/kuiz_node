const express = require('express');
const router = express.Router();
const questionController = require('../controllers/question.controller');
const auth = require('../middleware/auth');

router.post('/', auth, questionController.createQuestion);
router.get('/', questionController.getQuestions);
router.get('/:id', questionController.getQuestion);
router.put('/:id', auth, questionController.updateQuestion);
router.delete('/:id', auth, questionController.deleteQuestion);

module.exports = router;