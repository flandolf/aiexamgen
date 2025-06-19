import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: "Helvetica",
  },
  question: {
    marginBottom: 10,
  },
  workingLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    borderBottomStyle: "solid",
    marginBottom: 12,
    height: 20,
  },
});

interface ExamPdfProps {
  content: string;
  linesPerQuestion?: number; // Number of blank lines per question
}

export function ExamPdf({ content, linesPerQuestion = 3 }: ExamPdfProps) {
  // Split content into questions by double newlines (paragraphs)
  const questions = content.split(/\n{2,}/);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {questions.map((question, i) => (
          <View key={i} style={{ marginBottom: 24 }}>
            {/* Question text */}
            <Text style={styles.question}>{question.trim()}</Text>

            {/* Blank working lines */}
            {[...Array(linesPerQuestion)].map((_, idx) => (
              <View key={idx} style={styles.workingLine} />
            ))}
          </View>
        ))}
      </Page>
    </Document>
  );
}
