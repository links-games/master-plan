"""Render detail for the pilot environments; web scenes retain bounded proxies.

Procedural Blender geometry and vendored CC0 surface/lighting textures.
No paid libraries, remote services or machine learning run during rendering.
"""
import math
import random
from pathlib import Path

import bpy
from mathutils import Vector


def detail_mesh(name, vertices, faces, material):
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(vertices, [], faces)
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    obj.data.materials.append(material)
    obj['render_only'] = True
    return obj


def meadow(seed, materials, ground_height, wet=False):
    rng = random.Random(seed + 500)
    vertices, faces = [], []
    # Narrow bent blades, concentrated near the eye-level camera. One mesh
    # avoids tens of thousands of objects and the cost of a particle system.
    for _ in range(96000):
        x, y = rng.uniform(-24, 24), rng.uniform(-14, 35)
        z = ground_height(x, y, seed)
        length = rng.uniform(.12, .48)
        width = rng.uniform(.008, .025)
        lean = rng.uniform(-.15, .15)
        a = len(vertices)
        vertices.extend([(x-width,y,z),(x+width,y,z),
                         (x+lean+width*.3,y+.04,z+length*.7),
                         (x+lean-width*.3,y+.04,z+length*.7),
                         (x+lean*1.4,y+.06,z+length)])
        faces.extend([(a,a+1,a+2,a+3),(a+3,a+2,a+4)])
    detail_mesh('Fine bent meadow grasses', vertices, faces, materials['leaf'])
    vertices, faces = [], []
    for _ in range(24000):
        x, y = rng.uniform(-20, 20), rng.uniform(-11, 30)
        z = ground_height(x, y, seed) + rng.uniform(.05, .15)
        for leaf in range(3):
            angle = leaf*math.tau/3 + rng.random()
            direction = Vector((math.cos(angle),math.sin(angle),0))
            across = Vector((-direction.y,direction.x,0))
            center = Vector((x,y,z)) + direction*.055
            a = len(vertices)
            vertices.extend([center-direction*.04,
                             center+across*.045+Vector((0,0,.012)),
                             center+direction*.075+across*.015,
                             center+direction*.063,
                             center+direction*.075-across*.015,
                             center-across*.045+Vector((0,0,.012))])
            faces.append(tuple(a+i for i in range(6)))
    detail_mesh('Three-leaf clover ground cover', vertices, faces, materials['leaf'])
    vertices, faces = [], []
    for _ in range(600):
        x,y = rng.uniform(-15,15),rng.uniform(-9,20)
        z = ground_height(x,y,seed)+rng.uniform(.16,.29)
        for petal in range(16):
            angle = petal*math.tau/16
            center = Vector((x+math.cos(angle)*.035,y+math.sin(angle)*.035,z))
            a=len(vertices)
            vertices.extend([center+Vector((-.018,0,0)),center+Vector((0,-.022,.025)),
                             center+Vector((.018,0,0)),center+Vector((0,.022,.025))])
            faces.append((a,a+1,a+2,a+3))
    detail_mesh('Small white clover flower heads',vertices,faces,materials['flower'])
    if wet:
        materials['ground'].node_tree.nodes.get('Principled BSDF').inputs['Roughness'].default_value=.25


def distant_hills(seed, materials, mesh_factory):
    from mathutils import noise
    n=48
    vertices=[]
    for j in range(n+1):
        for i in range(n+1):
            x=(i/n-.5)*600
            y=100+j/n*300
            ridge=noise.fractal(Vector((x*.009,y*.009,seed*.01)),1,2,4)
            z=(ridge+1)*16-8
            vertices.append((x,y,z))
    faces=[(j*(n+1)+i,j*(n+1)+i+1,(j+1)*(n+1)+i+1,(j+1)*(n+1)+i)
           for j in range(n) for i in range(n)]
    obj=mesh_factory('Fractal distant mountain ridge',vertices,faces,materials['rock'])
    for face in obj.data.polygons: face.use_smooth=True


