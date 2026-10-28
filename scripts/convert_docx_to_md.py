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
            if not os.path.exists(target_path):
                with open(target_path, 'wb') as f:
                    f.write(rel.target_part.blob)
            rel_map[rel.rId] = f"media/{img_name}"
            
    print(f"Extracted/Mapped {len(rel_map)} images to {media_dir}")
    
    md_lines = []
    
    def format_run(run):
        text = run.text
        if not text:
            return ""
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
                    
        full_text = ""
        for child in p._element:
            tag = child.tag.split('}')[-1]
            if tag == 'r':
                r = docx.text.run.Run(child, p)
                full_text += format_run(r)
            elif tag == 'hyperlink':
                rId = child.attrib.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id')
                link_url = ""
                if rId and rId in doc.part.rels:
                    link_url = doc.part.rels[rId].target_ref
                link_text = ""
                for sub_r in child.findall('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}r'):
                    r = docx.text.run.Run(sub_r, p)
                    link_text += format_run(r)
                if link_url and not link_url.startswith('#'):
                    full_text += f"[{link_text}]({link_url})"
                else:
                    full_text += link_text
            
        full_text = full_text.strip()
        return full_text, images_in_p

    def format_paragraph(p):
        style_name = p.style.name.lower()
        raw_text = p.text.strip()
        
        # Skip table of figures paragraphs that are just Word-generated bookmark lines
        if p.style.name == 'table of figures':
            return []
            
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
        elif raw_text in ['MỤC LỤC', 'KẾ HOẠCH CHI TIẾT', 'LỜI GIỚI THIỆU']:
            heading_level = 1
        elif re.match(r'^\d+\.\d+\.\d+\.?\s+', raw_text):
            heading_level = 3
        elif re.match(r'^\d+\.\d+\.?\s+', raw_text):
            heading_level = 2

        if heading_level > 0:
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
            
        # Check if it's a 1x1 code block table
        if len(tbl.rows) == 1 and len(tbl.columns) == 1:
            code_text = tbl.rows[0].cells[0].text.strip()
            if 'FROM node' in code_text or 'Dockerfile' in code_text:
                lang = 'dockerfile'
            elif code_text.startswith('version:') or 'services:' in code_text:
                lang = 'yaml'
            elif 'docker compose' in code_text or 'npm run' in code_text or 'npx prisma' in code_text:
                lang = 'bash'
            else:
                lang = 'text'
            lines.append("")
            lines.append(f"```{lang}")
            lines.append(code_text)
            lines.append("```")
            lines.append("")
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
            if len(row_cells) < len(headers):
                row_cells.extend([" "] * (len(headers) - len(row_cells)))
            elif len(row_cells) > len(headers):
                row_cells = row_cells[:len(headers)]
            lines.append("| " + " | ".join(row_cells) + " |")
            
        lines.append("")
        return lines

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
        docx_path=r"docs\design\EnglishCenterTOP.docx",
        md_path=r"docs\design\EnglishCenterTOP.md",
        media_dir=r"docs\design\media"
    )
