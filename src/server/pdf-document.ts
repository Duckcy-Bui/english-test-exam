import type { McqQuestion, Passage, UnitExam } from "@/types/exam";

/** Escape all exam content before inserting it into the printable document. */
function escapeHtml(value: string | number): string {
  const entities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return String(value).replace(/[&<>"']/g, (character) => entities[character]);
}

function instructions(value: string): string {
  return `<p class="instructions">${escapeHtml(value)}</p>`;
}

function bullets(values: readonly string[]): string {
  return `<ul class="cues">${values.map((value) => `<li>${escapeHtml(value)}</li>`).join("")}</ul>`;
}

function ruledLines(count: number): string {
  return `<div class="ruled-lines" aria-label="Space for your answer">${"<div class=\"ruled-line\">&nbsp;</div>".repeat(count)}</div>`;
}

function mcq(question: McqQuestion): string {
  return `<div class="question"><p class="stem"><strong>${escapeHtml(question.id)}.</strong> ${escapeHtml(question.stem)}</p>
    <ul class="options">${question.options.map((option) => `<li><strong>${escapeHtml(option.id)}.</strong> ${escapeHtml(option.text)}</li>`).join("")}</ul></div>`;
}

function passage(value: Passage): string {
  return `<div class="passage">${value.title ? `<h4>${escapeHtml(value.title)}</h4>` : ""}${value.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}</div>`;
}

function answer(id: string, prompt: string, correct: string, explanation: string): string {
  return `<div class="answer"><p class="stem"><strong>${escapeHtml(id)}.</strong> ${escapeHtml(prompt)}</p>
    <p class="correct"><strong>Answer:</strong> ${escapeHtml(correct)}</p>
    <p class="explanation"><strong>Giải thích:</strong> ${escapeHtml(explanation)}</p></div>`;
}

function mcqAnswer(question: McqQuestion): string {
  const selected = question.options.find((option) => option.id === question.answerKey);
  return answer(question.id, question.stem, `${question.answerKey}${selected ? ` — ${selected.text}` : ""}`, question.explanation);
}

function listeningExam(exam: UnitExam, listenUrl: string, qrSvg: string): string {
  // The caller generates this SVG with the QR library; exam strings never supply markup.
  const link = /^https?:\/\//i.test(listenUrl)
    ? `<a href="${escapeHtml(listenUrl)}">${escapeHtml(listenUrl)}</a>`
    : escapeHtml(listenUrl);
  return `<section class="skill"><h2>Listening <span>2.5 points</span></h2>
    <div class="listen-link"><div class="qr">${qrSvg}</div><div><strong>Scan to listen to Unit ${escapeHtml(exam.unit)}, Test ${escapeHtml(exam.testId)}</strong><p>Open the link, enter your access code, and play the recordings.</p><p class="url">${link}</p></div></div>
    ${exam.listening.parts.map((part) => `<section class="part"><div class="part-lead"><h3>Part ${escapeHtml(part.id)}</h3>${instructions(part.instructions)}<p class="context">${escapeHtml(part.context)}</p></div>
      ${part.questions.map((question) => question.kind === "mcq" ? mcq(question) : `<div class="question"><p class="stem"><strong>${escapeHtml(question.id)}.</strong> ${escapeHtml(question.stem)}</p><p class="short-answer"><span>Answer (maximum ${escapeHtml(question.maxWords)} words):</span> <span class="answer-line">&nbsp;</span></p></div>`).join("")}</section>`).join("")}</section>`;
}

function readingExam(exam: UnitExam): string {
  const reading = exam.reading;
  return `<section class="skill"><h2>Reading <span>2.5 points · 30 questions</span></h2>
    <section class="part matching"><h3>Part 1A: Matching (R1–R5)</h3>${instructions(reading.matching.instructions)}
      <div class="definitions">${reading.matching.definitions.map((definition) => `<p><strong>${escapeHtml(definition.id)}.</strong> ${escapeHtml(definition.text)}</p>`).join("")}</div>
      ${reading.matching.items.map((item) => `<p class="matching-item"><strong>${escapeHtml(item.id)}.</strong> ${escapeHtml(item.term)} <span class="match-line">________</span></p>`).join("")}</section>
    <section class="part"><h3>Part 1B: Grammar (R6–R12)</h3>${instructions("Choose the best answer, A, B, C or D.")}${reading.grammar.map(mcq).join("")}</section>
    <section class="part"><h3>Part 1C: Vocabulary (R13–R20)</h3>${instructions("Choose the best answer, A, B, C or D.")}${reading.vocabulary.map(mcq).join("")}</section>
    <section class="part"><h3>Part 2A: Reading comprehension (R21–R25)</h3>${instructions(reading.passageMcq.instructions)}${passage(reading.passageMcq.passage)}${reading.passageMcq.questions.map(mcq).join("")}</section>
    <section class="part"><h3>Part 2B: True / False (R26–R30)</h3>${instructions(reading.passageTrueFalse.instructions)}${passage(reading.passageTrueFalse.passage)}
      ${reading.passageTrueFalse.questions.map((question) => `<div class="question"><p class="stem"><strong>${escapeHtml(question.id)}.</strong> ${escapeHtml(question.statement)}</p><p class="tf-options">□ True &nbsp;&nbsp;&nbsp; □ False</p></div>`).join("")}</section></section>`;
}

function writingExam(exam: UnitExam): string {
  const writing = exam.writing;
  return `<section class="skill"><h2>Writing <span>2.5 points</span></h2>
    <section class="part"><h3>Part A: Translation (W31–W35)</h3>${instructions(writing.translation.instructions)}
      ${writing.translation.items.map((item) => `<div class="question translation"><p class="stem"><strong>${escapeHtml(item.id)}.</strong> ${escapeHtml(item.source)}</p>${ruledLines(2)}</div>`).join("")}</section>
    <section class="part email-task"><h3>Part B: Instruction email</h3>${instructions(writing.email.task)}${bullets(writing.email.bullets)}
      <p><strong>Required language:</strong> ${writing.email.targetGrammar.map(escapeHtml).join("; ")}.</p>
      <p class="word-limit"><strong>Write ${escapeHtml(writing.email.wordRange[0])}–${escapeHtml(writing.email.wordRange[1])} words in the body:</strong> count from the greeting through the signature; exclude From / To / Date / Subject.</p>
      <div class="email-frame"><p class="email-field">From: <span class="fill">&nbsp;</span></p><p class="email-field">To: ${escapeHtml(writing.email.recipient)}</p><p class="email-field">Date: <span class="fill">&nbsp;</span></p><p class="email-field">Subject: <span class="fill">&nbsp;</span></p>
        <p class="email-greeting">Hi / Dear ${escapeHtml(writing.email.recipient)},</p>
        <p class="email-step">It should be quite easy to <span class="fill">&nbsp;</span>.</p>
        ${["First", "Then", "Next", "After that", "Finally"].map((step) => `<p class="email-step">${step}, <span class="fill">&nbsp;</span>.</p>`).join("")}
        <p class="email-step">Don't forget to <span class="fill">&nbsp;</span> when you've finished.</p>
        <p class="email-signoff">Best wishes,</p><p class="signature-line">[Full name] <span class="fill">&nbsp;</span></p><p class="signature-line">[Job title] <span class="fill">&nbsp;</span></p><p class="signature-line">[Department] <span class="fill">&nbsp;</span></p>
      </div></section></section>`;
}

function speaking(exam: UnitExam, kind: "exam" | "answers"): string {
  return `<section class="skill"><h2>Speaking <span>2.5 points</span></h2>
    ${kind === "answers" ? `<p class="sample-note">Các bài mẫu là gợi ý tham khảo, không phải đáp án đúng duy nhất. Part 1 có câu hỏi mở và không có bài mẫu trong bộ dữ liệu.</p>` : ""}
    ${exam.speaking.parts.map((part, index) => `<section class="part speaking-part"><h3>Part ${index + 1} (${escapeHtml(part.id)})</h3>${instructions(part.instructions)}
      ${part.kind === "questions"
        ? `<p class="timing">Suggested time: ${escapeHtml(part.secondsPerQuestion)} seconds per question.</p><ol class="speaking-questions">${part.questions.map((question) => `<li>${escapeHtml(question)}</li>`).join("")}</ol>`
        : `<p class="timing">Suggested time: ${escapeHtml(part.seconds)} seconds.</p><p class="prompt">${escapeHtml(part.prompt)}</p>${bullets(part.cues)}<p><strong>Required language:</strong> ${part.requiredGrammar.map(escapeHtml).join("; ")}.</p>${kind === "answers" ? `<h4>Sample response</h4><div class="sample">${escapeHtml(part.sampleAnswer)}</div>` : ""}`}</section>`).join("")}</section>`;
}

function listeningAnswers(exam: UnitExam): string {
  return `<section class="skill"><h2>Listening: answers and transcripts</h2>${exam.listening.parts.map((part) => `<section class="part"><h3>Part ${escapeHtml(part.id)}</h3><p class="context">${escapeHtml(part.context)}</p>
    ${part.questions.map((question) => question.kind === "mcq" ? mcqAnswer(question) : answer(question.id, question.stem, question.acceptedAnswers.join(" / "), question.explanation)).join("")}
    <h4>Listening transcript — Part ${escapeHtml(part.id)}</h4><div class="transcript">${part.script.map((line) => `<p><strong>${escapeHtml(line.speaker)}:</strong> ${escapeHtml(line.text)}</p>`).join("")}</div></section>`).join("")}</section>`;
}

function readingAnswers(exam: UnitExam): string {
  const reading = exam.reading;
  return `<section class="skill"><h2>Reading: answers and explanations</h2>
    <section class="part"><h3>Matching (R1–R5)</h3>${reading.matching.items.map((item) => {
      const definition = reading.matching.definitions.find((value) => value.id === item.answerKey);
      return answer(item.id, item.term, `${item.answerKey}${definition ? ` — ${definition.text}` : ""}`, item.explanation);
    }).join("")}</section>
    <section class="part"><h3>Grammar (R6–R12)</h3>${reading.grammar.map(mcqAnswer).join("")}</section>
    <section class="part"><h3>Vocabulary (R13–R20)</h3>${reading.vocabulary.map(mcqAnswer).join("")}</section>
    <section class="part"><h3>Reading comprehension (R21–R25)</h3>${reading.passageMcq.questions.map(mcqAnswer).join("")}</section>
    <section class="part"><h3>True / False (R26–R30)</h3>${reading.passageTrueFalse.questions.map((question) => answer(question.id, question.statement, question.answerKey === "T" ? "T — True" : "F — False", question.explanation)).join("")}</section></section>`;
}

function writingAnswers(exam: UnitExam): string {
  return `<section class="skill"><h2>Writing: reference answers</h2><p class="sample-note">Bản dịch và email dưới đây là mẫu tham khảo. Các cách diễn đạt khác đúng ý và đúng yêu cầu vẫn được chấp nhận.</p>
    <section class="part"><h3>Translation (W31–W35)</h3>${exam.writing.translation.items.map((item) => `<div class="answer"><p class="stem"><strong>${escapeHtml(item.id)}.</strong> ${escapeHtml(item.source)}</p><p><strong>Bản dịch tham khảo:</strong> ${escapeHtml(item.referenceTranslation)}</p></div>`).join("")}</section>
    <section class="part email-answers"><h3>Instruction email to ${escapeHtml(exam.writing.email.recipient)}</h3>${instructions(exam.writing.email.task)}${bullets(exam.writing.email.bullets)}<h4>Model email</h4><div class="sample email-model">${escapeHtml(exam.writing.email.modelAnswer)}</div></section></section>`;
}

const styles = `
  @font-face { font-family: "Exam Sans"; src: local("DejaVu Sans"); font-weight: 400; }
  @font-face { font-family: "Exam Sans"; src: local("DejaVu Sans Bold"); font-weight: 700; }
  @page { size: A4; margin: 15mm 14mm 16mm; }
  * { box-sizing: border-box; }
  html { color: #111; background: #fff; }
  body { margin: 0; font: 10pt/1.45 "Exam Sans", "DejaVu Sans", Arial, sans-serif; overflow-wrap: anywhere; }
  p, ul, ol { margin: 0 0 2.4mm; }
  p, li { orphans: 2; widows: 2; }
  h1, h2, h3, h4 { margin: 0; break-after: avoid; page-break-after: avoid; }
  h1 { font-size: 15pt; line-height: 1.3; text-align: center; }
  h2 { padding-bottom: 2mm; margin-bottom: 4mm; border-bottom: 1.2pt solid #222; font-size: 14pt; line-height: 1.3; }
  h2 span { float: right; font-size: 9pt; font-weight: 400; padding-top: 2pt; }
  h3 { font-size: 11pt; margin-bottom: 2.5mm; }
  h4 { font-size: 10pt; margin: 4mm 0 2mm; }
  .document-header { margin-bottom: 6mm; }
  .metadata { display: flex; gap: 4mm; justify-content: center; flex-wrap: wrap; margin: 3mm 0; }
  .source-label { border: 1pt solid #555; padding: 0.3mm 2mm; font-weight: 700; }
  .document-kind { text-align: center; font-weight: 700; font-size: 11pt; }
  .candidate { display: flex; gap: 8mm; margin-top: 5mm; }
  .candidate span { flex: 1; }
  .skill + .skill { break-before: page; page-break-before: always; }
  .part { margin-bottom: 5mm; }
  .part-lead { break-inside: avoid; page-break-inside: avoid; break-after: avoid; page-break-after: avoid; }
  .instructions { font-weight: 700; white-space: pre-line; break-after: avoid; page-break-after: avoid; }
  .context, .timing { color: #333; break-after: avoid; page-break-after: avoid; }
  .question, .answer, .matching { break-inside: avoid; page-break-inside: avoid; }
  .question { margin-bottom: 3.5mm; }
  .stem, .prompt, .explanation { white-space: pre-line; }
  .options { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 0 4mm; list-style: none; padding: 0 0 0 5mm; margin-bottom: 0; }
  .options li { margin-bottom: 0.6mm; }
  .answer { margin-bottom: 4mm; }
  .answer p { margin-bottom: 1.3mm; }
  .definitions { margin-bottom: 4mm; padding: 3mm; border: 0.7pt solid #777; }
  .matching-item { margin-bottom: 2mm; }
  .match-line { margin-left: 3mm; }
  .passage { margin: 3mm 0 4mm; padding: 0 3mm; border-left: 1.5pt solid #bbb; }
  .passage h4 { margin-top: 0; }
  .passage p { text-align: justify; }
  .tf-options { margin-left: 5mm; }
  .short-answer { display: flex; gap: 3mm; margin-left: 5mm; }
  .answer-line { flex: 1; border-bottom: 0.7pt solid #777; }
  .ruled-line { min-height: 7mm; border-bottom: 0.5pt solid #aaa; }
  .ruled-lines { margin: 0 0 3mm; }
  .translation { margin-bottom: 4mm; }
  .translation .stem { margin-bottom: 0; }
  .email-frame { border: 0.8pt solid #888; padding: 4mm; margin: 4mm 0 3mm; break-inside: avoid; page-break-inside: avoid; }
  .email-field, .email-step, .signature-line { display: flex; gap: 2mm; align-items: baseline; min-height: 7mm; margin: 0; }
  .fill { flex: 1; min-width: 10mm; border-bottom: 0.5pt solid #aaa; }
  .email-greeting { margin: 4mm 0 2mm; }
  .email-signoff { margin: 4mm 0 1mm; }
  .cues { padding-left: 6mm; }
  .cues li { margin-bottom: 1mm; }
  .speaking-questions { padding-left: 6mm; }
  .speaking-questions li { margin-bottom: 4mm; break-inside: avoid; }
  .listen-link { display: flex; gap: 5mm; align-items: center; padding: 3mm; border: 0.8pt solid #777; margin-bottom: 5mm; break-inside: avoid; }
  .listen-link > div:last-child { min-width: 0; flex: 1; }
  .listen-link p { margin-top: 1.5mm; margin-bottom: 0; }
  .qr { width: 31mm; height: 31mm; flex: 0 0 31mm; }
  .qr svg { width: 100%; height: 100%; display: block; }
  .url, a { color: #111; overflow-wrap: anywhere; }
  .sample { white-space: pre-wrap; border-left: 1.5pt solid #999; padding-left: 3mm; }
  .email-task, .email-answers, .email-model, .speaking-part { break-inside: avoid; page-break-inside: avoid; }
  .sample-note { margin-bottom: 4mm; }
  .transcript p { white-space: pre-line; break-inside: avoid; page-break-inside: avoid; }
  .word-limit { margin-top: 3mm; }
  @media screen { body { max-width: 182mm; margin: 15mm auto; } .skill + .skill { margin-top: 12mm; } }
`;

/**
 * Produce a complete HTML document for Chromium's A4 PDF renderer.
 * qrSvg must be SVG produced by the server's QR generator, never user input.
 * Only explicitly selected fields are rendered; sourceNotes stay internal.
 */
export function renderPdfDocument(exam: UnitExam, kind: "exam" | "answers", listenUrl: string, qrSvg: string): string {
  const title = `PRACTICE TEST FOR INFORMATION TECHNOLOGY — UNIT ${exam.unit}: ${exam.unitTitle} | TEST ${exam.testId}`;
  const sourceLabel = exam.source === "teacher" ? "Đề cô" : "Đề AI";
  const content = kind === "exam"
    ? listeningExam(exam, listenUrl, qrSvg) + readingExam(exam) + writingExam(exam) + speaking(exam, kind)
    : listeningAnswers(exam) + readingAnswers(exam) + writingAnswers(exam) + speaking(exam, kind);
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(title)} — ${kind === "exam" ? "Exam" : "Answers"}</title><style>${styles}</style></head>
    <body><header class="document-header"><h1>${escapeHtml(title)}</h1><div class="metadata"><span class="source-label">${sourceLabel}</span><span>Time allowed: 90 minutes</span></div><p class="document-kind">${kind === "exam" ? "QUESTION PAPER — FOUR SKILLS" : "ANSWER KEY &amp; REFERENCE RESPONSES"}</p>${kind === "exam" ? `<div class="candidate"><span>Name: ______________________________</span><span>Class: ____________________</span></div>` : ""}</header><main>${content}</main></body></html>`;
}
