---
name: qa-crosscheck
description: Cross-validates the finished Oneness Record build against facts, theme, accessibility, security and responsiveness. Use before declaring any task complete.
---

# QA cross-check

Run every step and show evidence.

1. Facts: list every number, price, service name and claim on the site, and map each to a line in /content/facts.md. Anything unmapped is removed or flagged.
2. Theme: scan CSS for any color not in tokens.css. List violations.
3. Copy: grep for emojis, em dashes and banned words. Zero results expected.
4. Placeholders: list every data-todo marker and confirm it appears in /docs/open-questions.md.
5. Accessibility: automated audit plus manual keyboard pass and contrast check on every text-on-background pair.
6. Responsive: screenshots at 360, 390, 768, 1280, 1536. Check no horizontal scroll and that the sticky Book bar never covers content.
7. Security: run the web-security-hardening checklist.
8. Performance: Lighthouse mobile, report the four scores and the LCP element.
9. Links and forms: every link resolves, the form rejects bad input and accepts good input.
10. Final report: pass or fail per step, plus anything the agent was unsure about.
