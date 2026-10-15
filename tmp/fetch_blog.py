import urllib.request
import re

url = "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQEMabw9_XgkiWcskEYS1fUyb9wk6zRS8-2HyR8v413c2j6OSz_s_gwquwLLt-vbR8FBK8ZqNlx-pFDSdA8STWsTKGTgZY3rZmfbrFEF2ieuNI91pyW6igfrlpp5j5J0T31qOOpUG8k1KHl-zAtdBHRYDz5kKZgV-QsTpXdQlhs79ze2XxGmzLDwLiU6H_iJ7sRE4u1A"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
try:
    with urllib.request.urlopen(req) as response:
        print("Final URL:", response.geturl())
        content = response.read().decode("utf-8", errors="ignore")
        t_start = content.find("<title>")
        t_end = content.find("</title>")
        print("Title:", content[t_start:t_end+8])
        links = re.findall(r"https?://(?:datastudio|lookerstudio)\.google\.com[^\s\"'<>]+", content)
        for l in links:
            print("Link:", l)
except Exception as e:
    print("Error:", e)
