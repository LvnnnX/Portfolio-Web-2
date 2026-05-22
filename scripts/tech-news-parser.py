#!/usr/bin/python3
"""
Tech News Parser & Summarizer for Portfolio-Web-2
Uses Tavily API to search and curate tech news, then summarizes with AI
"""

from datetime import datetime
import os
import sys
import subprocess
import requests
import json

# Configure APIs
xiaomimimo_key = os.getenv("XIAOMIMIMO_API_KEY", "sk-syjn3x2g9ia5cu3171e7m3t0su43bmt3tbjb4uaz09bfb2wg")
tavily_key = os.getenv("TAVILY_API_KEY", "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")
api_base = "https://api.xiaomimimo.com/v1"
model_name = "mimo-v2.5"

# Portfolio repo path
PORTFOLIO_PATH = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUTPUT_DIR = os.path.join(PORTFOLIO_PATH, "src/content/tech-news")

def search_tech_news(use_ai_focus=False):
    """Use Tavily API to search for latest tech news
    
    Args:
        use_ai_focus: If True, focus on AI/ML news. Otherwise general tech.
    
    Returns:
        List of articles with title, url, content, published_date
    """
    today = datetime.now().strftime('%Y-%m-%d')
    
    if use_ai_focus:
        query = f"latest AI machine learning news {today} developer tools models releases"
    else:
        query = f"latest tech news {today} developer web development startup AI product launches"
    
    try:
        response = requests.post(
            "https://api.tavily.com/search",
            headers={"Content-Type": "application/json"},
            json={
                "api_key": tavily_key,
                "query": query,
                "search_depth": "advanced",
                "max_results": 15
            },
            timeout=30
        )
        response.raise_for_status()
        result = response.json()
        
        articles = []
        for item in result.get("results", []):
            articles.append({
                "title": item.get("title", ""),
                "link": item.get("url", ""),
                "summary": item.get("content", "")[:800],
                "published": item.get("published_date", today),
                "source": item.get("url", "").split("/")[2] if item.get("url") else "Unknown"
            })
        
        print(f"✓ Tavily found {len(articles)} articles")
        return articles
        
    except Exception as e:
        print(f"ERROR: Tavily API failed: {e}")
        sys.exit(1)

