import json
import os
import re
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from gtts import gTTS

PIPELINE_DIR = "/Users/kitashinya/Desktop/claude code/英語学習アプリ/pipeline"
AUDIO_DIR = "/Users/kitashinya/Desktop/claude code/英語学習アプリ/app/src/main/assets/audio"

new_items = json.load(open(f"{PIPELINE_DIR}/new_items.json", encoding="utf-8"))


def clean_text(text: str) -> str:
    text = re.sub(r"\s*/\s*", ", or ", text)
    text = text.replace("*", "")
    return text.strip()


def generate_one(item):
    path = f"{AUDIO_DIR}/{item['audio_file']}"
    if os.path.exists(path) and os.path.getsize(path) > 0:
        return (item["id"], "skip", None)
    text = clean_text(item["english"])
    if not text:
        return (item["id"], "empty", None)
    for attempt in range(3):
        try:
            tts = gTTS(text=text, lang="en")
            tts.save(path)
            return (item["id"], "ok", None)
        except Exception as e:
            if attempt == 2:
                return (item["id"], "fail", str(e))
            time.sleep(1.5)


def main():
    if not new_items:
        print("no new items, nothing to generate")
        return
    ok = fail = skip = 0
    with ThreadPoolExecutor(max_workers=8) as pool:
        futures = {pool.submit(generate_one, item): item for item in new_items}
        for future in as_completed(futures):
            _id, status, err = future.result()
            if status == "ok":
                ok += 1
            elif status == "skip":
                skip += 1
            else:
                fail += 1
                print("FAIL", _id, err)
    print(f"DONE new_items={len(new_items)} ok={ok} skip={skip} fail={fail}")


if __name__ == "__main__":
    main()
