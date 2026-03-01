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
- **Diagram column** – Filename(s): `circuit.png` or `img1.png|img2.png` (pipe/comma separated for multiple). Extension optional if unique.

## Image Extraction Flow

1. **ZIP parse** – Open upload ZIP, find `.xlsx` and read `diagram/` or `images/` folder
2. **Diagram lookup** – For each row, diagram column value(s) → lookup in folder (tries .png, .jpg, .jpeg, .gif, etc. if no extension)
3. **Resize** – Very large (>800px) or small (<150px) images auto-resized to standard size
4. **Question match** – Image bytes stored per question id; served at `/series/image/{test_id}/{q_id}`

## Supported Formats

PNG, JPEG, JPG, GIF, WEBP, BMP, TIFF, TIF
