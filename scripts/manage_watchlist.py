#!/usr/bin/env python3
"""
MCU Doomsday Watchlist Management Tool

Easily add, edit, reorder, and validate watchlist entries.
"""

import argparse
import json
import shutil
import subprocess
import sys
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional


# Paths
REPO_ROOT = Path(__file__).resolve().parents[1]
WATCHLIST_EN = REPO_ROOT / "reader" / "data" / "watchlist.en.json"
WATCHLIST_NL = REPO_ROOT / "reader" / "data" / "watchlist.nl.json"
POSTER_DIR = REPO_ROOT / "reader" / "assets" / "posters"


def load_watchlist(path: Path) -> Dict[str, Any]:
    """Load watchlist JSON file."""
    return json.loads(path.read_text(encoding="utf-8"))


def save_watchlist(path: Path, data: Dict[str, Any]) -> None:
    """Save watchlist JSON file with proper formatting."""
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def get_next_key(data: Dict[str, Any]) -> str:
    """Get the next available key number."""
    items = data.get("items", [])
    max_key = 0
    for item in items:
        key = item.get("key", "0")
        if key.startswith("B"):
            continue
        try:
            num = int(key)
            max_key = max(max_key, num)
        except ValueError:
            continue
    return str(max_key + 1)


def validate_watchlist(data: Dict[str, Any]) -> List[str]:
    """Validate watchlist structure and return list of errors."""
    errors = []
    
    if "items" not in data:
        errors.append("Missing 'items' array")
        return errors
    
    items = data["items"]
    keys_seen = set()
    chrono_orders = []
    
    for idx, item in enumerate(items):
        # Check required fields
        required = ["key", "title", "kind", "runtime", "bonus", "phase"]
        for field in required:
            if field not in item:
                errors.append(f"Item {idx}: Missing required field '{field}'")
        
        # Check duplicate keys
        key = item.get("key")
        if key in keys_seen:
            errors.append(f"Duplicate key: {key}")
        keys_seen.add(key)
        
        # Check chronological order
        if "chronologicalOrder" in item:
            chrono_orders.append((key, item["chronologicalOrder"]))
    
    # Check chronological order sequence
    chrono_orders.sort(key=lambda x: x[1])
    for i, (key, order) in enumerate(chrono_orders):
        if i > 0 and order == chrono_orders[i-1][1]:
            errors.append(f"Duplicate chronologicalOrder {order}: keys {chrono_orders[i-1][0]} and {key}")
    
    # Check count
    main_count = sum(1 for item in items if not item.get("bonus", False))
    bonus_count = sum(1 for item in items if item.get("bonus", False))
    
    if data.get("count") != main_count:
        errors.append(f"Count mismatch: JSON says {data.get('count')}, actual is {main_count}")
    
    if data.get("bonusCount") != bonus_count:
        errors.append(f"Bonus count mismatch: JSON says {data.get('bonusCount')}, actual is {bonus_count}")
    
    return errors


