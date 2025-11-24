// Frontend-only document parser using browser APIs
import mammoth from "mammoth";

export async function parseDocumentFrontend(file: File): Promise<string> {
  const fileType = file.type;
  const fileName = file.name.toLowerCase();

  try {
    if (fileType === "text/plain" || fileName.endsWith(".txt")) {
      // Text files - read directly
      return await file.text();
    } else if (fileType === "application/pdf" || fileName.endsWith(".pdf")) {
      // Parse PDF using pdfjs-dist (browser-compatible)
      return await parsePDF(file);
    } else if (
      fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      fileName.endsWith(".docx")
    ) {
      // Parse DOCX using mammoth (works in browser)
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value || "";
    } else if (fileType === "application/msword" || fileName.endsWith(".doc")) {
      throw new Error(
        "Legacy Word document (.doc) format is not supported. Please convert to .txt or .docx first."
      );
    } else {
      // Try to read as text anyway
      try {
        return await file.text();
      } catch {
        throw new Error(`Unsupported file type: ${fileType}. Please use a .txt, .pdf, or .docx file.`);
      }
    }
  } catch (error) {
    console.error("Error parsing document:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to parse document: ${errorMessage}`);
  }
}

async function parsePDF(file: File): Promise<string> {
  try {
    // Dynamically import pdfjs-dist (browser version)
    const pdfjsLib = await import("pdfjs-dist");
    
    // Set worker source for pdfjs
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;

    let fullText = "";

    // Extract text from all pages
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(" ");
      fullText += pageText + "\n\n";
    }

    return fullText.trim();
  } catch (error) {
    console.error("PDF parsing error:", error);
    throw new Error(
      `Failed to parse PDF: ${error instanceof Error ? error.message : "Unknown error"}. Please try converting to .txt file.`
    );
  }
}

