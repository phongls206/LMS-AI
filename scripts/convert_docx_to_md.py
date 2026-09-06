import os
import sys
import re
import docx
from docx.oxml.table import CT_Tbl
from docx.oxml.text.paragraph import CT_P
from docx.table import Table
from docx.text.paragraph import Paragraph

def convert_docx_to_md(docx_path, md_path, media_dir):
    sys.stdout.reconfigure(encoding='utf-8')
    print(f"Loading {docx_path}...")
    doc = docx.Document(docx_path)
    
    os.makedirs(media_dir, exist_ok=True)
    
    # 1. Map relationships to media files
    rel_map = {}
    for rel in doc.part.rels.values():
        if 'image' in rel.target_ref:
            img_name = os.path.basename(rel.target_ref)
            target_path = os.path.join(media_dir, img_name)
            with open(target_path, 'wb') as f:
                f.write(rel.target_part.blob)
            rel_map[rel.rId] = f"media/{img_name}"
            
    print(f"Extracted {len(rel_map)} images to {media_dir}")
    
    md_lines = []
    
    def format_run(run):
        text = run.text
        if not text:
            return ""
        # Check bold, italic
        if run.bold and run.italic:
            return f"***{text}***"
        elif run.bold:
            return f"**{text}**"
        elif run.italic:
            return f"*{text}*"
        return text

    def get_paragraph_text_with_formatting(p):
        drawings = p._element.xpath('.//w:drawing')
        images_in_p = []
        if drawings:
            blips = p._element.xpath('.//a:blip/@r:embed')
            for blip in blips:
                if blip in rel_map:
                    images_in_p.append(f"![Hình ảnh]({rel_map[blip]})")
                    
        # Check runs
        full_text = ""
        for r in p.runs:
            full_text += format_run(r)
            
        # Clean up double asterisks around spaces
        full_text = full_text.strip()
        
        return full_text, images_in_p

    def format_paragraph(p):
        style_name = p.style.name.lower()
        raw_text = p.text.strip()
        
        if not raw_text and not p._element.xpath('.//w:drawing'):
            return []
            
        formatted_text, images = get_paragraph_text_with_formatting(p)
        lines = []
        
        # Determine heading level
        heading_level = 0
        if 'heading 1' in style_name:
            heading_level = 1
        elif 'heading 2' in style_name:
            heading_level = 2
        elif 'heading 3' in style_name:
            heading_level = 3
        elif 'heading 4' in style_name:
            heading_level = 4
        elif 'heading 5' in style_name:
            heading_level = 5
        elif style_name in ['title', 'tieude']:
            heading_level = 1
        elif style_name in ['subtitle']:
            heading_level = 2
        elif re.match(r'^(CHƯƠNG|Chương)\s+([0-9IVXLCDM]+)[\s:]', raw_text):
            heading_level = 1
        elif any(raw_text.startswith(f"{i}.{j} ") for i in range(1, 10) for j in range(1, 25)) and (p.runs and any(r.bold for r in p.runs[:2])):
            heading_level = 2
        elif any(raw_text.startswith(f"{i}.{j}.{k} ") for i in range(1, 10) for j in range(1, 25) for k in range(1, 25)) and (p.runs and any(r.bold for r in p.runs[:2])):
            heading_level = 3

        if heading_level > 0:
            # Clean heading text (remove extra bold markdown from heading)
            clean_text = raw_text
            lines.append(f"\n{'#' * heading_level} {clean_text}\n")
        elif 'bullet' in style_name or raw_text.startswith(('•', '–', '- ')):
            clean_item = raw_text.lstrip('•–- ').strip()
            lines.append(f"- {clean_item}")
        elif 'list' in style_name:
            lines.append(f"- {formatted_text}")
        else:
            if formatted_text:
                lines.append(formatted_text)
                
        for img in images:
            lines.append(f"\n{img}\n")
            
        return lines

    def format_table(tbl):
        lines = []
        if not tbl.rows:
            return lines
            
        lines.append("")
        headers = []
        for c in tbl.rows[0].cells:
            t = c.text.strip().replace('\r\n', ' ').replace('\n', ' ').replace('|', '\\|')
            headers.append(t if t else " ")
            
        lines.append("| " + " | ".join(headers) + " |")
        lines.append("| " + " | ".join([":---"] * len(headers)) + " |")
        
        for r in tbl.rows[1:]:
            row_cells = []
            for c in r.cells:
                t = c.text.strip().replace('\r\n', '<br>').replace('\n', '<br>').replace('|', '\\|')
                row_cells.append(t if t else " ")
            # Check length matches header
            if len(row_cells) < len(headers):
                row_cells.extend([" "] * (len(headers) - len(row_cells)))
            elif len(row_cells) > len(headers):
                row_cells = row_cells[:len(headers)]
            lines.append("| " + " | ".join(row_cells) + " |")
            
        lines.append("")
        return lines

    # Iterate body children in sequential order
    for element in doc._element.body:
        if isinstance(element, CT_P):
            p = Paragraph(element, doc)
            p_lines = format_paragraph(p)
            for l in p_lines:
                md_lines.append(l)
        elif isinstance(element, CT_Tbl):
            tbl = Table(element, doc)
            tbl_lines = format_table(tbl)
            for l in tbl_lines:
                md_lines.append(l)

    output_content = "\n".join(md_lines)
    
    with open(md_path, 'w', encoding='utf-8') as f:
        f.write(output_content)
        
    print(f"Successfully converted to {md_path}")
    print(f"Total lines: {len(md_lines)}, File size: {len(output_content.encode('utf-8'))} bytes")

if __name__ == '__main__':
    convert_docx_to_md(
        docx_path=r"d:\MyProjects\lms-ai\docs\design\EnglishCenterTOP.docx",
        md_path=r"d:\MyProjects\lms-ai\docs\design\EnglishCenterTOP.md",
        media_dir=r"d:\MyProjects\lms-ai\docs\design\media"
    )
