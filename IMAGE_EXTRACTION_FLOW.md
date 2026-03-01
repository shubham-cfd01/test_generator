# Image Extraction Flow (Excel & Word)

## Excel (.xlsx)

1. **ZIP parse** – Open xlsx as ZIP, read `xl/media/*` and `xl/drawings/*`
2. **Relationships** – Map rId → media path from `xl/drawings/_rels/*.rels`
3. **Row mapping** – From drawing XML anchors, map image → Excel row (0-based)
4. **Question match** – For each question row, try Excel rows: `i+2, i+1, i+3, i, i+4, i+5` (header = row 1)
5. **Orphans** – If no images matched by row, assign unmatched images to first N questions

## Word (.docx)

1. **ZIP parse** – Open docx as ZIP, read `word/media/*` and `word/_rels/document.xml.rels`
2. **Relationships** – Map rId → media path for image types
3. **Block order** – Walk body: paragraphs (p) and table cells (tbl→tr→tc→p) in document order
4. **Block index** – Each paragraph = one block; same order as python-docx iterator
5. **Question match** – Images in block N belong to the current question at that point
6. **Orphans** – If no block-level images found, collect all images and assign to first N questions

## Image Serving

- **EMF/WMF** – Convert to PNG via ImageMagick (aptPkgs)
- **PNG/JPEG/GIF** – Serve as-is
- **Fallback** – Placeholder if conversion fails
