
res = '''<head><style>
li{
padding: 10px;
}
</style></head>
<body><ol><li>

'''
with open('genome.txt') as f:
    for line in f:
        if line.startswith('\n'):
            res += '</li><li>'
        elif line.startswith('http'):
            res += '<a href="%s">%s</a>' % (line, line)
        else:
            res += line + '<br>'


print res
