"""Reproducible Cycles environments and bounded, single-draw-call web meshes.

blender --background --factory-startup --threads 2 --python examples/lore-scenes/render.py -- --scene 01
Use --all to render all 22 pilots; --out PATH keeps CI artifacts outside sources.
Blender with its bundled Sapling add-on and vendored CC0 textures; no network at render time.
"""
import argparse
import hashlib
import json
import math
import random
import sys
from pathlib import Path

import bpy
from mathutils import Vector, noise
sys.path.insert(0, str(Path(__file__).resolve().parent))
from detail import meadow, distant_hills, masonry, sky, landmarks, surface_textures, scanned_understory, settlement_detail, weathered_stone, reset_detail
from trees import natural_tree, reset as reset_trees

ROOT = Path(__file__).resolve().parents[2]
SPECS = ROOT / 'examples/lore-scenes/scenes.json'


def material(name, color, roughness=0.8, metal=0, bump=0.12):
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = (*color, 1)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    bsdf = nodes.get('Principled BSDF')
    bsdf.inputs['Base Color'].default_value = (*color, 1)
    bsdf.inputs['Roughness'].default_value = roughness
    bsdf.inputs['Metallic'].default_value = metal
    if bump:
        tex = nodes.new('ShaderNodeTexNoise')
        tex.inputs['Scale'].default_value = 5
        tex.inputs['Detail'].default_value = 4
        ramp = nodes.new('ShaderNodeValToRGB')
        ramp.color_ramp.elements[0].color = (*(c * .45 for c in color), 1)
        ramp.color_ramp.elements[1].color = (*color, 1)
        coords = nodes.new('ShaderNodeTexCoord')
        mat.node_tree.links.new(coords.outputs['Object'], tex.inputs['Vector'])
        mat.node_tree.links.new(tex.outputs['Fac'], ramp.inputs[0])
        mat.node_tree.links.new(ramp.outputs[0], bsdf.inputs['Base Color'])
        relief = nodes.new('ShaderNodeBump')
        relief.inputs['Strength'].default_value = bump
        relief.inputs['Distance'].default_value = .15
        mat.node_tree.links.new(tex.outputs['Fac'], relief.inputs['Height'])
        mat.node_tree.links.new(relief.outputs[0], bsdf.inputs['Normal'])
    return mat


def mesh(name, verts, faces, mat):
    data = bpy.data.meshes.new(name)
    data.from_pydata(verts, [], faces)
    data.update()
    obj = bpy.data.objects.new(name, data)
    bpy.context.collection.objects.link(obj)
    obj.data.materials.append(mat)
    uv = data.uv_layers.new(name='Planar ground coordinates')
    for loop in data.loops:
        point = data.vertices[loop.vertex_index].co
        uv.data[loop.index].uv = (point.x*.35, point.y*.35)
    return obj


def cube(name, loc, scale, mat, bevel=0):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    obj.data.materials.append(mat)
    if bevel:
        mod = obj.modifiers.new('Rounded worn edges', 'BEVEL')
        mod.width = bevel
        mod.segments = 2
        obj.modifiers.new('Weighted normals', 'WEIGHTED_NORMAL')
    return obj


def ball(name, loc, scale, mat, detail=2):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=detail, radius=1, location=loc)
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    obj.data.materials.append(mat)
    for polygon in obj.data.polygons:
        polygon.use_smooth = True
    return obj


def pole(name, start, end, radius, mat, vertices=8):
    delta = Vector(end) - Vector(start)
    bpy.ops.mesh.primitive_cone_add(vertices=vertices, radius1=radius, radius2=radius*.76,
                                  depth=delta.length, location=(Vector(start)+Vector(end))/2)
    obj = bpy.context.object
    obj.name = name
    obj.rotation_euler = delta.to_track_quat('Z', 'Y').to_euler()
    obj.data.materials.append(mat)
    for polygon in obj.data.polygons:
        polygon.use_smooth = True
    return obj


def height(x, y, seed):
    value=noise.noise_vector(Vector((x*.045, y*.045, seed*.01)))[0]*2.4 + math.sin(y*.09)*.65
    if seed in [2721,2723,2726,2727]:
        distance=abs(x-2-math.sin(y*.04)*.6)
        if distance<6:
            bed=min(.55,-1.4+max(0,distance-1.8)*1.2)+value*.08
            blend=max(0,min(1,(distance-4)/2))
            value=bed*(1-blend)+value*blend
    return value


def terrain(seed, mat, fine=False):
    n = 240 if fine else 80
    verts = []
    for j in range(n+1):
        for i in range(n+1):
            x, y = (i/n-.5)*240, (j/n-.3)*240
            verts.append((x, y, height(x,y,seed)))
    faces = [(j*(n+1)+i, j*(n+1)+i+1, (j+1)*(n+1)+i+1, (j+1)*(n+1)+i)
             for j in range(n) for i in range(n)]
    obj = mesh('Fine continuous natural ground' if fine else 'Natural ground proxy', verts, faces, mat)
    obj['render_only']=fine
    obj.hide_render=not fine
    for p in obj.data.polygons:
        p.use_smooth = True
    if not fine:
        terrain(seed,mat,True)


