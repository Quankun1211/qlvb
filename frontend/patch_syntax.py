import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # The issue is that `.includes(kw))` was left because of the optional `\)?` failing to match the parenthesis.
    # We will replace `removeAccents(row.xxxxx).includes(kw))` with `removeAccents(row.xxxxx).includes(kw)`
    # Only if it's NOT followed by a semicolon or something that makes it the end of the filter.
    # Actually, in all these cases, they were part of `||` chains or at the end before `\n    );`
    
    # Just replacing `.includes(kw))` with `.includes(kw)` is safe IF we know it's a syntax error.
    # We can use regex: `\.includes\(kw\)\)([\s\n]*\|\|)` -> `.includes(kw)\1`
    content = re.sub(r'\.includes\(kw\)\)(\s*\|\|)', r'.includes(kw)\1', content)
    
    # For the last one in the chain, it might be `.includes(kw))\n    );`
    # Let's fix that too.
    content = re.sub(r'\.includes\(kw\)\)(\s*\n\s*\);)', r'.includes(kw)\1', content)

    # Let's also check if there's any `row.fieldName?.toString().includes(kw))`
    content = re.sub(r'\.includes\(kw\)\)(\s*\|\|)', r'.includes(kw)\1', content)
    content = re.sub(r'\.includes\(kw\)\)(\s*\n\s*\);)', r'.includes(kw)\1', content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

for root, _, files in os.walk('c:/Users/AD/Desktop/QLVB/frontend/src/app'):
    for file in files:
        if file.endswith('.tsx'):
            process_file(os.path.join(root, file))
