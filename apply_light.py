import sys

def replace_in_file(filename, replacements):
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
            
        for old, new in replacements:
            if old not in content:
                print(f"Warning: Could not find '{old}' in {filename}")
            content = content.replace(old, new)
            
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Successfully processed {filename}")
    except Exception as e:
        print(f"Error processing {filename}: {e}")

style_replacements = [
    ('background: #000000;\n    color: #f1f5f9;', 'background: #ffffff;\n    color: #0f172a;'),
    ('color: #94a3b8;\n    font-size: 1rem;\n    margin-top: 0.4rem;', 'color: #64748b;\n    font-size: 1rem;\n    margin-top: 0.4rem;'),
    ('background: #1e293b;\n    padding: 4px;\n    border-radius: 10px;', 'background: #f1f5f9;\n    padding: 4px;\n    border-radius: 10px;'),
    ('background: transparent;\n    color: #94a3b8;', 'background: transparent;\n    color: #64748b;'),
    ('background: #0a0a0a;\n    color: #60a5fa;\n    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);', 'background: #ffffff;\n    color: #1e40af;\n    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);'),
    ('border: 2px solid #334155;\n    border-radius: 14px;\n    overflow: hidden;\n    background: #0a0a0a;\n    position: relative;\n    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);', 'border: 2px solid #e2e8f0;\n    border-radius: 14px;\n    overflow: hidden;\n    background: #f8fafc;\n    position: relative;\n    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.07);'),
    ('color: #e2e8f0;\n    white-space: nowrap;', 'color: #334155;\n    white-space: nowrap;'),
    ('border: 1.5px solid #334155;\n    background: #1e293b;\n    color: #cbd5e1;', 'border: 1.5px solid #e2e8f0;\n    background: #ffffff;\n    color: #334155;'),
    ('border-color: #3b82f6;\n    color: #60a5fa;\n    background: #0f172a;', 'border-color: #3b82f6;\n    color: #1e40af;\n    background: #eff6ff;'),
    ('border-color: #475569;\n    color: #94a3b8;', 'border-color: #cbd5e1;\n    color: #64748b;'),
    ('background-color: #1e293b;\n    color: #cbd5e1;', 'background-color: #ffffff;\n    color: #334155;'),
    ('background: #0a0a0a;\n    border-radius: 14px;\n    border: 2px solid #334155;\n    display: flex;\n    flex-direction: column;\n    overflow: hidden;\n    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);', 'background: #ffffff;\n    border-radius: 14px;\n    border: 2px solid #e2e8f0;\n    display: flex;\n    flex-direction: column;\n    overflow: hidden;\n    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);'),
    ('border-bottom: 1px solid #334155;\n    background: #111827;', 'border-bottom: 1px solid #e2e8f0;\n    background: #f8fafc;'),
    ('color: #f8fafc;', 'color: #0f172a;'),
    ('border: 1px solid #475569;\n    background: #1e293b;\n    color: #e2e8f0;', 'border: 1px solid #cbd5e1;\n    background: #ffffff;\n    color: #334155;'),
    ('background: #111827;\n    border: 1px solid #334155;', 'background: #f8fafc;\n    border: 1px solid #e2e8f0;'),
    ('background: #334155;\n    border-radius: 4px;', 'background: #e2e8f0;\n    border-radius: 4px;'),
    ('border-top: 1px solid #334155;\n    background: #111827;', 'border-top: 1px solid #e2e8f0;\n    background: #f8fafc;'),
    ('background: #1e293b;', 'background: #eff6ff;'),
    ('border: 2px solid #334155;\n    border-radius: 14px;\n    background: #0a0a0a;\n    display: flex;\n    flex-direction: column;\n    overflow: hidden;\n    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);', 'border: 2px solid #e2e8f0;\n    border-radius: 14px;\n    background: #ffffff;\n    display: flex;\n    flex-direction: column;\n    overflow: hidden;\n    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.07);')
]

ranking_replacements = [
    ('--bg: #000000;', '--bg: #ffffff;'),
    ('--surface: #111827;', '--surface: #f8fafc;'),
    ('--surface2: #1e293b;', '--surface2: #f1f5f9;'),
    ('--text: #f1f5f9;', '--text: #0f172a;'),
    ('--text-dim: #94a3b8;', '--text-dim: #64748b;'),
    ('--border: #334155;', '--border: #e2e8f0;'),
    ('background: #7f1d1d;', 'background: #fee2e2;'),
    ('color: #fca5a5;', 'color: #dc2626;'),
    ('background: #14532d;', 'background: #dcfce7;'),
    ('color: #86efac;', 'color: #16a34a;'),
    ('background: #1e293b; color: #94a3b8;', 'background: #f1f5f9; color: #64748b;'),
    ('background: #1e3a8a; color: #93c5fd;', 'background: #dbeafe; color: #1d4ed8;'),
    ('background: #713f12; color: #fde047;', 'background: #fef9c3; color: #a16207;'),
    ('background: #334155;', 'background: #e2e8f0;'),
]

index_replacements = [
    ('color: #f1f5f9;', 'color: #0f172a;'),
    ('border-bottom: 2px solid #334155;', 'border-bottom: 2px solid #e2e8f0;'),
    ('background: #1e293b;\n    color: #cbd5e1;\n}', 'background: #ffffff;\n    color: #334155;\n}'),
    ('color:#f87171; font-weight:700;', 'color:#ef4444; font-weight:700;'),
    ('color: #f1f5f9;', 'color: black;'),
]

app_replacements = [
    ('background:#431407; color:#fb923c; border: 1px solid #9a3412;', 'background:#fff7ed; color:#ea580c; border: 1px solid #ffedd5;'),
    ('background:#7f1d1d; color:#fca5a5; border: 1px solid #dc2626;', 'background:#fee2e2; color:#ef4444; border: 1px solid #fecaca;'),
    ('background:#334155; color:#94a3b8;', 'background:#cbd5e1; color:#475569;'),
    ('background: #000000;', 'background: #ffffff;'),
]

replace_in_file('style.css', style_replacements)
replace_in_file('ranking.html', ranking_replacements)
replace_in_file('index.html', index_replacements)
replace_in_file('app.js', app_replacements)
