import { Request, Response } from "express";
import geminiService from "../services/geminiService";
import Quiz from "../models/Quiz"; // new import
import Course from "../models/Course"; // new import

const generateQuiz = async (req: Request, res: Response): Promise<void> => {
  try {
    const { chaptersId, courseId } = req.body;

    if (!chaptersId) {
      res.status(400).json({ error: "No chapters ID provided." });
      return;
    }

    // Generate quiz questions using Gemini service
    const quizData = await geminiService.generateQuiz(chaptersId);

    // Save the quiz data to the new Quiz collection
    const quizDoc = await Quiz.create({ quizData });

    // Update the course with the new quiz id
    if (courseId) {
      await Course.findByIdAndUpdate(
        courseId,
        { quizId: quizDoc.id },
        { new: true }
      );
    }

    res.json({
      success: true,
      data: quizDoc,
    });
  } catch (error) {
    console.error("Error generating quiz:", error);
    res
      .status(500)
      .json({ error: "An error occurred while generating the quiz." });
  }
};

const fetchQuiz = async (req: Request, res: Response): Promise<void> => {
  try {
    const { quizId } = req.params;

    if (!quizId) {
      res.status(400).json({ error: "No quiz ID provided." });
      return;
    }

    // Fetch quiz questions from the database or service
    const quizQuestions = await geminiService.fetchQuiz(quizId);

    res.json({
      success: true,
      data: quizQuestions,
    });
  } catch (error) {
    console.error("Error fetching quiz:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the quiz." });
  }
};

export default { generateQuiz, fetchQuiz };
