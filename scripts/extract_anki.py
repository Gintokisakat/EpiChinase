import zipfile, sqlite3, json, os, re, sys

APKG_PATH = "/home/epil/Descargas/Spoonfed_Chinese.apkg"
OUTPUT_DIR = "/tmp/epichinese/data"
MEDIA_DIR = os.path.join(OUTPUT_DIR, "media")

os.makedirs(MEDIA_DIR, exist_ok=True)

z = zipfile.ZipFile(APKG_PATH)
db_name = [n for n in z.namelist() if n.startswith("collection")][0]
z.extract(db_name, "/tmp/")

media_map_raw = z.read("media") if "media" in z.namelist() else b"{}"
media_map = json.loads(media_map_raw)
rev_media = {str(v): k for k, v in media_map.items()}

conn = sqlite3.connect(f"/tmp/{db_name}")
cur = conn.cursor()

cur.execute("SELECT id, flds, tags, mid FROM notes ORDER BY id")
notes = cur.fetchall()
conn.close()
os.remove(f"/tmp/{db_name}")

cards = []
audio_exported = 0

for nid, flds, tags, mid in notes:
    parts = flds.split(chr(31))
    if len(parts) < 4:
        continue

    english = parts[0].strip()
    pinyin = parts[1].strip()
    chinese = parts[2].strip()
    sound_field = parts[3].strip()

    audio_file = None
    m = re.match(r"\[sound:(.+?)\]", sound_field)
    if m:
        audio_filename = m.group(1)
        media_id = rev_media.get(audio_filename)
        if media_id and media_id in z.namelist():
            dest = os.path.join(MEDIA_DIR, audio_filename)
            if not os.path.exists(dest):
                with z.open(media_id) as src, open(dest, "wb") as dst:
                    dst.write(src.read())
                audio_exported += 1
            audio_file = audio_filename

    cards.append({
        "id": nid,
        "chinese": chinese,
        "pinyin": pinyin,
        "english": english,
        "audio": audio_file,
        "tags": [t for t in tags.strip().split() if t],
    })

output = {
    "deck": "Spoonfed Chinese",
    "source": "https://ankiweb.net/shared/info/1661153051",
    "license": "CC BY 2.0",
    "total_cards": len(cards),
    "cards": cards,
}

with open(os.path.join(OUTPUT_DIR, "cards.json"), "w", encoding="utf-8") as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

z.close()

print(f"✅ {len(cards)} cards extracted")
print(f"✅ {audio_exported} audio files exported to {MEDIA_DIR}")
print(f"✅ JSON saved to {os.path.join(OUTPUT_DIR, 'cards.json')}")
