# Giải mù lại R7 — Unit 1 và Unit 4

Thời gian: 2026-10-14 16:00:04 +0700 (lệnh `date`).
Người giải: et-auditor — gpt-6-astra; nhánh `audit/reblind-r7`.
Commit đáp án trước báo cáo: `cfcfde897096ce1f93182570096a3d85d9cecb49`.

Phạm vi: đọc toàn bộ `audit/unit-1.stripped.json` và `audit/unit-4.stripped.json` để lấy ngữ cảnh, chỉ giải và đánh giá tính đơn đáp án của R7. Không đọc các nguồn đáp án bị cấm.

| Câu | Đáp án giải mù | Còn đa đáp án? | Căn cứ |
|---|---|---|---|
| Unit 1 — R7 | B — is hardly ever | Không | “Our project manager is hardly ever late for meetings.” Chủ ngữ số ít dùng “is”; trạng từ tần suất đứng sau “be”. A dùng nguyên thể “be” không có trợ động từ; C sai hòa hợp chủ ngữ; D thiếu động từ hữu hạn. |
| Unit 4 — R7 | D — cleaning | Không | “Before cleaning the keyboard, always switch off and unplug the computer.” “Before + V-ing” có chủ ngữ ngầm “you”, cùng chủ ngữ với câu mệnh lệnh. A và C không tạo cấu trúc đúng sau “before”; B không tạo mệnh đề quá khứ có chủ ngữ, cũng không tạo cấu trúc bị động hợp lệ với tân ngữ “the keyboard”. |

Cả hai câu chỉ có một phương án đúng ngữ pháp trong bốn lựa chọn; `notes` của hai file đáp án để trống. Kiểm tra bằng Python 3: hai file JSON đọc được, đúng cấu trúc yêu cầu và chỉ chứa đáp án R7 — PASS. Chưa đối chiếu đáp án tác giả; et-lead thực hiện đối chiếu và quyết định nhãn `AUDIT-OK`. Kết luận này không thay thế kiểm định toàn đề.