def tower(x, y, z, h, white):
    # Local composition scale, not an engineering dimension model. Far towers
    # represent 300–700 m lore structures; no roads or city density.
    verts, faces = [], []
    for level in range(25):
        t = level/24
        r = .32*(1-t)+.08
        for j in range(12):
            angle = j*math.tau/12+t*.55
            verts.append((x+r*math.cos(angle), y+r*math.sin(angle), z+h*t))
    for level in range(24):
        for j in range(12):
            a=level*12+j
            b=level*12+(j+1)%12
            faces.append((a,b,b+12,a+12))
    mesh('Slender ceramic Chord tower', verts, faces, white)
    for t in [.23,.42,.61,.80]:
        bpy.ops.mesh.primitive_torus_add(major_segments=16,minor_segments=4,
            location=(x,y,z+h*t), major_radius=.50*(1-t)+.15, minor_radius=.065)
        bpy.context.object.data.materials.append(white)
        bpy.context.object.name='Bamboo emitter ring'


def tree(x, y, z, size, bark, leaf, rng, apple=None):
    # Tiny proxy is exported to the browser. Sapling detail is render-only,
    # with three shared botanical templates instead of unique heavy meshes.
    trunk=pole('Tree trunk proxy',(x,y,z),(x,y,z+size*.7),size*.065,bark)
    trunk.hide_render=True
    crown=ball('Leaf crown proxy',(x,y,z+size*.73),(size*.30,size*.30,size*.32),leaf)
    crown.hide_render=True
    natural_tree(x,y,z,size,bark,leaf,rng.randrange(100000))
    if apple:
        for i in range(18):
            angle=rng.random()*math.tau
            radius=rng.uniform(.5,1.8)
            ball('Apple on its original branch',
                 (x+math.cos(angle)*radius,y+math.sin(angle)*radius,z+size*.65+rng.uniform(-1,1)),
                 (.12,.12,.13),apple)


def vegetation(seed, mats, forest=True, sparse=False):
    rng=random.Random(seed)
    for index in range(38 if forest else 12):
        x,y=rng.uniform(-26,26),rng.uniform(6,48)
        if not forest and index<6:
            x=(-1 if index%2 else 1)*rng.uniform(8,16)
            y=4+index*5
        if abs(x)<5 and y<24:
            continue
        tree(x,y,height(x,y,seed),rng.uniform(4,9),mats['bark'],mats['leaf'],rng)
    # Linked botanical silhouettes close the natural horizon. These distant
    # render-only trees cost no extra browser triangles.
    for index in range(24):
        x,y=-115+index*10,rng.uniform(78,110)
        natural_tree(x,y,height(x,y,seed),rng.uniform(9,16),mats['bark'],mats['leaf'],rng.randrange(100000))
    # Individual geometry blades in a single mesh, with no costly hair system.
    verts,faces=[],[]
    for _ in range(1800 if not sparse else 170):
        x,y=rng.uniform(-28,28),rng.uniform(-12,38)
        z=height(x,y,seed)
        h=rng.uniform(.10,.46)
        a=len(verts)
        verts.extend([(x-.025,y,z),(x+.025,y,z),(x+.10,y+.02,z+h)])
        faces.append((a,a+1,a+2))
    mesh('Meadow grass blades',verts,faces,mats['leaf'])
    for _ in range(40 if not sparse else 4):
        x,y=rng.uniform(-20,20),rng.uniform(-8,24)
        ball('Small living clover',(x,y,height(x,y,seed)+.14),(.10,.10,.05),mats['flower'],1)


def buildings(seed,mats,snow=False):
    rng=random.Random(seed)
    for i in range(9):
        x=(-1 if i%2 else 1)*rng.uniform(7,21)
        y=8+i*4
        footprint=[height(x+dx,y+dy,seed) for dx in [-2.5,0,2.5] for dy in [-2,0,2]]
        z=max(footprint)+.08
        bottom=min(footprint)-.6
        cube('Shelter masonry foundation',(x,y,(z+bottom)/2),(5,4,z-bottom),mats['rock'])
        h=rng.uniform(2.1,4.2)
        cube('Repaired brick shelter',(x,y,z+h/2),(5,4,h),mats['brick'],.08)
        roof=cube('Corrugated patched roof',(x,y,z+h+.1),(5.5,4.7,.18),mats['snow'] if snow else mats['rust'])
        roof.rotation_euler.y=.08
        for n in range(6):
            pole('Roof seam',(x-2.4+n*.9,y-2.35,z+h+.20),(x-2.4+n*.9,y+2.35,z+h+.20),.035,mats['rust'],4)
        cube('Recessed window frame',(x,y-2.025,z+h*.55),(1.3,.06,1.1),mats['dark'],.025)
        cube('Warm window',(x,y-2.065,z+h*.55),(1.0,.025,.8),mats['window'])
        cube('Window mullion',(x,y-2.085,z+h*.55),(.055,.025,.85),mats['rust'])
        pole('Chimney',(x+1.5,y,z+h),(x+1.5,y,z+h+1.2),.14,mats['rust'])
        roof_rng=random.Random(seed+i*101)
        for item in range(4):
            rx,ry=x+roof_rng.uniform(-1.8,1.8),y+roof_rng.uniform(-1.4,1.4)
            pole('Stored rooftop pipe',(rx,ry,z+h+.28),(rx+.8,ry+.3,z+h+.28),.09,mats['rust'],8)
        cube('Reused rooftop timber',(x-1,y+.7,z+h+.25),(1.5,.25,.15),mats['bark'],.025)
    for _ in range(28):
        x,y=rng.uniform(-25,25),rng.uniform(-5,40)
        if abs(x)<4: continue
        ball('Salvaged rusted metal',(x,y,height(x,y,seed)+.35),(.6,.9,.35),mats['rust'],1)


