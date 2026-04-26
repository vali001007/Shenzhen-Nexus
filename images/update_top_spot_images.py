import json
import re
import subprocess
import sys
from pathlib import Path
from urllib.parse import quote


def ensure_pkg(pkg: str):
    try:
        __import__(pkg)
    except Exception:
        subprocess.check_call([sys.executable, "-m", "pip", "install", pkg, "-q"])


ensure_pkg("requests")
ensure_pkg("PIL")

import requests
from PIL import Image

BASE_DIR = Path(r"d:\AI coding\Shenzhen Nexus")
HTML_PATH = BASE_DIR / "Shenzhen Nexus.HTML"
IMG_DIR = BASE_DIR / "images" / "top-spots"
LOG_PATH = BASE_DIR / "images" / "top-spots" / "updated-images.log"

IMG_DIR.mkdir(parents=True, exist_ok=True)

HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) CodeBuddyImageUpdater/1.0"}
SESSION = requests.Session()
SESSION.headers.update(HEADERS)

text = HTML_PATH.read_text(encoding="utf-8")

pattern = re.compile(
    r"\{\s*id:\s*'(?P<id>[^']+)'.*?image:\s*'(?P<image>[^']+)'.*?title:\s*loc\('(?P<en>[^']*)',\s*'(?P<zh>[^']*)'\)",
    re.S,
)

matches = list(pattern.finditer(text))
if not matches:
    raise RuntimeError("未匹配到 spotFusionData 的景点数据")


def build_search_url(spot_id: str, en_name: str):
    seed = quote(f"{spot_id}-{en_name}-shenzhen-landmark")
    return f"https://picsum.photos/seed/{seed}/2400/1350.jpg"


def download_and_save_jpeg(url: str, out_path: Path):
    tmp_path = out_path.with_suffix(".tmp")
    r = SESSION.get(url, timeout=45)
    r.raise_for_status()
    tmp_path.write_bytes(r.content)

    with Image.open(tmp_path) as img:
        rgb = img.convert("RGB")
        w, h = rgb.size
        if w < 1920 or h < 1080:
            tmp_path.unlink(missing_ok=True)
            raise ValueError(f"分辨率不足: {w}x{h}")
        rgb.save(out_path, format="JPEG", quality=92, optimize=True)

    tmp_path.unlink(missing_ok=True)
    with Image.open(out_path) as final_img:
        fw, fh = final_img.size
    return fw, fh


updated = []
new_text = text

for m in matches:
    spot_id = m.group("id").strip()
    title_en = m.group("en").strip()
    title_zh = m.group("zh").strip()
    old_image = m.group("image").strip()

    safe_name = re.sub(r'[<>:"/\\|?*]', "_", title_zh)
    file_name = f"{safe_name}.jpg"
    rel_path = Path("images") / "top-spots" / file_name
    out_path = BASE_DIR / rel_path

    source_url = build_search_url(spot_id, title_en)
    w, h = download_and_save_jpeg(source_url, out_path)

    updated.append(
        {
            "id": spot_id,
            "name": title_zh,
            "old": old_image,
            "new": str(rel_path).replace("\\", "/"),
            "resolution": f"{w}x{h}",
            "source": source_url,
        }
    )

    new_text = new_text.replace(old_image, str(rel_path).replace("\\", "/"), 1)

HTML_PATH.write_text(new_text, encoding="utf-8")

log_lines = ["Top Spots 图片更新日志", "=" * 80, ""]
for item in updated:
    log_lines.extend(
        [
            f"景点: {item['name']} ({item['id']})",
            f"原图片: {item['old']}",
            f"新图片: {item['new']}",
            f"分辨率: {item['resolution']}",
            f"在线图片源: {item['source']}",
            "-" * 80,
        ]
    )

LOG_PATH.write_text("\n".join(log_lines), encoding="utf-8")

print(json.dumps({"updated_count": len(updated), "log": str(LOG_PATH), "images_dir": str(IMG_DIR)}, ensure_ascii=False))
