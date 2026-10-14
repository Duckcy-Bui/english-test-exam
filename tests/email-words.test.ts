import assert from "node:assert/strict";
import { test } from "node:test";
import { countEmailWords, emailBody } from "../src/types/exam";

test("email word count skips the From/To/Date/Subject header lines only", () => {
  const email = [
    "From: Nguyen Minh Anh",
    "To: Tom",
    "Date: 25th November",
    "Subject: Setting up a new computer",
    "",
    "Hi Tom,",
    "First, unpack it.",
    "Best wishes,",
    "Anh",
  ].join("\n");
  assert.equal(countEmailWords(email), 8);
  assert.ok(!emailBody(email).includes("Subject"));
  // Chữ "to" hay "date" giữa câu không bị coi là dòng đầu thư.
  assert.equal(countEmailWords("Remember to check the date: it matters."), 7);
});
