"""Sapling (Blender's GPL tree generator) detail with shared mesh data.

The distribution-provided add-on supplies a botanical branching algorithm.
Our bounded settings are original presets. Browser geometry uses simple proxies.
"""
import math
import random

import bpy
from mathutils import Matrix

TEMPLATES={}


def reset():
    TEMPLATES.clear()


def natural_tree(x,y,z,size,bark,leaf,seed):
    variant=seed%3
    if variant not in TEMPLATES:
        bpy.ops.preferences.addon_enable(module='add_curve_sapling')
        previous=set(bpy.context.scene.objects)
        bpy.ops.curve.tree_add(seed=variant+70,showLeaves=True,levels=3,
            scale=8,scaleV=0,branches=(0,35,12,5),baseSize=.25,
            length=(1,.48,.45,.4),lengthV=(0,.12,.2,0),
            curveRes=(6,4,2,1),curve=(0,25,15,0),curveV=(10,35,30,0),
            downAngle=(90,48,45,45),downAngleV=(0,30,12,10),
            rotate=(99,137.5,137.5,137.5),rotateV=(12,15,10,0),
            segSplits=(.1,.15,.1,0),splitAngle=(8,18,18,0),
            leaves=32,leafScale=.22,leafScaleX=.55,leafScaleV=.25,
            leafShape='hex',leafDist='6',bevel=True,bevelRes=1,
            resU=3,ratio=.018,ratioPower=1.2,prune=False)
        parts=list(set(bpy.context.scene.objects)-previous)
        for part in parts:
            part.data.materials.clear()
            part.data.materials.append(leaf if part.type=='MESH' else bark)
            part['render_only']=True
            part.hide_render=True
        TEMPLATES[variant]=parts
    rng=random.Random(seed)
    transform=Matrix.Translation((x,y,z)) @ Matrix.Rotation(rng.random()*math.tau,4,'Z') @ Matrix.Scale(size/8,4)
    for part in TEMPLATES[variant]:
        instance=part.copy()
        instance.data=part.data
        instance.parent=None
        instance.matrix_world=transform @ part.matrix_world
        instance.hide_render=False
        instance['render_only']=True
        bpy.context.collection.objects.link(instance)