def radio(loc,mats,powered=False):
    x,y,z=loc
    cube('Repaired walnut radio',(x,y,z+.5),(1.8,.7,1),mats['bark'],.08)
    cube('Speaker grille',(x-.35,y-.36,z+.52),(.72,.025,.6),mats['dark'])
    for index in range(18):
        gx=x-.69+index*.04
        pole('Radio grille wire',(gx,y-.38,z+.23),(gx,y-.38,z+.81),.006,mats['copper'],4)
    cube('Radio tuning scale',(x+.45,y-.37,z+.78),(.65,.025,.13),mats['paper'])
    for index in range(11):
        gx=x+.16+index*.055
        pole('Radio scale tick',(gx,y-.39,z+.74),(gx,y-.39,z+.81),.003,mats['dark'],4)
    for dx in [.30,.63]:
        ball('Tuning knob',(x+dx,y-.4,z+.45),(.11,.045,.11),mats['rust'])
    for dx in [-.45,0,.45]:
        pole('Radio tube socket',(x+dx,y,z+.96),(x+dx,y,z+1.04),.11,mats['dark'],12)
        ball('Vacuum tube glass',(x+dx,y,z+1.20),(.10,.10,.19),mats['glass'],3)
        pole('Radio tube filament',(x+dx,y,z+1.04),(x+dx,y,z+1.28),.015,mats['lamp'] if powered else mats['copper'],8)
    pole('Copper aerial',(x,y,z+1),(x+.3,y,z+4),.018,mats['copper'])


