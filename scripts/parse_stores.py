import json
import sys

def parse_md_table(content):
    stores = []
    lines = content.strip().split('\n')
    
    for line in lines:
        if line.startswith('|') and not line.startswith('| ---') and not line.startswith('| STORECODE'):
            parts = [p.strip() for p in line.split('|')]
            parts = [p for p in parts if p]  # Remove empty strings
            
            if len(parts) >= 10 and parts[0] and not parts[0].startswith('---'):
                stores.append({
                    "id": parts[0],
                    "name": parts[1],
                    "brand": parts[2],
                    "zone": parts[3],
                    "region": parts[4],
                    "district": parts[5],
                    "city": parts[8],
                    "state": parts[9]
                })
    
    return stores

if __name__ == "__main__":
    content = sys.stdin.read()
    stores = parse_md_table(content)
    print(json.dumps(stores, indent=2))
