import re

with open("/tmp/report.html") as f:
    text = f.read()

urls = set(re.findall(r'https?://[^\s"\'<>]+', text))
for u in sorted(urls):
    if any(k in u for k in ["datastudio", "looker", "googleapis", "gstatic"]):
        print(u)