def room(seed,mats,kind):
    repair=kind=='repair'
    tracking=kind=='tracking'
    for row in range(36):
        cube('Individual floor slab',(-8.75+row*.5,1,-.12),(.49,20,.22),mats['rock'] if repair or kind=='school' else mats['rust'],.012)
    wall=mats['rust'] if tracking else mats['brick']
    cube('Weathered back wall',(0,8,1.6 if repair else 3),(18,.3,3.2 if repair else 6),wall)
    cube('Side wall',(-8,0,3),(.3,16,6),wall)
    if not repair: cube('Opposite wall',(8,0,3),(.3,16,6),wall)
    cube('Bridge deck' if repair else 'Low ceiling',(0,1,6.1),(18,20,.2),mats['rust'] if repair or tracking else mats['bark'])
    for y in [-5,-1,3,7]:
        cube('Riveted girder' if repair else 'Ceiling joist',(0,y,5.8),(16,.20,.35),mats['rust'] if repair or tracking else mats['bark'],.02)
        if repair or tracking:
            for x in range(-7,8):ball('Girder rivet',(x,y-.12,5.8),(.045,.025,.045),mats['rust'],1)
    if not repair:
        cube('Window frame',(1,7.8,3.8),(4,.2,2.4),mats['dark'])
        cube('Frosted window',(1,7.65,3.8),(3.7,.05,2.1),mats['sky'])
        for x in [-.1,2.1]: cube('Window mullion',(x,7.55,3.8),(.10,.1,2.3),mats['rust'])
    else:
        for x in [-7,7]:cube('Bridge support',(x,6,2.8),(.5,.6,5.6),mats['rust'],.04)
        for side in [-1,1]:
            pole('Bridge diagonal brace',(side*7,6,5.7),(side*3.8,6,3.3),.13,mats['rust'],8)
        cube('Wet cobbled street',(0,20,-.2),(38,25,.3),mats['rock'])
        for x in [-12,14]:
            cube('Wet street shelter',(x,20,1.6),(6,6,3.2),mats['brick'])
            cube('Street shelter roof',(x,20,3.3),(6.5,6.5,.2),mats['rust'])
    cube('Repair table',(0,2,1.25),(7 if repair else 5,2.3,.22),mats['bark'],.04)
    for x in [-2,2]:
        for y in [1.15,2.85]: cube('Table leg',(x,y,.58),(.12,.12,1.2),mats['rust'])
    radio((0 if repair else -.5,2,1.36),mats)
    cube('Folded paper and slate',(1.3,1.5,1.39),(1,.7,.03),mats['paper'])
    pole('Handmade plant pot',(2,2.6,1.39),(2,2.6,1.68),.17,mats['brick'],24)
    for index in range(9):
        angle=index*math.tau/9
        leaf=ball('Living windowsill plant leaf',
                  (2+math.cos(angle)*.16,2.6+math.sin(angle)*.16,1.78+index*.025),(.08,.21,.025),mats['leaf'],2)
        leaf.rotation_euler=(.3,angle*.2,angle)
    cube('Small warm lamp',(-2,2.5,1.8),(.25,.25,.8),mats['lamp'],.05)
    # A working room with handmade tools and visible analog construction.
    for x in [-6,-4.5,4.5,6]:
        cube('Wall shelf',(x,7.3,2.5),(1.2,1,.12),mats['bark'],.02)
        for index in range(5):
            cube('Notebook spine',(x-.45+index*.2,7.25,2.9),(.12,.6,.65),mats['paper'],.01)
    for index in range(8):
        x=-2+index*.55
        pole('Bench screw',(x,1.15,1.39),(x,1.15,1.43),.018,mats['rust'],6)
    for index in range(12):
        x=-3+index*.5
        pole('Hanging hand tool',(x,7.7,1.8),(x+.06,7.7,2.35),.025,mats['rust'])
        cube('Tool grip',(x,7.7,2.4),(.07,.06,.2),mats['bark'],.02)
    cube('Tool hanging rail',(0,7.75,2.58),(7,.15,.16),mats['bark'],.02)
    if kind=='school':
        for i in range(5):
            sx=-3+i*1.4
            cube('Small study desk',(sx,4.8,1.03),(1.15,.9,.12),mats['bark'],.025)
            for dx in [-.45,.45]:
                for dy in [-.33,.33]:
                    cube('Study desk leg',(sx+dx,4.8+dy,.49),(.09,.09,.98),mats['bark'],.01)
            cube('Slates for sharing',(sx,4.8,1.12),(.8,.7,.05),mats['dark'])
            cube('Low stool',(sx,3.8,.49),(.7,.6,.10),mats['bark'],.02)
            for dx in [-.23,.23]:
                pole('Stool leg',(sx+dx,3.8,0),(sx+dx,3.8,.45),.05,mats['bark'])
        cube('Small coal stove',(-5,3,.6),(1.3,1.3,1.2),mats['dark'],.04)
        pole('Stove pipe',(-5,3,1.1),(-5,3,5.9),.11,mats['rust'],12)
        pole('Dented soup pot',(-5,3,1.25),(-5,3,1.75),.40,mats['rust'],16)
        for index in range(10):ball('Counting dot',(-4+index*.8,-2,.02),(.12,.12,.012),mats['paper'],2)
    if kind=='tracking':
        for i in range(4):
            cube('Vacuum tube instrument cabinet',(-5+i*3,7,1.5),(2.3,1,3),mats['rust'],.05)
            for j in range(3): ball('Analog dial',(-5+i*3,6.45,1+j*.5),(.26,.035,.26),mats['paper'])


def orbit(mats):
    bpy.context.scene.world.color=(.002,.003,.008)
    asteroid=ball('Carbonaceous asteroid',(0,18,1),(10,8,7),mats['rock'],3)
    weathered_stone(asteroid,2737)
    bpy.ops.mesh.primitive_torus_add(major_segments=48,minor_segments=8,
        location=(0,17,2),major_radius=12,minor_radius=.42)
    bpy.context.object.data.materials.append(mats['white'])
    for x in [-3,3]: cube('Electromagnetic launch rail',(x,3,0),(.2,30,.2),mats['white'])
    cube('White ceramic receiving hangar',(0,12,1),(7,5,3),mats['white'],.2)
    cube('Recessed receiving hangar aperture',(0,9.48,1),(5,.04,2.2),mats['dark'],.10)
    for index in range(48):
        angle=index*math.tau/48
        x,y=math.cos(angle)*12,17+math.sin(angle)*12
        panel=cube('Segmented ceramic ring cladding',(x,y,2),(.40,1.42,.45),mats['white'],.025)
        panel.rotation_euler.z=angle
        if index%4==0:
            pole('Ring service strut',(x,y,1.9),(x*.73,17+(y-17)*.73,1.9),.09,mats['rust'],10)
    for index in range(22):
        for x in [-3,3]:
            cube('Accelerator coil housing',(x,-11+index*1.25,0),(.5,.48,.55),mats['white'],.04)
    for side in [-1,1]:
        for row in range(12):
            cube('Thermal radiator fin',(side*(7+row*.26),8,2.8),(.16,6,.08),mats['dark'],.012)
        pole('Radiator support',(side*3.5,12,2.7),(side*10,8,2.7),.08,mats['white'],10)
    for column in range(6):
        for row in range(3):
            cube('Hangar ceramic service panel',(-2.85+column*1.14,10+row*1.35,2.53),(1.10,1.30,.04),mats['white'],.014)
    for i in range(100):
        rng=random.Random(i)
        ball('Distant star',(rng.uniform(-90,90),100,rng.uniform(-15,80)),(.05,.05,.05),mats['lamp'],1)


