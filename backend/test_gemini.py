import os
from google import genai

api_key = os.environ.get("GOOGLE_API_KEY")
if not api_key:
    raise SystemExit(
        "GOOGLE_API_KEY not found. Run this in your terminal first:\n"
        "  set GOOGLE_API_KEY=your-key-here"
    )

client = genai.Client(api_key=api_key)

print("Uploading menu_test.jpg ...")
uploaded_file = client.files.upload(file="menu_test.jpg")

print("Asking Gemini to describe it ...")
response = client.models.generate_content(
    model="gemini-3.6-flash",
    contents=[uploaded_file, "What food items and prices can you see in this menu photo? List them."],
)

print("\n--- Gemini's response ---\n")
print(response.text)