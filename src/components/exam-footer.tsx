import React from "react";

interface ExamFooterProps {
  pageNumber?: number;
  totalPages?: number;
  examTitle?: string;
}

export default function ExamFooter({ 
  pageNumber = 1, 
  totalPages = 1, 
  examTitle = "Examination" 
}: ExamFooterProps) {
  return (
    <div className="hidden print:block fixed bottom-0 left-0 right-0 bg-white border-t-2 border-black p-4">
      <div className="flex justify-between items-center text-xs">
        <span>{examTitle}</span>
        <span>Page {pageNumber} of {totalPages}</span>
        <span>Turn over</span>
      </div>
    </div>
  );
}