def paired_worlds(seed,mats):
    """Two separate stages for the pilot's alternating planetary viewpoints."""
    rng=random.Random(seed)
    cube('Raya stage',(-9,9,-.35),(16,25,.7),mats['ground'],.05)
    cube('Shacados stage',(9,9,-.35),(16,25,.7),mats['rock'],.05)
    for x,y,size in [(-15,9,9),(-5,15,7),(-14,19,10),(-7,4,4)]:
        tree(x,y,0,size,mats['bark'],mats['leaf'],rng)
    tower(-11,20,0,16,mats['white'])
    for index in range(80):
        x,y=rng.uniform(-16,-2),rng.uniform(-2,20)
        ball('Raya clover',(x,y,.1),(.18,.18,.08),mats['leaf'],1)
    for x,y in [(6,11),(13,16),(5,20)]:
        cube('Repaired brick shelter',(x,y,1.5),(5,4,3),mats['brick'],.04)
        cube('Rusted shelter roof',(x,y,3.1),(5.5,4.7,.15),mats['rust'])
        cube('A light kept burning',(x,y-2.02,1.5),(.9,.025,1),mats['window'])
    cube('Radio roof',(9,4,.5),(10,9,.25),mats['rust'])
    radio((9,3,.65),mats)
    ball('One living rooftop plant',(13,3,.9),(.25,.25,.4),mats['leaf'])
    settlement_detail({'seed':seed,'kind':'two-skies'},mats,(ball,cube,pole,tree,lambda x,y,s:0))
    # Fine vegetation remains on Raya's own stage; no shared planetary ground.
    from detail import detail_mesh
    vertices,faces=[],[]
    for index in range(18000):
        x,y=rng.uniform(-16.8,-1.2),rng.uniform(-3.4,21.4)
        z=rng.uniform(.09,.32)
        a=len(vertices)
        vertices.extend([(x-.012,y,0),(x+.012,y,0),(x+.05,y+.03,z)])
        faces.append((a,a+1,a+2))
    detail_mesh('Raya stage fine meadow',vertices,faces,mats['leaf'])
    bpy.ops.object.light_add(type='AREA',location=(-9,4,12))
    bpy.context.object.data.energy=750
    bpy.context.object.data.color=(.35,.55,1)
    bpy.context.object.data.size=12


