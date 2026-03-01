# Test Series - Data Format

## Question Structure (Scalable)

```json
{
  "subject": "Physics",
  "chapter": "Current Electricity",
  "question_text": "Find the equivalent resistance of the circuit shown.",
  "question_type": "MCQ",
  "difficulty": "Medium",
  "marks": 4,
  "image_url": "/series/image/{test_id}/{q_id}",
  "options": [
    {"text": "2 ohm", "is_correct": false},
    {"text": "4 ohm", "is_correct": true},
    {"text": "6 ohm", "is_correct": false},
    {"text": "8 ohm", "is_correct": false}
  ]
}
```

## Upload Format: ZIP with Excel + Images

```
test.zip
├── questions.xlsx      # Excel with id, type, question, options, answer, diagram, ...
└── images/            # (or diagram/) – folder for diagram images
    └── circuit.png     # same name in diagram column for that row
```

- **Excel** – Required columns: id, type, question, options, answer. Optional: subject, chapter, difficulty, marks, **diagram**
- **Diagram column** – Exact filename (e.g. `circuit.png`). Must match a file in `images/` or `diagram/` inside the ZIP.

## Image Extraction Flow

1. **ZIP parse** – Open upload ZIP, find `.xlsx` and read `diagram/` or `images/` folder
2. **Diagram lookup** – For each row, diagram column value (e.g. `circuit.png`) → lookup in diagram folder
3. **Question match** – Image bytes stored per question id; served at `/series/image/{test_id}/{q_id}`

## Image Serving

- **PNG/JPEG/GIF** – Serve as-is from diagram folder
