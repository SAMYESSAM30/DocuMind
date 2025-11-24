import jsPDF from "jspdf";
import { BRDRequirements } from "./types";
import i18n from "./i18n-config";

export function downloadPDF(requirements: BRDRequirements) {
  const lang = i18n.language || "en";
  const t = (key: string) => {
    const [ns, ...path] = key.split(":");
    const keys = path.join(":").split(".");
    let value: any = i18n.getResourceBundle(lang, ns);
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const maxWidth = pageWidth - 2 * margin;
  let yPosition = 20;

  // Helper function to add text with word wrap
  const addText = (text: string, fontSize: number = 12, isBold: boolean = false) => {
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", isBold ? "bold" : "normal");
    
    const lines = doc.splitTextToSize(text, maxWidth);
    
    if (yPosition + lines.length * (fontSize * 0.4) > doc.internal.pageSize.getHeight() - 20) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.text(lines, margin, yPosition);
    yPosition += lines.length * (fontSize * 0.4) + 5;
  };

  // Title
  addText(t("translation:pdf.title"), 20, true);
  yPosition += 5;

  // Metadata
  if (requirements.metadata) {
    addText(`${t("translation:pdf.document")}: ${requirements.metadata.documentName}`, 10);
    addText(`${t("translation:pdf.processed")}: ${new Date(requirements.metadata.processedAt).toLocaleString()}`, 10);
    addText(`${t("translation:pdf.totalRequirements")}: ${requirements.metadata.totalRequirements}`, 10);
    yPosition += 10;
  }

  // Business Requirements Summary
  addText(t("translation:pdf.businessSummary"), 16, true);
  addText(requirements.businessRequirementsSummary || t("translation:pdf.noSummary"), 11);
  yPosition += 10;

  // Functional Requirements
  if (requirements.functionalRequirements.length > 0) {
    doc.addPage();
    yPosition = 20;
    addText(t("translation:pdf.functionalRequirements"), 16, true);
    requirements.functionalRequirements.forEach((req, idx) => {
      addText(`${idx + 1}. ${req.title}`, 12, true);
      addText(req.description, 11);
      if (req.priority) addText(`Priority: ${req.priority}`, 10);
      yPosition += 5;
    });
  }

  // Non-Functional Requirements
  if (requirements.nonFunctionalRequirements.length > 0) {
    doc.addPage();
    yPosition = 20;
    addText(t("translation:pdf.nonFunctionalRequirements"), 16, true);
    requirements.nonFunctionalRequirements.forEach((req, idx) => {
      addText(`${idx + 1}. ${req.title} (${req.type})`, 12, true);
      addText(req.description, 11);
      yPosition += 5;
    });
  }

  // Frontend Requirements
  if (requirements.frontendRequirements.length > 0) {
    doc.addPage();
    yPosition = 20;
    addText(t("translation:pdf.frontendRequirements"), 16, true);
    requirements.frontendRequirements.forEach((req, idx) => {
      addText(`${idx + 1}. ${req.title}`, 12, true);
      addText(req.description, 11);
      if (req.component) addText(`Component: ${req.component}`, 10);
      if (req.page) addText(`Page: ${req.page}`, 10);
      if (req.technology) addText(`Technology: ${req.technology}`, 10);
      yPosition += 5;
    });
  }

  // User Stories
  if (requirements.userStories.length > 0) {
    doc.addPage();
    yPosition = 20;
    addText(t("translation:pdf.userStories"), 16, true);
    requirements.userStories.forEach((story, idx) => {
      addText(`${idx + 1}. ${story.story}`, 12, true);
      addText(`${t("translation:results.acceptanceCriteria")}:`, 11, true);
      story.acceptanceCriteria.forEach((criteria) => {
        addText(`  • ${criteria}`, 10);
      });
      if (story.frontendTasks && story.frontendTasks.length > 0) {
        addText(`${t("translation:results.frontendTasks")}:`, 11, true);
        story.frontendTasks.forEach((task) => {
          addText(`  • ${task}`, 10);
        });
      }
      yPosition += 5;
    });
  }

  // Task Breakdown
  if (requirements.taskBreakdown.length > 0) {
    doc.addPage();
    yPosition = 20;
    addText(t("translation:pdf.tasks"), 16, true);
    requirements.taskBreakdown.forEach((task, idx) => {
      addText(`${idx + 1}. ${task.title}`, 12, true);
      addText(task.description, 11);
      addText(`${t("translation:results.priority")}: ${task.priority}`, 10);
      if (task.estimatedHours) addText(`${t("translation:results.estimatedHours")}: ${task.estimatedHours}h`, 10);
      if (task.frontendComponent) addText(`Component: ${task.frontendComponent}`, 10);
      yPosition += 5;
    });
  }

  // Save PDF
  const filename = requirements.metadata?.documentName
    ? `${requirements.metadata.documentName.replace(/\.[^/.]+$/, "")}_analysis.pdf`
    : "brd_analysis.pdf";
  doc.save(filename);
}