def add_title_interactive() -> None:
    """Interactive mode to add a new title."""
    print("\n=== Add New MCU Title ===\n")
    
    # Load English watchlist
    data_en = load_watchlist(WATCHLIST_EN)
    next_key = get_next_key(data_en)
    
    print(f"Next available key: {next_key}")
    key = input(f"Key [{next_key}]: ").strip() or next_key
    
    # Collect basic info
    title = input("Title: ").strip()
    if not title:
        print("Error: Title is required")
        return
    
    kind = input("Kind (Film/Series) [Film]: ").strip() or "Film"
    runtime = input("Runtime (e.g., '2h 15m'): ").strip()
    phase_str = input("Phase (1-6): ").strip()
    try:
        phase = int(phase_str) if phase_str else None
    except ValueError:
        phase = None
    
    bonus = input("Bonus title? (y/n) [n]: ").strip().lower() == 'y'
    
    # Collect descriptions
    print("\n--- Descriptions ---")
    what = input("What (plot summary): ").strip()
    why = input("Why (relevance to Doomsday): ").strip()
    when = input("When (timeline context): ").strip()
    who = input("Who (cast): ").strip()
    
    # Collect URLs
    print("\n--- URLs ---")
    official_url = input("Official Marvel URL: ").strip()
    image_url = input("Image URL (Marvel CDN): ").strip()
    
    # Chronological order
    print("\n--- Chronological Order ---")
    chrono_str = input(f"Chronological order position: ").strip()
    try:
        chrono_order = int(chrono_str) if chrono_str else int(key)
    except ValueError:
        chrono_order = int(key)
    
    # Build entry
    entry = {
        "key": key,
        "title": title,
        "kind": kind,
        "runtime": runtime,
        "bonus": bonus,
        "phase": phase,
        "what": what,
        "why": why,
        "when": when,
        "who": who,
        "officialUrl": official_url,
        "imageUrl": image_url,
        "localImage": f"./assets/posters/{key}.jpg",
        "chronologicalOrder": chrono_order
    }
    
    # Add to English watchlist
    data_en["items"].append(entry)
    data_en["count"] = sum(1 for item in data_en["items"] if not item.get("bonus", False))
    data_en["bonusCount"] = sum(1 for item in data_en["items"] if item.get("bonus", False))
    data_en["generatedAt"] = datetime.utcnow().isoformat() + "Z"
    
    # Save English
    save_watchlist(WATCHLIST_EN, data_en)
    print(f"\n✅ Added to {WATCHLIST_EN}")
    
    # Dutch translation
    print("\n--- Dutch Translation ---")
    add_dutch = input("Add Dutch translation now? (y/n) [y]: ").strip().lower() != 'n'
    
    if add_dutch:
        data_nl = load_watchlist(WATCHLIST_NL)
        
        entry_nl = entry.copy()
        entry_nl["what"] = input(f"What (NL) [{what}]: ").strip() or what
        entry_nl["why"] = input(f"Why (NL) [{why}]: ").strip() or why
        entry_nl["when"] = input(f"When (NL) [{when}]: ").strip() or when
        entry_nl["who"] = input(f"Who (NL) [{who}]: ").strip() or who
        
        data_nl["items"].append(entry_nl)
        data_nl["count"] = data_en["count"]
        data_nl["bonusCount"] = data_en["bonusCount"]
        data_nl["generatedAt"] = data_en["generatedAt"]
        
        save_watchlist(WATCHLIST_NL, data_nl)
        print(f"✅ Added to {WATCHLIST_NL}")
    
    # Download image
    if image_url:
        print("\n--- Download Poster ---")
        download = input("Download poster image now? (y/n) [y]: ").strip().lower() != 'n'
        if download:
            try:
                poster_path = POSTER_DIR / f"{key}.jpg"
                subprocess.run(
                    ["curl", "-L", "-o", str(poster_path), image_url],
                    check=True,
                    capture_output=True
                )
                print(f"✅ Downloaded poster to {poster_path}")
            except subprocess.CalledProcessError as e:
                print(f"❌ Failed to download poster: {e}")
    
    print(f"\n✅ Successfully added '{title}' (key: {key})")


