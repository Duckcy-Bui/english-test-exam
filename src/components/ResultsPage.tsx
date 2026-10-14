"use client";

import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import { findAttempt, type SavedAttempt } from "../client/history";
import {
  SCORING,
  type McqQuestion,
  type WritingGrade,
  type SpeakingGrade,
} from "../types/exam";
import {
  SKILLS,
  type ExamResult,
  type QuestionReview,
  type Skill,
} from "../types/app";
import {
  EmptyState,
  formatDate,
  Icon,
  Loading,
  skillIcons,
  skillNames,
  SourceBadge,
} from "./ui";

function Corrections({
  corrections,
}: {
  corrections: { original: string; corrected: string; note: string }[];
}) {
  if (!corrections.length)
    return <p className="quiet-note">Không có lỗi cụ thể được đề xuất sửa.</p>;
  return (
    <div className="correction-list">
      {corrections.map((correction, index) => (
        <div key={index}>
          <p className="correction-original">{correction.original}</p>
          <p className="correction-corrected">
            <Icon name="arrow" />
            {correction.corrected}
          </p>
          <p>{correction.note}</p>
        </div>
      ))}
    </div>
  );
}

function Rubric({
  rows,
}: {
  rows: { label: string; score: number; max: number }[];
}) {
  return (
    <div className="rubric-grid">
      {rows.map((row) => (
        <div className="rubric-item" key={row.label}>
          <span>{row.label}</span>
          <strong>
            {row.score.toFixed(2)}{" "}
            <small>
              / {row.max.toFixed(3).replace(/0+$/, "").replace(/\.$/, "")}
            </small>
          </strong>
          <div className="progress-track">
            <span style={{ width: `${(row.score / row.max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function WritingFeedback({ grade }: { grade: WritingGrade }) {
  return (
    <>
      <h3 className="review-subheading">Tiêu chí chấm email</h3>
      <Rubric
        rows={[
          {
            label: "Đủ các bước",
            score: grade.email.steps,
            max: SCORING.writing.email.steps,
          },
          {
            label: "Bố cục email",
            score: grade.email.layout,
            max: SCORING.writing.email.layout,
          },
          {
            label: "Ngữ pháp",
            score: grade.email.grammar,
            max: SCORING.writing.email.grammar,
          },
          {
            label: "Từ vựng",
            score: grade.email.vocabulary,
            max: SCORING.writing.email.vocabulary,
          },
        ]}
      />
      <p className="word-counter">Email: {grade.email.wordCount} từ</p>
      <div className="feedback-box">
        <Icon name="spark" />
        <div>
          <h3>Nhận xét cho email</h3>
          <p>{grade.email.feedback}</p>
        </div>
      </div>
      <h3 className="review-subheading">Sửa lỗi trong email</h3>
      <Corrections corrections={grade.email.corrections} />
    </>
  );
}

function SpeakingFeedback({ grade }: { grade: SpeakingGrade }) {
  return (
    <>
      <Rubric
        rows={[
          {
            label: "Hoàn thành nhiệm vụ",
            score: grade.task,
            max: SCORING.speaking.task,
          },
          {
            label: "Ngữ pháp của Unit",
            score: grade.unitGrammar,
            max: SCORING.speaking.unitGrammar,
          },
          {
            label: "Từ vựng chuyên ngành",
            score: grade.vocabulary,
            max: SCORING.speaking.vocabulary,
          },
          {
            label: "Trôi chảy và mạch lạc",
            score: grade.fluency,
            max: SCORING.speaking.fluency,
          },
        ]}
      />
      <p className="pronunciation-status">
        <Icon name={grade.pronunciationAssessed ? "check" : "mic"} />
        {grade.pronunciationAssessed
          ? "Đã xét phát âm từ bản ghi âm."
          : "Chưa đánh giá phát âm."}
      </p>
      <div className="feedback-box">
        <Icon name="spark" />
        <div>
          <h3>Nhận xét cho bài nói</h3>
          <p>{grade.feedback}</p>
        </div>
      </div>
      <h3 className="review-subheading">Gợi ý sửa cách diễn đạt</h3>
      <Corrections corrections={grade.corrections} />
    </>
  );
}

function promptFor(
  result: ExamResult,
  id: string,
): { stem: string; options?: McqQuestion["options"] } | undefined {
  for (const part of result.review.listening?.parts ?? []) {
    const question = part.questions.find((question) => question.id === id);
    if (question)
      return {
        stem: question.stem,
        ...(question.kind === "mcq" ? { options: question.options } : {}),
      };
  }
  const reading = result.review.reading;
  if (reading) {
    const matching = reading.matching.items.find((item) => item.id === id);
    if (matching) return { stem: matching.term };
    const mcq = [
      ...reading.grammar,
      ...reading.vocabulary,
      ...reading.passageMcq.questions,
    ].find((question) => question.id === id);
    if (mcq) return { stem: mcq.stem, options: mcq.options };
    const tf = reading.passageTrueFalse.questions.find(
      (question) => question.id === id,
    );
    if (tf) return { stem: tf.statement };
  }
  return undefined;
}

function AnswerReview({
  question,
  result,
}: {
  question: QuestionReview;
  result: ExamResult;
}) {
  const prompt = promptFor(result, question.id);
  const label = (answer: string) => {
    const option = prompt?.options?.find((option) => option.id === answer);
    return option
      ? `${answer}. ${option.text}`
      : answer === "T"
        ? "True"
        : answer === "F"
          ? "False"
          : answer || "Bỏ trống";
  };
  return (
    <details
      className={`answer-review ${question.correct ? "correct" : "incorrect"}`}
    >
      <summary>
        <span className="review-status">
          <Icon name={question.correct ? "check" : "pen"} />
        </span>
        <span>
          <strong>{question.id}</strong> {prompt?.stem ?? "Câu hỏi"}
        </span>
        <span className="question-points">
          {question.score.toFixed(2)} điểm
        </span>
      </summary>
      <div className="answer-review-body">
        {prompt?.options && (
          <ul className="review-options">
            {prompt.options.map((option) => (
              <li key={option.id}>
                {option.id}. {option.text}
              </li>
            ))}
          </ul>
        )}
        <div className="answer-comparison">
          <div>
            <small>BẠN CHỌN</small>
            <p>{label(question.answer)}</p>
          </div>
          <div>
            <small>ĐÁP ÁN ĐÚNG</small>
            <p>{label(question.correctAnswer)}</p>
          </div>
        </div>
        <p className="answer-explanation">
          <strong>Giải thích:</strong> {question.explanation}
        </p>
      </div>
    </details>
  );
}

function ObjectiveReview({
  skill,
  result,
}: {
  skill: "listening" | "reading";
  result: ExamResult;
}) {
  const questions = result.skills[skill]?.questions ?? [];
  return (
    <>
      <p className="review-summary">
        Đúng {questions.filter((question) => question.correct).length}/
        {questions.length} câu. Mở từng câu để xem đáp án và giải thích.
      </p>
      {questions.map((question) => (
        <AnswerReview key={question.id} question={question} result={result} />
      ))}
      {skill === "listening" &&
        result.review.listening?.parts.map((part) => (
          <details className="reference-panel" key={part.id}>
            <summary>
              <Icon name="headphones" />
              Lời thoại Listening · Part {part.id}
            </summary>
            <div>
              {part.script.map((line, index) => (
                <p key={index}>
                  <strong>{line.speaker}:</strong> {line.text}
                </p>
              ))}
            </div>
          </details>
        ))}
      {skill === "reading" && result.review.reading && (
        <>
          <details className="reference-panel">
            <summary>
              <Icon name="book" />
              Các định nghĩa bài nối
            </summary>
            <div>
              {result.review.reading.matching.definitions.map((definition) => (
                <p key={definition.id}>
                  <strong>{definition.id}.</strong> {definition.text}
                </p>
              ))}
            </div>
          </details>
          {[
            result.review.reading.passageMcq.passage,
            result.review.reading.passageTrueFalse.passage,
          ].map((passage, index) => (
            <details className="reference-panel" key={index}>
              <summary>
                <Icon name="book" />
                Bài đọc {index + 1}
                {passage.title ? ` · ${passage.title}` : ""}
              </summary>
              <div>
                {passage.paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </details>
          ))}
        </>
      )}
    </>
  );
}

export function ResultsPage({ resultId }: { resultId: string }) {
  const [attempt, setAttempt] = useState<SavedAttempt | null>(null);
  const [ready, setReady] = useState(false);
  const [unsaved, setUnsaved] = useState(false);
  const [activeSkill, setActiveSkill] = useState<Skill>("listening");
  useEffect(() => {
    const saved = findAttempt(resultId);
    setAttempt(saved);
    setReady(true);
    setUnsaved(new URLSearchParams(window.location.search).has("unsaved"));
    if (saved)
      setActiveSkill(
        SKILLS.find((skill) => saved.result.skills[skill]) ?? "listening",
      );
  }, [resultId]);
  if (!ready) return <Loading />;
  if (!attempt)
    return (
      <EmptyState title="Không tìm thấy kết quả trên trình duyệt này">
        <p>
          Kết quả có thể đã bị xoá, hoặc bạn đang dùng một trình duyệt khác.
        </p>
        <Link href="/history" className="button primary">
          Xem lịch sử
          <Icon name="arrow" />
        </Link>
      </EmptyState>
    );
  const { result, answers } = attempt;
  const selectedResult = result.skills[activeSkill];
  const scopeSkills = SKILLS.filter((skill) => result.skills[skill]);
  const max = result.scope === "full" ? 10 : 2.5;
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">HOÀN THÀNH MỘT BƯỚC TIẾN</p>
          <h1>Kết quả làm bài</h1>
          <p>
            Unit {result.unit} · {result.unitTitle} · Đề {result.testId} <span>·</span>{" "}
            {formatDate(result.submittedAt)}
          </p>
          <SourceBadge source={result.source} />
        </div>
        <Link href="/history" className="button secondary">
          <Icon name="chart" />
          Xem lịch sử
        </Link>
      </div>
      {result.mock && (
        <div className="warning-notice" role="status">
          <strong>Kết quả chấm mô phỏng.</strong> Nhận xét Writing và Speaking
          dùng để thử ứng dụng; chưa phản ánh năng lực thực tế của bạn.
        </div>
      )}
      {unsaved && (
        <div className="warning-notice" role="status">
          Trình duyệt chưa cho phép lưu lịch sử. Bạn vẫn có thể xem kết quả
          trong trang này.
        </div>
      )}
      <section className="results-overview">
        <div className="total-score">
          <div
            className="score-ring"
            style={
              {
                "--score-angle": `${(result.total / max) * 360}deg`,
              } as CSSProperties
            }
          >
            <div>
              <strong>{result.total.toFixed(2)}</strong>
              <span>/ {max === 10 ? "10" : "2,50"}</span>
            </div>
          </div>
          <div>
            <p className="eyebrow">
              {result.scope === "full"
                ? "TỔNG ĐIỂM"
                : `ĐIỂM ${skillNames[result.scope].toUpperCase()}`}
            </p>
            <h2>
              {result.mock
                ? "Bạn đã hoàn thành bài thử!"
                : result.total / max >= 0.8
                  ? "Một kết quả đáng khích lệ!"
                  : "Mỗi lần làm bài, một lần tiến bộ."}
            </h2>
            <p>
              {result.mode === "exam" ? "Thi thử" : "Luyện tập"} ·{" "}
              {result.scope === "full"
                ? "Đủ 4 kỹ năng"
                : skillNames[result.scope]}
            </p>
          </div>
        </div>
        <div className="score-breakdown">
          {scopeSkills.map((skill) => (
            <button
              key={skill}
              className={`score-skill ${activeSkill === skill ? "selected" : ""}`}
              onClick={() => setActiveSkill(skill)}
            >
              <span className={`skill-icon skill-${skill}`}>
                <Icon name={skillIcons[skill]} />
              </span>
              <div>
                <span>{skillNames[skill]}</span>
                <strong>
                  {result.skills[skill]!.score.toFixed(2)} <small>/ 2,50</small>
                </strong>
              </div>
              <Icon name="arrow" />
            </button>
          ))}
        </div>
      </section>
      <div className="section-heading">
        <div>
          <p className="eyebrow">HIỂU KẾT QUẢ CỦA BẠN</p>
          <h2>Đáp án & nhận xét</h2>
        </div>
        <p>Chọn kỹ năng để xem chi tiết.</p>
      </div>
      <nav className="result-tabs" aria-label="Chi tiết kết quả">
        {scopeSkills.map((skill) => (
          <button
            key={skill}
            className={skill === activeSkill ? "active" : ""}
            aria-pressed={skill === activeSkill}
            onClick={() => setActiveSkill(skill)}
          >
            <Icon name={skillIcons[skill]} />
            {skillNames[skill]}
          </button>
        ))}
      </nav>
      <section className="review-panel">
        <div className="review-title">
          <h2>{skillNames[activeSkill]}</h2>
          <span>{selectedResult?.score.toFixed(2)} / 2,50 điểm</span>
        </div>
        {(activeSkill === "listening" || activeSkill === "reading") && (
          <ObjectiveReview skill={activeSkill} result={result} />
        )}
        {activeSkill === "writing" && (
          <>
            {result.review.writing?.translation.items.map((item) => {
              const grade = selectedResult?.writing?.translations.find(
                (grade) => grade.id === item.id,
              );
              return (
                <article className="translation-review" key={item.id}>
                  <h3>
                    <span className="question-id">{item.id}</span>
                    {item.source}
                    <span>{grade?.score.toFixed(2)} / 0,25</span>
                  </h3>
                  <div className="answer-comparison">
                    <div>
                      <small>BẢN DỊCH CỦA BẠN</small>
                      <p>
                        {answers?.writing.translations[item.id] || "Bỏ trống"}
                      </p>
                    </div>
                    <div>
                      <small>BẢN DỊCH THAM KHẢO</small>
                      <p>{item.referenceTranslation}</p>
                    </div>
                  </div>
                  <p>{grade?.feedback}</p>
                </article>
              );
            })}
            {selectedResult?.writing && (
              <WritingFeedback grade={selectedResult.writing} />
            )}
            {answers?.writing.email && (
              <details className="reference-panel">
                <summary>
                  <Icon name="pen" />
                  Email bạn đã nộp
                </summary>
                <div>
                  <p className="preserve-text">{answers.writing.email}</p>
                </div>
              </details>
            )}
            {result.review.writing && (
              <details className="reference-panel">
                <summary>
                  <Icon name="book" />
                  Email mẫu tham khảo
                </summary>
                <div>
                  <p className="preserve-text">
                    {result.review.writing.email.modelAnswer}
                  </p>
                </div>
              </details>
            )}
          </>
        )}
        {activeSkill === "speaking" && (
          <>
            {selectedResult?.speaking && (
              <SpeakingFeedback grade={selectedResult.speaking} />
            )}
            {Object.entries(answers?.speaking ?? {})
              .filter(([, answer]) => answer.text.trim())
              .map(([id, answer]) => (
                <details className="reference-panel" key={id}>
                  <summary>
                    <Icon name="mic" />
                    Bản chữ bạn đã nộp · {id}
                  </summary>
                  <div>
                    <p className="preserve-text">{answer.text}</p>
                  </div>
                </details>
              ))}
            {result.review.speaking?.parts
              .filter((part) => part.kind !== "questions")
              .map((part) => (
                <details className="reference-panel" key={part.id}>
                  <summary>
                    <Icon name="book" />
                    Bài nói mẫu · Part {part.id.substring(1)}
                  </summary>
                  <div>
                    <h3>{part.prompt}</h3>
                    <p className="preserve-text">{part.sampleAnswer}</p>
                  </div>
                </details>
              ))}
          </>
        )}
      </section>
      <div className="results-actions">
        <Link href={`/unit/${result.unit}`} className="button primary">
          Tiếp tục luyện Unit {result.unit}
          <Icon name="arrow" />
        </Link>
        <Link href="/" className="button secondary">
          Chọn Unit khác
        </Link>
      </div>
    </>
  );
}
