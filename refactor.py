import os
import re

html_path = r'c:\Users\pokpo\OneDrive\Documents\GitHub\Info Election 2\index.html'

with open(html_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Extract CSS
css_match = re.search(r'<style>(.*?)</style>', content, re.DOTALL)
css_content = css_match.group(1).strip() if css_match else ''

# Extract JS
js_match = re.search(r'<script>(.*?)</script>', content, re.DOTALL)
js_content = js_match.group(1).strip() if js_match else ''

# Split JS into data and logic
# Find csvData assignment
data_match = re.search(r'const csvData = `(.*?)`;', js_content, re.DOTALL)
csv_data = data_match.group(1) if data_match else ''
data_js_content = f"const electionCsvData = `{csv_data}`;"

# Remove csvData assignment from js_content
logic_content = js_content.replace(data_match.group(0), '') if data_match else js_content
# Replace reference
logic_content = logic_content.replace('Papa.parse(csvData', 'Papa.parse(electionCsvData')

# Create new index.html
new_html = re.sub(r'<style>.*?</style>', '<link rel="stylesheet" href="style.css">', content, flags=re.DOTALL)
new_html = re.sub(r'<script>.*?</script>', '<script src="data.js"></script>\n    <script src="app.js"></script>', new_html, flags=re.DOTALL)

# Write files
with open(os.path.join(os.path.dirname(html_path), 'style.css'), 'w', encoding='utf-8') as f:
    f.write(css_content)

with open(os.path.join(os.path.dirname(html_path), 'data.js'), 'w', encoding='utf-8') as f:
    f.write(data_js_content)

with open(os.path.join(os.path.dirname(html_path), 'app.js'), 'w', encoding='utf-8') as f:
    f.write(logic_content)

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(new_html)

print("Refactored successfully")