def masonry(materials, seed, ground_height):
    rng=random.Random(seed)
    vertices,faces=[],[]
    # Fine mortar joints on the visible street-facing surfaces.
    for i in range(9):
        x=(-1 if i%2 else 1)*rng.uniform(7,21)
        y=8+i*4
        z=ground_height(x,y,seed)
        h=rng.uniform(2.1,4.2)
        for course in range(int(h/.18)):
            for brick in range(13):
                bx=x-2.5+brick*.4+(course%2)*.2
                bz=z+.08+course*.18
                a=len(vertices)
                vertices.extend([(bx,y-2.012,bz),(bx+.38,y-2.012,bz),
                                 (bx+.38,y-2.012,bz+.165),(bx,y-2.012,bz+.165)])
                faces.append((a,a+1,a+2,a+3))
        # Match the random calls used by the base-building generator.
    detail_mesh('Hand-laid brick faces and recessed mortar',vertices,faces,materials['brick'])


def sky(scene, spec):
    background=scene.world.node_tree.nodes.get('Background')
    if not spec['night'] and spec['kind']!='orbit':
        atmosphere=scene.world.node_tree.nodes.new('ShaderNodeTexSky')
        atmosphere.sky_type='NISHITA'
        atmosphere.sun_elevation=math.radians(12 if spec['kind']=='apple' else 24)
        atmosphere.sun_rotation=math.radians(125)
        atmosphere.sun_size=math.radians(.7)
        atmosphere.altitude=.1
        atmosphere.air_density=1.0
        atmosphere.dust_density=3.0 if spec['world']=='Shacados' else .7
        scene.world.node_tree.links.new(atmosphere.outputs['Color'],background.inputs['Color'])
        background.inputs['Strength'].default_value=.24
        if spec['world']=='Shacados':
            # Dense particulate haze hides the blue sky. A diffuse olive-grey
            # environment and broad sun retain readable, physically lit forms.
            scene.world.node_tree.links.remove(background.inputs['Color'].links[0])
            background.inputs['Color'].default_value=(.18,.17,.12,1)
            background.inputs['Strength'].default_value=.4
    # An actual CC0 HDR panorama supplies natural outdoor illumination.
    if not spec['night'] and spec['kind']!='orbit' and spec['world']=='Raya':
        image=scene.world.node_tree.nodes.new('ShaderNodeTexEnvironment')
        image.image=bpy.data.images.load(str(Path(__file__).parent/'assets/spruit_sunrise_1k.hdr'),check_existing=True)
        scene.world.node_tree.links.new(image.outputs['Color'],background.inputs['Color'])
        background.inputs['Strength'].default_value=.45
        # Keep the scanned terrestrial panorama as lighting only. Camera rays
        # see Raya's procedural sky and authored untouched landscape.
        nodes=scene.world.node_tree.nodes
        links=scene.world.node_tree.links
        camera_sky=nodes.new('ShaderNodeBackground')
        camera_sky.inputs['Strength'].default_value=.24
        links.new(atmosphere.outputs['Color'],camera_sky.inputs['Color'])
        path=nodes.new('ShaderNodeLightPath')
        mix=nodes.new('ShaderNodeMixShader')
        links.new(path.outputs['Is Camera Ray'],mix.inputs[0])
        links.new(background.outputs[0],mix.inputs[1])
        links.new(camera_sky.outputs[0],mix.inputs[2])
        links.new(mix.outputs[0],nodes.get('World Output').inputs['Surface'])
    scene.use_nodes=False