def summarize_with_ai(articles):
    """Use XiaoMiMiMo API to summarize and pick top 5 articles"""
    
    articles_text = "\n\n".join([
        f"**{a['title']}**\n"
        f"Source: {a['source']}\n"
        f"Summary: {a['summary']}\n"
        f"Link: {a['link']}"
        for a in articles
    ])
    
    today = datetime.now().strftime('%d %B %Y')
    
    prompt = f"""Kamu adalah Pande Gede Dani Wismagatha (Dani), seorang Data Scientist dari Bali yang menulis blog tentang ekonomi-politik dan teknologi.

VOICE & STYLE (WAJIB IKUTI):
- Gunakan "aku" (first person), bukan "kita" atau impersonal
- Opening personal & relatable: "Aku bukan [expert], tapi..." atau "Kemarin aku baca..."
- Breakdown kompleks jadi struktur berlapis (misal: "tiga hal yang menarik", "dua sisi yang perlu dipahami")
- Quote langsung dari sumber asli (nama publikasi + tanggal)
- Framing "dua cermin" — objektif tapi punya stance, bukan netral palsu
- Akhiri dengan refleksi personal: "Yang aku bawa pulang dari ini..."
- Hindari: AI-isms ("dive into", "let's explore", "in conclusion"), hype berlebihan, clickbait

CONTOH OPENING YANG BENAR:
"Kemarin scrolling Hacker News, aku nemu satu thread yang bikin berhenti: OpenAI baru rilis model baru, tapi yang viral justru bukan fiturnya — melainkan harganya yang turun 90%. Aku bukan AI researcher, tapi sebagai orang yang tiap bulan bayar $200+ buat Claude API, angka ini relevan banget."

CONTOH PENUTUP YANG BENAR:
"Ini bukan analisis mendalam. Aku cuma developer yang kebetulan peduli sama arah industri ini. Tapi menurutku, tempat paling sehat untuk peduli adalah dengan menulis — atau setidaknya, membaca tulisan orang lain yang punya angle berbeda."

---

Berikut 15 artikel tech news terbaru:

{articles_text}

TUGAS:
1. Pilih 5 artikel paling penting untuk developer Indonesia
2. Tulis dalam gaya Dani (personal, reflektif, validated-by-data)
3. Setiap artikel: 2-3 paragraf (bukan bullet points)
4. Sertakan quote/data spesifik dari artikel asli
5. Akhiri dengan refleksi: "Yang menarik dari kelima berita ini..."

OUTPUT FORMAT MDX:

---
title: "Tech News - {today}"
slug: "tech-news-{datetime.now().strftime('%Y-%m-%d')}"
date: "{datetime.now().strftime('%Y-%m-%d')}"
tags: ["tech-news", "ai", "developer", "catatan"]
eyebrow: ["TECH NEWS", "CATATAN"]
excerpt: "[1 kalimat personal: 'Hari ini aku baca lima berita yang...' BUKAN generic summary]"
readingTime: "7 min"
author: "Pande Gede Dani Wismagatha"
draft: false
---

[Opening personal 1-2 paragraf: kenapa kamu baca tech news hari ini, apa yang bikin relevan]

## [Judul Artikel 1 — Tulis Ulang Jadi Lebih Menarik]

[Paragraf 1: Apa yang terjadi, dengan quote/data spesifik]

[Paragraf 2: Kenapa ini penting untuk developer Indonesia, implikasi praktis]

**Source:** [Nama publikasi]  
**Link:** [URL]

---

## [Judul Artikel 2]

...

(Ulangi untuk 5 artikel)

---

## Yang aku bawa pulang dari kelima berita ini

[2-3 paragraf refleksi: pola yang kamu lihat, pertanyaan yang muncul, stance personal tapi objektif]

---

*Ditulis {today} • Sumber: [list publikasi yang dikutip]*
"""
    
    try:
        response = requests.post(
            f"{api_base}/chat/completions",
            headers={
                "Authorization": f"Bearer {xiaomimimo_key}",
                "Content-Type": "application/json"
            },
            json={
                "model": model_name,
                "messages": [
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.7
            },
            timeout=120
        )
        response.raise_for_status()
        result = response.json()
        return result['choices'][0]['message']['content']
    except Exception as e:
        print(f"ERROR: XiaoMiMiMo API failed: {e}")
        if hasattr(e, 'response'):
            print(f"Response: {e.response.text}")
        sys.exit(1)

def save_mdx(content):
    """Save MDX content to file"""
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    date_str = datetime.now().strftime('%Y-%m-%d')
    output_path = os.path.join(OUTPUT_DIR, f"tech-news-{date_str}.mdx")
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✓ Tech news saved to {output_path}")
    return output_path

def git_commit_push():
    """Commit and push to repo"""
    date_str = datetime.now().strftime('%Y-%m-%d')
    
    try:
        subprocess.run(["git", "add", "src/content/tech-news/"], cwd=PORTFOLIO_PATH, check=True)
        subprocess.run(["git", "commit", "-m", f"Tech news: {date_str}"], cwd=PORTFOLIO_PATH, check=True)
        subprocess.run(["git", "push", "origin", "main"], cwd=PORTFOLIO_PATH, check=True)
        print("✓ Committed and pushed to repo")
    except subprocess.CalledProcessError as e:
        print(f"Warning: Git operation failed: {e}")
        print("You may need to manually commit and push.")

def main():
    # Check if --ai flag is passed
    use_ai_focus = "--ai" in sys.argv
    
    focus_type = "AI-specific" if use_ai_focus else "general tech"
    print(f"🔍 Searching {focus_type} news with Tavily API...")
    articles = search_tech_news(use_ai_focus=use_ai_focus)
    
    print("🤖 Summarizing with XiaoMiMiMo AI...")
    mdx_content = summarize_with_ai(articles)
    
    print("💾 Saving MDX post...")
    output_path = save_mdx(mdx_content)
    
    print("📤 Committing to Git...")
    git_commit_push()
    
    print(f"✅ Done! {focus_type.capitalize()} news post published.")

if __name__ == "__main__":
    main()
