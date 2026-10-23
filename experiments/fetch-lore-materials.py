"""Refresh the small CC0 source textures; ordinary CI renders work offline."""
import hashlib
import json
import subprocess
from pathlib import Path

root=Path('examples/lore-scenes/assets')
root.mkdir(parents=True,exist_ok=True)
urls=[('spruit_sunrise_1k.hdr','https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/spruit_sunrise_1k.hdr','https://polyhaven.com/a/spruit_sunrise',None)]
for asset in ['leafy_grass','forest_ground_04','wood_table_001','brown_brick_02','rusty_metal_02']:
    response=subprocess.run(['curl','-fsSL','https://api.polyhaven.com/files/'+asset],check=True,capture_output=True)
    data=json.loads(response.stdout)
    for channel in ['Diffuse','nor_gl','Rough']:
        item=data[channel]['1k']['jpg']
        urls.append((item['url'].rsplit('/',1)[1],item['url'],'https://polyhaven.com/a/'+asset,item['md5']))
report=[]
for name,url,page,expected in urls:
    path=root/name
    if not path.exists(): subprocess.run(['curl','-fsSL',url,'-o',str(path)],check=True)
    content=path.read_bytes()
    if expected and hashlib.md5(content).hexdigest()!=expected: raise ValueError('Source checksum mismatch: '+name)
    report.append({'file':name,'url':url,'source':page,'license':'CC0-1.0','licenseUrl':'https://polyhaven.com/license','bytes':len(content),'sha256':hashlib.sha256(content).hexdigest()})
(root/'manifest.json').write_text(json.dumps(report,indent=2)+'\n')
print(f'{len(report)} assets: {sum(x["bytes"] for x in report)} bytes')

report=json.loads((root/'manifest.json').read_text())
for asset in ['fern_02','rock_moss_set_01']:
    response=subprocess.run(['curl','-fsSL','https://api.polyhaven.com/files/'+asset],check=True,capture_output=True)
    item=json.loads(response.stdout)['blend']['1k']['blend']
    entries={item['url'].rsplit('/',1)[1]:item,**item['include']}
    for relative,entry in entries.items():
        path=root/asset/relative
        path.parent.mkdir(parents=True,exist_ok=True)
        if not path.exists(): subprocess.run(['curl','-fsSL',entry['url'],'-o',str(path)],check=True)
        content=path.read_bytes()
        if hashlib.md5(content).hexdigest()!=entry['md5']: raise ValueError('Source checksum mismatch: '+str(path))
        report.append({'file':str(path.relative_to(root)),'url':entry['url'],'source':'https://polyhaven.com/a/'+asset,'license':'CC0-1.0','licenseUrl':'https://polyhaven.com/license','bytes':len(content),'sha256':hashlib.sha256(content).hexdigest()})
(root/'manifest.json').write_text(json.dumps(report,indent=2)+'\n')
print(f'{len(report)} complete sources: {sum(x["bytes"] for x in report)} bytes')