def landmarks(spec, mats, helpers):
    ball,cube,pole,tree,height=helpers
    seed=spec['seed']
    rng=random.Random(seed)
    kind=spec['kind']
    if kind=='woods':
        for obj in list(bpy.context.scene.objects):
            if any(obj.name.startswith(name) for name in ['Repaired brick shelter','Shelter masonry foundation','Corrugated patched roof','Roof seam','Warm window','Recessed window','Window mullion','Stored rooftop','Reused rooftop','Chimney','Salvaged rusted metal','Hand-laid brick']):
                bpy.data.objects.remove(obj,do_unlink=True)
        for i in range(30):
            x,y=rng.uniform(-20,20),rng.uniform(-1,45)
            tree(x,y,height(x,y,seed),rng.uniform(5,11),mats['bark'],mats['leaf'],rng)
        slag=mats['rock'].copy()
        slag.name='Black volcanic slag'
        slag.node_tree.nodes.get('Principled BSDF').inputs['Base Color'].default_value=(.02,.025,.024,1)
        for x in [-29,29]:ball('Slag heap sheltering the Last Woods',(x,25,1),(10,24,12),slag,3)
        for x in [-24,26]:pole('Distant industrial chimney',(x,50,0),(x,50,22),.6,mats['rust'])
        cube('Surviving clean spring',(1,15,-.1),(1.2,35,.05),mats['sky'])
    if kind=='eclipse':
        z=height(0,6,seed)
        ball('Pale stone receiving leaf-pinhole light',(0,6,z),(.9,.8,.12),mats['flower'],3)
        for x,y in [(-.25,5.78),(.15,6.18)]:
            ball('Two moon silhouettes in the pinhole projection',(x,y,z+.11),(.30,.30,.015),mats['dark'],3)
    if kind=='delta':
        for x,y in [(-5,9),(8,18),(-6,26)]:
            for index in range(7):
                a=index*math.tau/7
                pole('Mangrove stilt root',(x,y,3),(x+math.cos(a)*2.2,y+math.sin(a)*2.2,-.6),.10,mats['bark'])
    if kind=='ice':
        shelters=[obj for obj in bpy.context.scene.objects if obj.name.startswith('Repaired brick shelter')]
        for shelter in shelters:
            x,y,z=shelter.location
            for dx in [-3,3]:
                ball('Deep drift around the buried house',(x+dx,y,z-1),(3.5,4.5,2.2),mats['snow'],3)
            ball('Snow tunnel entrance',(x,y-3,z-1),(.65,1.2,.7),mats['dark'],3)
    if kind=='launch':
        pole('Heavy steel pusher plate',(0,28,-.1),(0,28,.45),4.8,mats['rust'],48)
        for index in range(12):
            angle=index*math.tau/12
            x,y=math.cos(angle)*4,28+math.sin(angle)*4
            pole('Pusher plate shock absorber',(x,y,.4),(x*.28,28+(y-28)*.28,3),.14,mats['rust'],12)
    if kind=='glacier':
        ice=mats['snow'].copy()
        ice.name='Blue compact glacier ice'
        ice.diffuse_color=(.13,.36,.49,1)
        ice.node_tree.nodes.get('Principled BSDF').inputs['Base Color'].default_value=ice.diffuse_color
        for i in range(15):
            x=-22+i*3
            wall=cube('Granite climbing face',(x,26,9+math.sin(i)*2),(3.5,7,22),mats['rock'],.3)
            wall.rotation_euler.y=rng.uniform(-.12,.12)
            ball('Blue glacier serac',(x,17,1),(2.5,5,rng.uniform(2,5)),ice,2)
    if kind in ['nest','festival']:
        z=8 if kind=='nest' else 0
        for i in range(20):
            a=i*math.tau/20
            pole('Open white lattice nest',(math.cos(a)*4,5+math.sin(a)*4,z),
                 (math.cos(a+.7)*3,5+math.sin(a+.7)*3,z+4),.065,mats['white'])
        for i in range(30):
            x,y=rng.uniform(-9,9),rng.uniform(1,20)
            ball('Warm firefly',(x,y,rng.uniform(1,6)),(.025,.025,.025),mats['lamp'],1)
    if kind=='ridge':
        for i in range(4):
            pole('Young tower growth rib',(-1+i*.6,8,0),(-1+i*.6,8,5+i*.3),.12,mats['white'])
    if kind=='ration':
        for x in [-2.1,2.1]:pole('Empty ration queue railing',(x,-2,.65),(x,15,.65),.055,mats['rust'])
        for y in [0,4,8,12]:
            for x in [-2.1,2.1]:pole('Railing post',(x,y,0),(x,y,.7),.05,mats['rust'])
    if kind=='repair':
        from mathutils import Matrix
        # Three distinct broken radios, with no people in danger.
        for original in list(bpy.context.scene.objects):
            if original.type=='MESH' and any(word in original.name.lower() for word in ['radio','grille','knob','tube','aerial']):
                for offset in [-2.1,2.1]:
                    copy=original.copy()
                    copy.data=original.data
                    bpy.context.collection.objects.link(copy)
                    copy.matrix_world=Matrix.Translation((offset,0,0)) @ original.matrix_world