def swap_titles(key1: str, key2: str) -> None:
    """Swap two titles' keys and poster images."""
    print(f"\n=== Swapping titles {key1} ↔ {key2} ===\n")
    
    # Load both watchlists
    data_en = load_watchlist(WATCHLIST_EN)
    data_nl = load_watchlist(WATCHLIST_NL)
    
    # Find items in English
    item1_en = next((item for item in data_en["items"] if item["key"] == key1), None)
    item2_en = next((item for item in data_en["items"] if item["key"] == key2), None)
    
    if not item1_en or not item2_en:
        print(f"❌ Could not find both keys in English watchlist")
        return
    
    # Find items in Dutch
    item1_nl = next((item for item in data_nl["items"] if item["key"] == key1), None)
    item2_nl = next((item for item in data_nl["items"] if item["key"] == key2), None)
    
    # Swap keys in English
    item1_en["key"], item2_en["key"] = key2, key1
    item1_en["localImage"] = f"./assets/posters/{key2}.jpg"
    item2_en["localImage"] = f"./assets/posters/{key1}.jpg"
    
    # Swap keys in Dutch
    if item1_nl and item2_nl:
        item1_nl["key"], item2_nl["key"] = key2, key1
        item1_nl["localImage"] = f"./assets/posters/{key2}.jpg"
        item2_nl["localImage"] = f"./assets/posters/{key1}.jpg"
    
    # Update timestamps
    timestamp = datetime.utcnow().isoformat() + "Z"
    data_en["generatedAt"] = timestamp
    data_nl["generatedAt"] = timestamp
    
    # Save
    save_watchlist(WATCHLIST_EN, data_en)
    save_watchlist(WATCHLIST_NL, data_nl)
    
    # Swap poster images
    poster1 = POSTER_DIR / f"{key1}.jpg"
    poster2 = POSTER_DIR / f"{key2}.jpg"
    
    if poster1.exists() and poster2.exists():
        temp = POSTER_DIR / f"temp_{key1}.jpg"
        shutil.move(str(poster1), str(temp))
        shutil.move(str(poster2), str(poster1))
        shutil.move(str(temp), str(poster2))
        print(f"✅ Swapped poster images")
    
    print(f"✅ Successfully swapped {key1} ↔ {key2}")
    print(f"   {item2_en['title']} is now key {key1}")
    print(f"   {item1_en['title']} is now key {key2}")


def validate_command() -> None:
    """Validate both watchlists."""
    print("\n=== Validating Watchlists ===\n")
    
    # Validate English
    print("Checking watchlist.en.json...")
    data_en = load_watchlist(WATCHLIST_EN)
    errors_en = validate_watchlist(data_en)
    
    if errors_en:
        print(f"❌ Found {len(errors_en)} error(s) in English watchlist:")
        for error in errors_en:
            print(f"   - {error}")
    else:
        print("✅ English watchlist is valid")
    
    # Validate Dutch
    print("\nChecking watchlist.nl.json...")
    data_nl = load_watchlist(WATCHLIST_NL)
    errors_nl = validate_watchlist(data_nl)
    
    if errors_nl:
        print(f"❌ Found {len(errors_nl)} error(s) in Dutch watchlist:")
        for error in errors_nl:
            print(f"   - {error}")
    else:
        print("✅ Dutch watchlist is valid")
    
    # Check consistency
    print("\nChecking consistency between EN and NL...")
    keys_en = {item["key"] for item in data_en["items"]}
    keys_nl = {item["key"] for item in data_nl["items"]}
    
    missing_nl = keys_en - keys_nl
    extra_nl = keys_nl - keys_en
    
    if missing_nl:
        print(f"❌ Keys in EN but not NL: {sorted(missing_nl)}")
    if extra_nl:
        print(f"❌ Keys in NL but not EN: {sorted(extra_nl)}")
    
    if not missing_nl and not extra_nl:
        print("✅ Both watchlists have the same keys")
    
    # Summary
    total_errors = len(errors_en) + len(errors_nl) + len(missing_nl) + len(extra_nl)
    if total_errors == 0:
        print("\n✅ All validation checks passed!")
    else:
        print(f"\n❌ Found {total_errors} total issue(s)")
        sys.exit(1)


def list_titles() -> None:
    """List all titles with their keys."""
    data = load_watchlist(WATCHLIST_EN)
    items = data["items"]
    
    print(f"\n=== MCU Doomsday Watchlist ({len(items)} titles) ===\n")
    
    main_items = [item for item in items if not item.get("bonus", False)]
    bonus_items = [item for item in items if item.get("bonus", False)]
    
    print(f"Main Titles ({len(main_items)}):")
    for item in main_items:
        chrono = item.get("chronologicalOrder", "?")
        print(f"  {item['key']:>3}. {item['title']:<50} (chrono: {chrono})")
    
    if bonus_items:
        print(f"\nBonus Titles ({len(bonus_items)}):")
        for item in bonus_items:
            chrono = item.get("chronologicalOrder", "?")
            print(f"  {item['key']:>3}. {item['title']:<50} (chrono: {chrono})")