def setup(spec,width,samples):
    reset_trees()
    reset_detail()
    for obj in list(bpy.context.scene.objects): bpy.data.objects.remove(obj,do_unlink=True)
    bpy.data.orphans_purge(do_recursive=True)
    bpy.context.preferences.filepaths.save_version=0
    seed=spec['seed']
    noise.seed_set(seed)
    rng=random.Random(seed)
    sh=spec['world']=='Shacados'
    snow=spec['kind']=='ice'
    mats={
        'ground':material('Sooty earth' if sh else 'Meadow soil',(.16,.12,.07) if sh else (.16,.25,.08)),
        'rock':material('Granite',(.28,.31,.33),.9,bump=.5),
        'leaf':material('Living foliage',(.045,.16,.012),.75),
        'flower':material('Clover blossom',(.80,.77,.68)),
        'bark':material('Weathered wood',(.19,.095,.035),.88,bump=.4),
        'white':material('Pearl ceramic',(.82,.88,.86),.25,.12,.025),
        'rust':material('Oxidised iron',(.25,.095,.035),.9,.48,.5),
        'brick':material('Sooted brick',(.20,.15,.11),.95,bump=.5),
        'snow':material('Soot dusted snow',(.58,.65,.69),.8),
        'paper':material('Aged paper',(.66,.59,.40)),
        'dark':material('Carbon grille',(.025,.032,.025)),
        'lamp':material('Warm lamp glass',(1,.36,.06),.2,0,0),
        'sky':material('Frosted window',(.18,.26,.31),.5),
        'copper':material('Copper',(.40,.19,.07),.45,.8),
        'apple':material('Apple skin',(.40,.025,.012),.27),
        'glass':material('Smoky radio glass',(.12,.15,.14),.15,0,0),
    }
    glass=mats['glass'].node_tree.nodes.get('Principled BSDF')
    glass.inputs['Transmission Weight'].default_value=.65
    glass.inputs['IOR'].default_value=1.45
    lamp=mats['lamp'].node_tree.nodes.get('Principled BSDF')
    # Blender 3.4 and 4.x name the emission socket differently.
    emission=lamp.inputs.get('Emission Color') or lamp.inputs.get('Emission')
    emission.default_value=(1,.25,.025,1)
    if lamp.inputs.get('Emission Strength'): lamp.inputs['Emission Strength'].default_value=3
    mats['window']=mats['lamp'].copy()
    mats['window'].name='Dusty window with diffuse interior light'
    window=mats['window'].node_tree.nodes.get('Principled BSDF')
    window.inputs['Emission Strength'].default_value=.7
    window.inputs['Roughness'].default_value=.48
    surface_textures(mats,sh)
    kind=spec['kind']
    indoor=kind in ['school','repair','tracking']
    if kind=='two-skies': paired_worlds(seed,mats)
    elif kind=='orbit': orbit(mats)
    elif indoor: room(seed,mats,kind)
    else:
        terrain(seed,mats['snow'] if snow else mats['ground'])
        if sh:
            buildings(seed,mats,snow)
            tree(5,5,height(5,5,seed),3,mats['bark'],mats['leaf'],rng)
            masonry(mats,seed,lambda x,y,s: max(height(x+dx,y+dy,s) for dx in [-2.5,0,2.5] for dy in [-2,0,2])+.08)
            if kind in ['radio','answer','two-skies']:
                cube('Patched roof',(0,3,1),(10,10,.25),mats['rust'])
                radio((-.8,2,1.13),mats,True)
            if kind=='launch':
                pole('Uncrewed probe booster',(0,28,0),(0,28,14),.8,mats['rust'],16)
                cube('Distant empty launch platform',(0,28,.3),(5,5,.5),mats['rock'])
        else:
            vegetation(seed,mats,kind in ['apple','eclipse','nest','woods'],kind=='ridge')
            tower(-12,47,height(-12,47,seed),20,mats['white'])
            if kind in ['river','pebbles','delta','glacier']:
                water=material('Water',(.035,.20,.20),.12,.22,.025)
                vertices=[]
                for row in range(81):
                    y=-65+row*2.5
                    center=2+math.sin(y*.04)*.6
                    vertices.extend([(center-4,y,-.15),(center+4,y,-.15)])
                mesh('River surface meeting its carved banks',vertices,
                     [(row*2,row*2+1,row*2+3,row*2+2) for row in range(80)],water)
                for i in range(25):
                    x=(-1 if i%2 else 1)*rng.uniform(4,6)
                    y=rng.uniform(-10,45)
                    ball('River pebble',(x,y,height(x,y,seed)),(.4,.65,.25),mats['rock'])
            if kind=='apple': tree(-3,5,height(-3,5,seed),9,mats['bark'],mats['leaf'],rng,mats['apple'])
            if kind in ['ridge','glacier','eclipse']:
                for i in range(9):
                    x,y=rng.uniform(-26,26),rng.uniform(3,35)
                    stone=ball('Weathered granite',(x,y,height(x,y,seed)),(2,2,2.2),mats['snow'] if kind=='glacier' else mats['rock'],3)
                    weathered_stone(stone,seed+i)
            if kind=='nest':
                cube('White lattice reading platform',(0,6,8),(6,5,.2),mats['white'],.1)
                for i in range(8): pole('Living nest ribs',(-3+i*.85,4,8.1),(-3+i*.85,9,8.1),.045,mats['white'])
            if kind=='woods':
                # Shacados's Last Woods is still a struggling surviving forest.
                for i in range(12): tree(rng.uniform(-10,10),rng.uniform(8,30),0,6,mats['bark'],mats['leaf'],rng)
    if not indoor and kind not in ['orbit','two-skies']:
        if kind in ['ridge','glacier']: distant_hills(seed,mats,mesh)
        if not sh:
            meadow(seed,mats,height,kind=='delta')
            scanned_understory(seed,height)
    landmarks(spec,mats,(ball,cube,pole,tree,height))
    if sh and not indoor and kind!='woods':
        settlement_detail(spec,mats,(ball,cube,pole,tree,height))
    scene=bpy.context.scene
    scene.render.engine='CYCLES'
    scene.cycles.samples=samples
    # The checksum-pinned official build includes this open-source CPU denoiser.
    scene.cycles.use_denoising=True
    scene.cycles.denoiser='OPENIMAGEDENOISE'
    scene.cycles.max_bounces=6
    scene.render.threads_mode='FIXED'
    scene.render.threads=2
    scene.render.resolution_x=width
    scene.render.resolution_y=round(width*9/16)
    scene.render.resolution_percentage=100
    scene.render.image_settings.file_format='PNG'
    world=bpy.data.worlds.new('Atmosphere')
    scene.world=world
    world.use_nodes=True
    background=world.node_tree.nodes.get('Background')
    background.inputs[0].default_value=(.28,.34,.42,1) if sh else (.50,.66,.78,1)
    background.inputs[1].default_value=.25 if spec['night'] else .65
    if spec['night']:
        background.inputs[0].default_value=(.045,.065,.11,1)
        background.inputs[1].default_value=.35
        celestial=material('Distant starlight',(.65,.78,1),.5,0,0)
        bsdf=celestial.node_tree.nodes.get('Principled BSDF')
        bsdf.inputs['Emission Color'].default_value=(.65,.78,1,1)
        bsdf.inputs['Emission Strength'].default_value=4
        for index in range(70):
            ball('Night star',(rng.uniform(-100,100),110,rng.uniform(12,85)),(.035,.035,.035),celestial,1)
        if sh or spec['number']==22:
            color=(1,.90,.60) if sh else (1,.32,.065)
            companion=material('Companion star light',color,.5,0,0)
            shader=companion.node_tree.nodes.get('Principled BSDF')
            shader.inputs['Emission Color'].default_value=(*color,1)
            shader.inputs['Emission Strength'].default_value=12
            ball('Raya as one pale-yellow unresolved point' if sh else
                 'Shacados as one orange unresolved point',(-24,105,35),
                 (.17,.17,.17),companion,2)
        if not sh and (kind in ['festival','nest'] or spec['number']==22):
            ball('Pim, the larger moon',(-22,100,34),(1.2,1.2,1.2),mats['flower'],3)
            ball('Pom, the smaller moon',(-16,100,36),(.7,.7,.7),mats['flower'],3)
        if not sh and spec['number']==22:
            for index in range(180):
                x=rng.uniform(-100,100)
                z=42+x*.18+rng.gauss(0,5)
                radius=rng.uniform(.018,.045)
                star=ball('Milky Way star field',(x,115,z),(radius,)*3,celestial,1)
                star['render_only']=True
    if kind=='orbit': background.inputs[1].default_value=.015
    bpy.ops.object.light_add(type='SUN',location=(-8,-8,15))
    sun=bpy.context.object
    sun.rotation_euler=(math.radians(38),math.radians(-28),math.radians(-28))
    sun.data.energy=0 if indoor else (2.5 if kind=='orbit' else .6 if spec['night'] else 1.0 if sh else 1.3)
    sun.data.angle=.30 if sh else .10
    sun.data.color=(.55,.68,1) if spec['night'] else (.85,.80,.66) if sh else (1,.88,.71)
    bpy.ops.object.light_add(type='AREA',location=(-3,-1,4.8 if indoor else 14 if kind=='nest' else 10))
    bpy.context.object.data.energy=(900 if indoor else 2500) if sh else (500 if indoor else 2500 if spec['night'] else 850)
    bpy.context.object.data.shape='DISK'
    bpy.context.object.data.size=8
    bpy.context.object.data.color=(1,.78,.52) if indoor else (.68,.78,1) if spec['night'] else (.85,.88,1)
    light=bpy.context.object
    light.rotation_euler=(Vector((0,3,1.5) if indoor else (0,12,4 if kind=='nest' else 1.5))-light.location).to_track_quat('-Z','Y').to_euler()
    if indoor:
        bpy.ops.object.light_add(type='AREA',location=(1,7.5,4))
        light=bpy.context.object
        light.data.energy=700 if sh else 500
        light.data.size=3
        light.data.color=(.52,.72,1)
        light.rotation_euler=(Vector((0,2,1.5))-light.location).to_track_quat('-Z','Y').to_euler()
    sky(scene,spec)
    camera=(8,-10,5) if indoor else (7,-10,height(7,-10,seed)+1.8)
    target=(0,3,1.7) if indoor else (0,22,3)
    if kind=='repair': camera=(7,-8,4.5); target=(0,3,2.5)
    if kind=='school': camera=(6,-5,4); target=(-.5,4,1.5)
    if kind=='tracking': camera=(7,-7,4.5); target=(0,5,2.2)
    if kind=='launch': camera=(16,0,6); target=(0,28,7)
    if kind=='orbit': camera=(22,-28,15); target=(0,14,2)
    if kind=='two-skies': camera=(0,-21,9); target=(0,8,2)
    if kind=='nest': camera=(7,-10,10); target=(0,6,9)
    bpy.ops.object.camera_add(location=camera)
    bpy.context.object.rotation_euler=(Vector(target)-Vector(camera)).to_track_quat('-Z','Y').to_euler()
    bpy.context.object.data.lens=36
    scene.camera=bpy.context.object
    scene.view_settings.view_transform='AgX' if bpy.app.version[0]>=4 else 'Filmic'
    scene.view_settings.look='None'
    scene.view_settings.exposure=1.2 if sh else .7 if spec['night'] else 0
    scene.view_settings.gamma=1
    return camera,target


