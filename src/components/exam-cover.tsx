import React from "react";

interface ExamCoverProps {
  title: string;
  topic: string;
  mcqCount: number;
  shortAnswerCount: number;
  totalQuestions: number;
  totalMarks?: number;
  duration?: string;
}

export default function ExamCover({ 
  title, 
  topic, 
  mcqCount, 
  shortAnswerCount, 
  totalQuestions,
  totalMarks,
  duration = "2 hours"
}: ExamCoverProps) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Calculate estimated total marks if not provided
  const estimatedMarks = totalMarks || (mcqCount * 2 + shortAnswerCount * 5);

  return (
    <div className="exam-cover bg-white p-8 print:p-6 flex flex-col justify-between print:text-sm page-break-after avoid-break">
      {/* Header */}
      <div>
        <div className="text-center border-b-4 border-gray-800 pb-6 mb-8 print:pb-4 print:mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2 print:text-lg">
            EXAMINATION
          </h2>
          <h3 className="text-xl font-medium text-gray-700 print:text-base">
            {title}
          </h3>
        </div>

        {/* Exam Details Box */}
  <div className="border-2 border-gray-800 p-6 mb-8 print:p-4 print:mb-6 avoid-break">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex justify-between border-b border-gray-300 pb-2">
                <span className="font-semibold">Subject:</span>
                <span className="font-medium">{topic}</span>
              </div>
              <div className="flex justify-between border-b border-gray-300 pb-2">
                <span className="font-semibold">Date:</span>
                <span>{currentDate}</span>
              </div>
              <div className="flex justify-between border-b border-gray-300 pb-2">
                <span className="font-semibold">Duration:</span>
                <span>{duration}</span>
              </div>
              <div className="flex justify-between border-b border-gray-300 pb-2">
                <span className="font-semibold">Total Questions:</span>
                <span>{totalQuestions}</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between border-b border-gray-300 pb-2">
                <span className="font-semibold">Multiple Choice:</span>
                <span>{mcqCount} questions</span>
              </div>
              <div className="flex justify-between border-b border-gray-300 pb-2">
                <span className="font-semibold">Short Answer:</span>
                <span>{shortAnswerCount} questions</span>
              </div>
              <div className="flex justify-between border-b border-gray-300 pb-2">
                <span className="font-semibold">Total Marks:</span>
                <span className="font-bold text-lg">{estimatedMarks}</span>
              </div>
              <div className="flex justify-between border-b border-gray-300 pb-2">
                <span className="font-semibold">Pass Mark:</span>
                <span>{Math.ceil(estimatedMarks * 0.5)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Student Information */}
        <div className="border-2 border-gray-800 p-6 mb-8 print:p-4 print:mb-6 avoid-break">
          <h3 className="text-lg font-bold mb-4 text-center print:text-base print:mb-3">CANDIDATE INFORMATION</h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="font-semibold w-32">Name:</span>
              <div className="flex-1 border-b-2 border-gray-800 h-8"></div>
            </div>
            <div className="flex items-center">
              <span className="font-semibold w-32">Student ID:</span>
              <div className="flex-1 border-b-2 border-gray-800 h-8"></div>
            </div>
            <div className="flex items-center">
              <span className="font-semibold w-32">Signature:</span>
              <div className="flex-1 border-b-2 border-gray-800 h-8"></div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="border-2 border-gray-800 p-6 print:p-4 avoid-break">
          <h3 className="text-lg font-bold mb-4 text-center print:text-base print:mb-3">INSTRUCTIONS TO CANDIDATES</h3>
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-1 gap-3">
              <p><strong>1.</strong> Write your name and student ID clearly in the spaces provided above.</p>
              <p><strong>2.</strong> This examination consists of {totalQuestions} questions in {mcqCount > 0 && shortAnswerCount > 0 ? 'two' : 'one'} section{mcqCount > 0 && shortAnswerCount > 0 ? 's' : ''}:</p>
              {mcqCount > 0 && (
                <p className="ml-6">• Section A: {mcqCount} Multiple Choice Questions</p>
              )}
              {shortAnswerCount > 0 && (
                <p className="ml-6">• Section B: {shortAnswerCount} Short Answer Questions</p>
              )}
              <p><strong>3.</strong> Answer ALL questions in the spaces provided.</p>
              <p><strong>4.</strong> For multiple choice questions, circle the letter of your chosen answer.</p>
              <p><strong>5.</strong> Show all working for calculation questions in the designated areas.</p>
              <p><strong>6.</strong> Use only black or blue pen. Pencil may be used for diagrams only.</p>
              <p><strong>7.</strong> Calculators {Math.random() > 0.5 ? 'are' : 'are not'} permitted for this examination.</p>
              <p><strong>8.</strong> Mobile phones and other electronic devices must be switched off.</p>
              <p><strong>9.</strong> No materials may be taken from the examination room.</p>
              <p><strong>10.</strong> Remain seated until instructed to leave.</p>
            </div>
          </div>
        </div>
      </div>

      {/* No footer branding on print */}
    </div>
  );
}