import pathlib
import shutil

src_skills = pathlib.Path(r"G:\Scratch´nTravel\AusbauÜberlegungen\2.9-skills\Nous_Hermes_Travel_Design_Skills")
dest_skills = pathlib.Path(r"g:\B2B steuer Business Ideee 6.8.2026\.agents\skills\nous-hermes-travel-design")

if src_skills.exists():
    if dest_skills.exists():
        shutil.rmtree(dest_skills)
    shutil.copytree(src_skills, dest_skills)
    
    # Also create a SKILL.md in dest_skills so the agentic loader recognizes it as an Antigravity skill
    skill_md = """---
name: nous-hermes-travel-design
description: Master Creative Director and Visual Psychology engine for Scratch'n'Travel. Orchestrates color strategy, typography personality, composition, gaze path, and 300 DPI vector production prompts for badges, patches, and luxury travel merchandise.
---

# Nous Hermes Travel Design Master Engine

This skill integrates the full 16-module creative intelligence suite:
- 00_MASTER_ORCHESTRATOR: Core visual thesis & 3-look principle
- 01_COLOR_PSYCHOLOGY: 60-30-10 palette rules & emotional arcs
- 04_TYPOGRAPHY_PSYCHOLOGY: Personality hierarchy (Cinzel / JetBrains Mono)
- 07_BADGE_INTEGRATION: Rarity tiers (Bronze, Silver, Gold, Platinum, Mythic)
- 10_FASHION_PRODUCT_TRANSLATION: Embroidered patches, leather embossing & scratch maps
- 13_GENERATION_PROMPT_ENGINE: Exact image/vector production prompts
- 15_OUTPUT_SCHEMA: JSON output contract for Printful / Prodigi / POD APIs
"""
    (dest_skills / "SKILL.md").write_text(skill_md, encoding="utf-8")
    print("Copied Nous Hermes Design Skills to .agents/skills/nous-hermes-travel-design successfully!")
