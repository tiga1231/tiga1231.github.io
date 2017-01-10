import re
import json
with open('in.txt') as f:
    with open('data.js','w') as fo:
        fo.write('var data = \n')
        res = []
        for line in f:
            line = line.replace('\n','')
            try:
                line = re.split(',\s*', line)
                res.append({'day':line[0],
                        'start':line[1],
                        'end':line[2],
                        'tag':line[3].split(']]')})
            except IndexError:
                continue
        json.dump(res, fo, indent=2)

