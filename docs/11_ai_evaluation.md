# AI Evaluation & Metrics

## Evaluation Metrics
- **Accuracy / Truthfulness:** Does the generated answer strictly align with the retrieved context? Measured using LLM-as-a-judge (e.g., GPT-4 evaluating GPT-3.5 outputs).
- **Retrieval Precision & Recall:** How often does the vector database retrieve the correct chunk in the top K results?
- **Hallucination Rate:** Percentage of answers containing claims not present in the source material.

## Business Metrics
- **Time Saved:** Average time to complete an RFP vs. historical manual average.
- **Automation Rate:** Percentage of questions answered with "High" confidence that require zero human edits.
- **Cost per Request:** Total API cost (LLM tokens + Vector DB reads) divided by the number of questions answered. Target: <$0.02 per question.

## User Feedback Loop
- **Thumbs Up / Down:** Simple UI mechanism for users to rate generated answers.
- **Edit Distance:** Track the Levenshtein distance between the AI's draft answer and the user's final submitted answer to implicitly measure quality.
