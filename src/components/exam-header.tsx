import React from "react";

interface ExamHeaderProps {
  title: string;
  topic: string;
  mcqCount: number;
  shortAnswerCount: number;
  totalQuestions: number;
}

export default function ExamHeader({ 
  title, 
  topic, 
  mcqCount, 
  shortAnswerCount, 
  totalQuestions 
}: ExamHeaderProps) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="border-b-2 border-gray-300 pb-6 mb-8 bg-white">
      {/* Institution/Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {title}
        </h1>
        <p className="text-lg text-gray-700 font-medium">
          Subject: {topic}
        </p>
      </div>

      {/* Exam Details */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Date:</span> {currentDate}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Total Questions:</span> {totalQuestions}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Question Types:</span> {mcqCount} MCQ, {shortAnswerCount} Short Answer
          </p>
        </div>
        
        <div className="text-right space-y-1">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Name:</span> _________________________
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Student ID:</span> ____________________
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Time:</span> _______ minutes
          </p>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-2">Instructions:</h3>
        <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
          <li>Read all questions carefully before answering</li>
          <li>For multiple choice questions, select the best answer</li>
          <li>Show all working for calculation questions</li>
          <li>Use the space provided for your answers</li>
        </ul>
      </div>
    </div>
  );
}