def split_worlds(spec, out, width, samples):
    """Render distant settings independently for the pilot's split frame.

    Full environments and packed native frames stay in the Blender project.
    Re-running this script refreshes both frames before composing the result.
    The lightweight browser export remains a separate paired study.
    """
    composite=bpy.context.scene
    composite.name='Two skies — split frame'
    composite.use_fake_user=True
    for obj in list(composite.objects):
        if obj.type!='CAMERA': bpy.data.objects.remove(obj,do_unlink=True)
    images=[]
    for frame in spec['nativeFrames']:
        side,world=frame['side'],frame['world']
        scene=bpy.data.scenes.new(f'Two skies — {world} environment')
        scene.use_fake_user=True
        bpy.context.window.scene=scene
        setup({**spec,**frame},width,samples)
        scene.render.resolution_x=width//2
        scene.render.resolution_y=round(width*9/16)
        # Scene-linear frames avoid applying the display transform twice.
        scene.render.image_settings.file_format='OPEN_EXR'
        scene.render.image_settings.color_depth='32'
        scene.render.image_settings.color_mode='RGBA'
        path=out/f'{side}-native-frame.exr'
        scene.render.filepath=str(path)
        bpy.ops.render.render(write_still=True)
        # setup() purges unused data while building the next world. Defer
        # loading these frames until both scenes exist, then link them at once.
        images.append(path)
    bpy.context.window.scene=composite
    composite.use_nodes=True
    nodes=composite.node_tree.nodes
    nodes.clear()
    previous=nodes.new('CompositorNodeRLayers')
    for index,path in enumerate(images):
        source=nodes.new('CompositorNodeImage')
        source.image=bpy.data.images.load(str(path),check_existing=True)
        transform=nodes.new('CompositorNodeTransform')
        transform.inputs['X'].default_value=(-1 if index==0 else 1)*width/4
        composite.node_tree.links.new(source.outputs['Image'],transform.inputs['Image'])
        over=nodes.new('CompositorNodeAlphaOver')
        over.inputs[0].default_value=1
        composite.node_tree.links.new(previous.outputs['Image'],over.inputs[1])
        composite.node_tree.links.new(transform.outputs['Image'],over.inputs[2])
        previous=over
    output=nodes.new('CompositorNodeComposite')
    composite.node_tree.links.new(previous.outputs['Image'],output.inputs['Image'])
    composite['composition']='Independent Raya and Shacados environments; split frame'


