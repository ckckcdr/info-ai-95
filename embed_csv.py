import os

BASE = r'c:\Users\pokpo\OneDrive\Documents\GitHub\Info Election 2'
csv_dir = os.path.join(BASE, 'election-69-OCR-result-main', 'data', 'csv')

def read_csv(filename):
    path = os.path.join(csv_dir, filename)
    with open(path, 'r', encoding='utf-8-sig') as f:
        content = f.read()
    return content.replace('\\', '\\\\').replace('`', '\\`')

winners_data      = read_csv('summary_winners.csv')
partylist_data    = read_csv('party_list.csv')
constituency_data = read_csv('constituency.csv')

data_js = f"""const electionCsvData = `{winners_data}`;

const partyListCsvData = `{partylist_data}`;

const constituencyCsvData = `{constituency_data}`;
"""

data_js_path = os.path.join(BASE, 'data.js')
with open(data_js_path, 'w', encoding='utf-8') as f:
    f.write(data_js)

print(f"data.js written ({os.path.getsize(data_js_path):,} bytes)")
