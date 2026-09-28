from jinja2 import Template
import uuid
import os

DMCA_TEMPLATE = """
To the Designated Copyright Agent,

I am writing to notify you of copyright infringement under the Digital Millennium Copyright Act (DMCA).

1. Identification of the copyrighted work:
Title: {{ work.title }}
Description: {{ work.description }}

2. Identification of the infringing material:
URL: {{ alert.infringing_url }}

3. Contact Information:
Name: {{ user.full_name }}
Email: {{ user.email }}

4. Good Faith Belief:
I have a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law.

5. Statement of Accuracy:
The information in this notification is accurate, and under penalty of perjury, I am the owner, or an agent authorized to act on behalf of the owner, of an exclusive right that is allegedly infringed.

Electronic Signature: {{ user.full_name }}
Date: {{ date }}
"""

PLATFORM_TAKEDOWN_URLS = {
    "youtube": "https://www.youtube.com/copyright_complaint_form",
    "spotify": "https://www.spotify.com/us/legal/infringement-form/",
    "instagram": "https://help.instagram.com/contact/552695131608132"
}

FAIR_USE_CHECKLIST = [
    "Is the material used for criticism, comment, news reporting, teaching, scholarship, or research?",
    "Is the use transformative?",
    "Does the use negatively affect the market for the original work?"
]

def generate_dmca_notice(alert, user, work) -> str:
    template = Template(DMCA_TEMPLATE)
    from datetime import date
    return template.render(alert=alert, user=user, work=work, date=date.today().isoformat())

def generate_dmca_pdf(notice_text: str, output_path: str) -> str:
    # Placeholder for PDF generation
    with open(output_path, "w") as f:
        f.write(notice_text)
    return output_path