def surface_textures(materials, shacados):
    root=Path(__file__).parent/'assets'
    mat=materials['ground']
    asset='forest_ground_04' if shacados else 'leafy_grass'
    nodes=mat.node_tree.nodes
    links=mat.node_tree.links
    bsdf=nodes.get('Principled BSDF')
    coords=nodes.new('ShaderNodeTexCoord')
    mapping=nodes.new('ShaderNodeVectorMath')
    mapping.operation='SCALE'
    mapping.inputs[3].default_value=.35
    links.new(coords.outputs['UV'],mapping.inputs[0])
    mapping.inputs[3].default_value=1
    for suffix,socket in [('diff','Base Color'),('rough','Roughness'),('nor_gl',None)]:
        image=nodes.new('ShaderNodeTexImage')
        image.image=bpy.data.images.load(str(root/f'{asset}_{suffix}_1k.jpg'),check_existing=True)
        if suffix!='diff': image.image.colorspace_settings.name='Non-Color'
        links.new(mapping.outputs[0],image.inputs['Vector'])
        if suffix=='diff':
            tint=nodes.new('ShaderNodeMixRGB')
            tint.blend_type='MULTIPLY'
            tint.inputs[0].default_value=1 if shacados else .65
            tint.inputs[2].default_value=(.30,.27,.20,1) if shacados else (.32,.72,.18,1)
            links.new(image.outputs['Color'],tint.inputs[1])
            links.new(tint.outputs[0],bsdf.inputs[socket])
        elif socket:
            links.new(image.outputs['Color'],bsdf.inputs[socket])
        else:
            normal=nodes.new('ShaderNodeNormalMap')
            normal.inputs['Strength'].default_value=.6
            links.new(image.outputs['Color'],normal.inputs['Color'])
            links.new(normal.outputs[0],bsdf.inputs['Normal'])
    for key,asset,scale in [('bark','wood_table_001',.65),('brick','brown_brick_02',.5),('rust','rusty_metal_02',.8)]:
        mat=materials[key]
        nodes,links=mat.node_tree.nodes,mat.node_tree.links
        bsdf=nodes.get('Principled BSDF')
        coords=nodes.new('ShaderNodeTexCoord')
        mapping=nodes.new('ShaderNodeVectorMath')
        mapping.operation='SCALE'
        mapping.inputs[3].default_value=scale
        links.new(coords.outputs['Object'],mapping.inputs[0])
        for suffix,socket in [('diff','Base Color'),('rough','Roughness')]:
            image=nodes.new('ShaderNodeTexImage')
            image.image=bpy.data.images.load(str(root/f'{asset}_{suffix}_1k.jpg'),check_existing=True)
            image.projection='BOX'
            image.projection_blend=.2
            links.new(mapping.outputs[0],image.inputs['Vector'])
            if suffix!='diff': image.image.colorspace_settings.name='Non-Color'
            if suffix=='diff' and shacados:
                soot=nodes.new('ShaderNodeMixRGB')
                soot.blend_type='MULTIPLY'
                soot.inputs[0].default_value=1
                soot.inputs[2].default_value={'bark':(.50,.36,.22,1),'brick':(.22,.19,.16,1),'rust':(.24,.16,.10,1)}[key]
                links.new(image.outputs['Color'],soot.inputs[1])
                links.new(soot.outputs[0],bsdf.inputs[socket])
            else:
                links.new(image.outputs['Color'],bsdf.inputs[socket])
            if suffix=='rough':
                relief=nodes.new('ShaderNodeBump')
                relief.inputs['Strength'].default_value=.3
                relief.inputs['Distance'].default_value=.035
                links.new(image.outputs['Color'],relief.inputs['Height'])
                links.new(relief.outputs[0],bsdf.inputs['Normal'])


def scanned_understory(seed, ground_height):
    """Linked CC0 photogrammetry instances; never exported to the web mesh."""
    from mathutils import Matrix
    root=Path(__file__).parent/'assets'
    rng=random.Random(seed+710)
    for asset,count in [('fern_02',180),('rock_moss_set_01',24)]:
        with bpy.data.libraries.load(str(root/asset/f'{asset}_1k.blend'),link=False) as (source,target):
            target.objects=list(source.objects)
        templates=[obj for obj in target.objects if obj and obj.type=='MESH']
        for template in templates:
            template['render_only']=True
        for index in range(count):
            template=templates[index%len(templates)]
            obj=template.copy()
            obj.data=template.data
            obj.parent=None
            x,y=rng.uniform(-19,19),rng.uniform(-8,33)
            size=rng.uniform(.6,1.7) if asset=='fern_02' else rng.uniform(.35,1.1)
            obj.matrix_world=Matrix.Translation((x,y,ground_height(x,y,seed)-.03)) @ Matrix.Rotation(rng.random()*math.tau,4,'Z') @ Matrix.Scale(size,4)
            obj['render_only']=True
            bpy.context.collection.objects.link(obj)