def export_web(path,camera,target,spec):
    # Export base geometry (without render modifiers) as flat-shaded triangles.
    # Each triangle repeats vertices: no uint32-index extension or large assets.
    bpy.context.view_layer.update()
    positions,colors=[],[]
    for obj in bpy.context.scene.objects:
        if obj.type!='MESH': continue
        if obj.get('render_only'): continue
        data=obj.data
        data.calc_loop_triangles()
        color=list(data.materials[0].diffuse_color[:3]) if data.materials else [.5,.5,.5]
        for triangle in data.loop_triangles:
            points=[obj.matrix_world @ data.vertices[i].co for i in triangle.vertices]
            normal=(points[1]-points[0]).cross(points[2]-points[0]).normalized()
            brightness=.45+.55*max(0,normal.dot(Vector((-.3,-.4,.86))))
            for point in points:
                positions.extend(round(v,3) for v in point)
                colors.extend(round(c*brightness,3) for c in color)
    vertices=len(positions)//3
    if vertices>180000: raise ValueError(f'Web scene exceeds 60k-triangle budget: {vertices}')
    result={'version':1,'id':spec['id'],'positions':positions,'colors':colors,
            'camera':camera,'target':target,'background':[.09,.12,.14] if spec['world']=='Shacados' else [.48,.64,.73],
            'triangles':vertices//3,'units':'composition units; not an engineering scale model'}
    path.write_text(json.dumps(result,separators=(',',':'))+'\n')
    if path.stat().st_size>4_000_000: raise ValueError('Web scene exceeds 4 MB budget')
    return result['triangles']


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--scene')
    parser.add_argument('--all',action='store_true')
    parser.add_argument('--batch',help='Zero-based CI batch, for example 0/4')
    parser.add_argument('--out',type=Path,default=ROOT/'docs/master-plan/lore/scenes')
    parser.add_argument('--width',type=int,default=1280)
    parser.add_argument('--samples',type=int,default=64)
    args=parser.parse_args(sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else [])
    specs=json.loads(SPECS.read_text())
    selected=specs if args.all else [s for s in specs if s['id'].startswith(args.scene or '01-')]
    if args.batch:
        batch,count=map(int,args.batch.split('/'))
        if not 0<=batch<count<=22: raise ValueError('Invalid batch')
        selected=[spec for i,spec in enumerate(selected) if i%count==batch]
    if not selected: raise ValueError('Unknown pilot; choose 01–22 or --all')
    if not 320<=args.width<=1920 or not 1<=args.samples<=128: raise ValueError('Render settings exceed bounded budget')
    for spec in selected:
        camera,target=setup(spec,args.width,args.samples)
        out=args.out/spec['id']
        out.mkdir(parents=True,exist_ok=True)
        triangles=export_web(out/'scene.json',camera,target,spec)
        if spec['kind']=='two-skies': split_worlds(spec,out,args.width,args.samples)
        bpy.context.scene.render.filepath=str(out/'poster.png')
        bpy.ops.file.pack_all()
        bpy.ops.wm.save_as_mainfile(filepath=str(out/'environment.blend'),compress=True)
        bpy.ops.render.render(write_still=True)
        files={p.name:{'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()}
               for p in out.iterdir() if p.name in ['poster.png','scene.json','environment.blend']}
        report={**spec,'blender':bpy.app.version_string,'engine':'Cycles CPU','samples':args.samples,
                'denoiser':'OpenImageDenoise',
                'resolution':[args.width,round(args.width*9/16)],'triangles':triangles,'files':files,
                'source':'examples/lore-scenes/render.py','seed':spec['seed']}
        inputs=['render.py','detail.py','trees.py','scenes.json','assets/manifest.json']
        report['sourceInputs']={name:hashlib.sha256((SPECS.parent/name).read_bytes()).hexdigest() for name in inputs}
        (out/'manifest.json').write_text(json.dumps(report,indent=2)+'\n')
        print('SCENE_COMPLETE '+json.dumps({'id':spec['id'],'triangles':triangles,'files':files}),flush=True)


if __name__=='__main__': main()
