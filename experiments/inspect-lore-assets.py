from pathlib import Path
import bpy
root=Path.cwd()/'examples/lore-scenes/assets'
for asset in ['fern_02','rock_moss_set_01']:
    with bpy.data.libraries.load(str(root/asset/f'{asset}_1k.blend'),link=False) as (source,target):
        target.objects=[name for name in source.objects]
    for obj in target.objects:
        if obj and obj.type=='MESH':
            print('ASSET',asset,obj.name,'polygons',len(obj.data.polygons),'bounds',list(obj.dimensions),'location',list(obj.location),flush=True)
    for image in bpy.data.images:
        print('IMAGE',image.name,image.filepath,flush=True)
