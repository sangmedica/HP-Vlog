import json
import sys

PIPELINE_DIR = "/Users/kitashinya/Desktop/claude code/英語学習アプリ/pipeline"
ASSETS_DIR = "/Users/kitashinya/Desktop/claude code/英語学習アプリ/app/src/main/assets"

# raw_pull.json: freshly extracted from Notion this run.
# Format: [{"category_path": [...], "japanese": "...", "english": "...", "pronunciation": "..."}]
raw = json.load(open(f"{PIPELINE_DIR}/raw_pull.json", encoding="utf-8"))

current = json.load(open(f"{PIPELINE_DIR}/vocab_current.json", encoding="utf-8"))


def key_of(item):
    return (tuple(item["category_path"]), item["english"].strip(), item["japanese"].strip())


existing_by_key = {key_of(item): item for item in current}
max_id = max((item["id"] for item in current), default=0)

new_items = []
updated = list(current)
seen_keys = set()

for raw_item in raw:
    k = key_of(raw_item)
    seen_keys.add(k)
    if k in existing_by_key:
        continue
    max_id += 1
    new_entry = {
        "id": max_id,
        "category_path": raw_item["category_path"],
        "japanese": raw_item["japanese"],
        "english": raw_item["english"],
        "pronunciation": raw_item.get("pronunciation"),
        "audio_file": f"w{max_id}.mp3",
    }
    updated.append(new_entry)
    new_items.append(new_entry)

missing = [item for k, item in existing_by_key.items() if k not in seen_keys]

with open(f"{PIPELINE_DIR}/vocab_current.json", "w", encoding="utf-8") as f:
    json.dump(updated, f, ensure_ascii=False, indent=2)

with open(f"{ASSETS_DIR}/vocab.json", "w", encoding="utf-8") as f:
    json.dump(updated, f, ensure_ascii=False, indent=2)

with open(f"{PIPELINE_DIR}/new_items.json", "w", encoding="utf-8") as f:
    json.dump(new_items, f, ensure_ascii=False, indent=2)

print(f"total_before={len(current)} total_after={len(updated)} new_count={len(new_items)} missing_count={len(missing)}")
if missing:
    print("WARNING: items present in previous baseline but not in this pull (possibly deleted in Notion or a fetch glitch):")
    for m in missing[:30]:
        print(" -", m["category_path"], m["english"], m["japanese"])