def remove_title(key: str) -> None:
    """Remove a title from both watchlists."""
    print(f"\n=== Remove Title (Key: {key}) ===\n")
    
    # Load both watchlists
    data_en = load_watchlist(WATCHLIST_EN)
    data_nl = load_watchlist(WATCHLIST_NL)
    
    # Find the item in English watchlist
    item_en = None
    for item in data_en["items"]:
        if item["key"] == key:
            item_en = item
            break
    
    if not item_en:
        print(f"❌ Key '{key}' not found in watchlist")
        sys.exit(1)
    
    # Confirm deletion
    print(f"Title: {item_en['title']}")
    print(f"Kind: {item_en['kind']}")
    print(f"Bonus: {item_en.get('bonus', False)}")
    
    confirm = input(f"\n⚠️  Are you sure you want to remove this title? (yes/no): ").strip().lower()
    if confirm != "yes":
        print("❌ Cancelled")
        return
    
    # Remove from English
    data_en["items"] = [item for item in data_en["items"] if item["key"] != key]
    
    # Update counts
    main_count = sum(1 for item in data_en["items"] if not item.get("bonus", False))
    bonus_count = sum(1 for item in data_en["items"] if item.get("bonus", False))
    data_en["count"] = main_count
    data_en["bonusCount"] = bonus_count
    data_en["generatedAt"] = datetime.utcnow().isoformat() + "Z"
    
    save_watchlist(WATCHLIST_EN, data_en)
    print(f"✅ Removed from {WATCHLIST_EN.relative_to(REPO_ROOT)}")
    
    # Remove from Dutch
    data_nl["items"] = [item for item in data_nl["items"] if item["key"] != key]
    data_nl["count"] = main_count
    data_nl["bonusCount"] = bonus_count
    data_nl["generatedAt"] = datetime.utcnow().isoformat() + "Z"
    
    save_watchlist(WATCHLIST_NL, data_nl)
    print(f"✅ Removed from {WATCHLIST_NL.relative_to(REPO_ROOT)}")
    
    # Remove poster if exists
    poster = POSTER_DIR / f"{key}.jpg"
    if poster.exists():
        poster.unlink()
        print(f"✅ Removed poster {poster.relative_to(REPO_ROOT)}")
    
    print(f"\n✅ Successfully removed '{item_en['title']}' (key: {key})")


def main():
    parser = argparse.ArgumentParser(
        description="MCU Doomsday Watchlist Management Tool",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s add                    # Add a new title (interactive)
  %(prog)s remove 50              # Remove a title by key
  %(prog)s swap 42 49             # Swap keys 42 and 49
  %(prog)s validate               # Validate watchlists
  %(prog)s list                   # List all titles
        """
    )
    
    subparsers = parser.add_subparsers(dest="command", help="Command to execute")
    
    # Add command
    subparsers.add_parser("add", help="Add a new title (interactive)")
    
    # Remove command
    remove_parser = subparsers.add_parser("remove", help="Remove a title by key")
    remove_parser.add_argument("key", help="Key of the title to remove")
    
    # Swap command
    swap_parser = subparsers.add_parser("swap", help="Swap two titles' keys")
    swap_parser.add_argument("key1", help="First key")
    swap_parser.add_argument("key2", help="Second key")
    
    # Validate command
    subparsers.add_parser("validate", help="Validate watchlists")
    
    # List command
    subparsers.add_parser("list", help="List all titles")
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        return
    
    try:
        if args.command == "add":
            add_title_interactive()
        elif args.command == "remove":
            remove_title(args.key)
        elif args.command == "swap":
            swap_titles(args.key1, args.key2)
        elif args.command == "validate":
            validate_command()
        elif args.command == "list":
            list_titles()
    except KeyboardInterrupt:
        print("\n\nCancelled by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()

# Made with Bob
