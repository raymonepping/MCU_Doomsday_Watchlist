#!/usr/bin/env python3
"""
Analyze Marvel Multiverse markdown files and compare with current dataset.
Generates reports on:
1. Missing titles in our dataset
2. Chronological order verification
3. Release date verification
4. Earth/Universe designations to add
5. Type and Status fields to add
"""

import json
import re
from pathlib import Path
from typing import Dict, List, Set, Tuple

# File paths
CHRONO_MD = Path("../../medium/marvel_multiverse_chronological_order.md")
RELEASE_MD = Path("../../medium/marvel_multiverse_release_order.md")
WATCHLIST_EN = Path("watchlist.en.json")
WATCHLIST_NL = Path("watchlist.nl.json")
OUTPUT_REPORT = Path("../../medium/multiverse_analysis_report.md")

def parse_markdown_table(md_file: Path) -> List[Dict]:
    """Parse markdown table into list of dictionaries."""
    with open(md_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find the table section
    lines = content.split('\n')
    table_start = None
    for i, line in enumerate(lines):
        if line.startswith('| # | Title |'):
            table_start = i + 2  # Skip header and separator
            break
    
    if table_start is None:
        return []
    
    items = []
    for line in lines[table_start:]:
        if not line.strip() or not line.startswith('|'):
            break
        
        # Parse table row
        parts = [p.strip() for p in line.split('|')[1:-1]]  # Remove empty first/last
        if len(parts) < 6:
            continue
        
        item = {
            'number': parts[0],
            'title': parts[1],
            'placement_or_date': parts[2],
            'earth': parts[3],
            'type': parts[4],
            'status': parts[5]
        }
        items.append(item)
    
    return items

def load_current_dataset() -> Dict:
    """Load current watchlist.en.json."""
    with open(WATCHLIST_EN, 'r', encoding='utf-8') as f:
        return json.load(f)

def normalize_title(title: str) -> str:
    """Normalize title for comparison."""
    # Remove special characters, convert to lowercase
    normalized = title.lower()
    normalized = re.sub(r'[:\-–—]', '', normalized)
    normalized = re.sub(r'\s+', ' ', normalized)
    normalized = normalized.strip()
    return normalized

def find_matching_item(title: str, dataset_items: List[Dict]) -> Dict | None:
    """Find matching item in dataset by title."""
    norm_title = normalize_title(title)
    
    for item in dataset_items:
        if normalize_title(item['title']) == norm_title:
            return item
    
    # Try partial match
    for item in dataset_items:
        dataset_norm = normalize_title(item['title'])
        if norm_title in dataset_norm or dataset_norm in norm_title:
            return item
    
    return None

def extract_earth_designations(md_file: Path) -> Dict[str, str]:
    """Extract Earth designation descriptions from markdown."""
    with open(md_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    designations = {}
    in_section = False
    
    for line in content.split('\n'):
        if '## Multiverse Earth Designations' in line:
            in_section = True
            continue
        
        if in_section:
            if line.startswith('##'):  # Next section
                break
            
            if line.startswith('- **'):
                # Parse: - **Earth-96283**: Description
                match = re.match(r'- \*\*([^*]+)\*\*:\s*(.+)', line)
                if match:
                    earth_id = match.group(1)
                    description = match.group(2)
                    designations[earth_id] = description
    
    return designations

def main():
    print("🔍 Analyzing Marvel Multiverse Data...")
    print("=" * 80)
    
    # Load data
    chrono_items = parse_markdown_table(CHRONO_MD)
    release_items = parse_markdown_table(RELEASE_MD)
    current_data = load_current_dataset()
    current_items = current_data['items']
    earth_designations = extract_earth_designations(CHRONO_MD)
    
    print(f"📊 Loaded {len(chrono_items)} items from chronological order")
    print(f"📊 Loaded {len(release_items)} items from release order")
    print(f"📊 Current dataset has {len(current_items)} items")
    print(f"🌍 Found {len(earth_designations)} Earth designations")
    print()
    
    # Find missing titles
    print("🔎 Identifying missing titles...")
    missing_titles = []
    chrono_titles_set = {normalize_title(item['title']) for item in chrono_items}
    current_titles_set = {normalize_title(item['title']) for item in current_items}
    
    for item in chrono_items:
        if normalize_title(item['title']) not in current_titles_set:
            missing_titles.append(item)
    
    print(f"❌ Found {len(missing_titles)} missing titles")
    print()
    
    # Verify chronological order
    print("🔢 Verifying chronological order...")
    chrono_mismatches = []
    for chrono_item in chrono_items:
        match = find_matching_item(chrono_item['title'], current_items)
        if match:
            chrono_num = int(chrono_item['number'])
            current_order = match.get('chronologicalOrder')
            if current_order and current_order != chrono_num:
                chrono_mismatches.append({
                    'title': chrono_item['title'],
                    'markdown_order': chrono_num,
                    'current_order': current_order
                })
    
    print(f"⚠️  Found {len(chrono_mismatches)} chronological order mismatches")
    print()
    
    # Verify release dates
    print("📅 Verifying release dates...")
    date_mismatches = []
    for release_item in release_items:
        match = find_matching_item(release_item['title'], current_items)
        if match:
            md_date = release_item['placement_or_date']
            current_date = match.get('releaseDate', '')
            if current_date and md_date != current_date:
                date_mismatches.append({
                    'title': release_item['title'],
                    'markdown_date': md_date,
                    'current_date': current_date
                })
    
    print(f"⚠️  Found {len(date_mismatches)} release date mismatches")
    print()
    
    # Generate report
    print("📝 Generating report...")
    report_lines = [
        "# Marvel Multiverse Dataset Analysis Report",
        "",
        f"Generated: {Path(__file__).name}",
        "",
        "## Summary",
        "",
        f"- **Chronological MD items**: {len(chrono_items)}",
        f"- **Release MD items**: {len(release_items)}",
        f"- **Current dataset items**: {len(current_items)}",
        f"- **Missing titles**: {len(missing_titles)}",
        f"- **Chronological order mismatches**: {len(chrono_mismatches)}",
        f"- **Release date mismatches**: {len(date_mismatches)}",
        f"- **Earth designations found**: {len(earth_designations)}",
        "",
        "---",
        "",
        "## 1. Missing Titles",
        "",
        f"These {len(missing_titles)} titles are in the markdown files but not in our dataset:",
        "",
        "| # | Title | Earth/Universe | Type | Status |",
        "|---|---|---|---|---|"
    ]
    
    for item in missing_titles:
        report_lines.append(
            f"| {item['number']} | {item['title']} | {item['earth']} | {item['type']} | {item['status']} |"
        )
    
    report_lines.extend([
        "",
        "---",
        "",
        "## 2. Chronological Order Mismatches",
        "",
        f"These {len(chrono_mismatches)} titles have different chronological order numbers:",
        "",
        "| Title | Markdown Order | Current Order | Action |",
        "|---|---|---|---|"
    ])
    
    for item in chrono_mismatches:
        action = "Update to " + str(item['markdown_order'])
        report_lines.append(
            f"| {item['title']} | {item['markdown_order']} | {item['current_order']} | {action} |"
        )
    
    report_lines.extend([
        "",
        "---",
        "",
        "## 3. Release Date Mismatches",
        "",
        f"These {len(date_mismatches)} titles have different release dates:",
        "",
        "| Title | Markdown Date | Current Date | Action |",
        "|---|---|---|---|"
    ])
    
    for item in date_mismatches:
        action = "Update to " + item['markdown_date']
        report_lines.append(
            f"| {item['title']} | {item['markdown_date']} | {item['current_date']} | {action} |"
        )
    
    report_lines.extend([
        "",
        "---",
        "",
        "## 4. Earth/Universe Designations",
        "",
        "These Earth designations should be added to the dataset:",
        "",
        "| Earth ID | Description |",
        "|---|---|"
    ])
    
    for earth_id, description in sorted(earth_designations.items()):
        report_lines.append(f"| {earth_id} | {description} |")
    
    report_lines.extend([
        "",
        "---",
        "",
        "## 5. New Fields to Add",
        "",
        "### Earth/Universe Field",
        "",
        "Add `earth` field to all items in watchlist.en.json and watchlist.nl.json:",
        "",
        "```json",
        '{',
        '  "earth": "Earth-199999 / Earth-616",',
        '  // or',
        '  "earth": "Earth-96283",',
        '  // or',
        '  "earth": "Netflix Defenders Saga",',
        '  // or',
        '  "earth": "TVA / multiverse"',
        '}',
        "```",
        "",
        "### Type Field",
        "",
        "The `kind` field already exists but should be verified:",
        "- Movie (Film)",
        "- Series",
        "",
        "### Status Field",
        "",
        "Add `status` field with values:",
        "- `[ESSENTIAL]` - Critical for Doomsday understanding",
        "- `Optional` - Supplementary content",
        "",
        "---",
        "",
        "## 6. Recommendations",
        "",
        "1. **Add missing titles gradually** - Focus on [ESSENTIAL] titles first",
        "2. **Update chronological order** - Fix mismatches to match official timeline",
        "3. **Update release dates** - Ensure accuracy for sorting",
        "4. **Add earth field** - Enables multiverse filtering",
        "5. **Add status field** - Helps users prioritize viewing",
        "",
        "## 7. Implementation Priority",
        "",
        "### Phase 1: Data Enhancement (Current Items)",
        "- [ ] Add `earth` field to all 56 current items",
        "- [ ] Add `status` field to all 56 current items",
        "- [ ] Fix chronological order mismatches",
        "- [ ] Fix release date mismatches",
        "",
        "### Phase 2: Missing Essential Titles",
        "- [ ] Add missing [ESSENTIAL] titles (prioritize these)",
        "- [ ] Add poster images for new titles",
        "- [ ] Update saga tags for new titles",
        "",
        "### Phase 3: Optional Content",
        "- [ ] Add remaining Optional titles",
        "- [ ] Complete Netflix Defenders Saga",
        "- [ ] Add future releases (2025-2026)",
        "",
        "---",
        "",
        f"**Report generated**: {OUTPUT_REPORT}",
        ""
    ])
    
    # Write report
    with open(OUTPUT_REPORT, 'w', encoding='utf-8') as f:
        f.write('\n'.join(report_lines))
    
    print(f"✅ Report saved to: {OUTPUT_REPORT}")
    print()
    print("📋 Summary:")
    print(f"   - {len(missing_titles)} missing titles")
    print(f"   - {len(chrono_mismatches)} chronological order fixes needed")
    print(f"   - {len(date_mismatches)} release date fixes needed")
    print(f"   - {len(earth_designations)} Earth designations to add")
    print()
    print("🎯 Next steps:")
    print("   1. Review the report")
    print("   2. Create script to add earth and status fields")
    print("   3. Fix chronological order and release date mismatches")
    print("   4. Gradually add missing titles")

if __name__ == "__main__":
    main()

# Made with Bob
