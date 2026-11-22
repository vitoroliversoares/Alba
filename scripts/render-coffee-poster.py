"""Renderiza o GLB real como alternativa estática à cena WebGL."""
import bpy
from mathutils import Vector
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=str(ROOT/'public/assets/models/copo-cafe.glb'))
palette={'Cafe_Corpo':'16483B','Cafe_Faixa_Pessego':'F2D38B','Cafe_Tampa':'F7F2E9'}
def linear(c):return c/12.92 if c<=.04045 else ((c+.055)/1.055)**2.4
for obj in bpy.context.scene.objects:
    if obj.type!='MESH':continue
    for mat in obj.data.materials:
        rgb=tuple(linear(int(palette[obj.name][i:i+2],16)/255) for i in (0,2,4))
        mat.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value=(*rgb,1)
        mat.node_tree.nodes['Principled BSDF'].inputs['Roughness'].default_value=.6
scene=bpy.context.scene
scene.render.engine='CYCLES'
scene.cycles.samples=24
scene.cycles.use_denoising=True
scene.render.threads_mode='FIXED';scene.render.threads=4
scene.render.resolution_x=900;scene.render.resolution_y=1000;scene.render.resolution_percentage=100
scene.render.film_transparent=True
scene.render.image_settings.color_mode='RGBA'
scene.view_settings.view_transform='AgX'
scene.world=bpy.data.worlds.new('Studio')
scene.world.use_nodes=True
scene.world.node_tree.nodes['Background'].inputs[0].default_value=(.6,.6,.6,1)
scene.world.node_tree.nodes['Background'].inputs[1].default_value=.45
for name,position,energy,size in [('Key',(.2,-.35,.45),13,.5),('Fill',(-.35,-.1,.2),5,.45),('Rim',(.1,.3,.35),10,.3)]:
    data=bpy.data.lights.new(name,'AREA');data.energy=energy;data.size=size
    light=bpy.data.objects.new(name,data);scene.collection.objects.link(light);light.location=position
    light.rotation_euler=(Vector((0,0,.07))-light.location).to_track_quat('-Z','Y').to_euler()
camera_data=bpy.data.cameras.new('Camera');camera=bpy.data.objects.new('Camera',camera_data)
scene.collection.objects.link(camera);scene.camera=camera
camera_data.type='ORTHO';camera_data.ortho_scale=.22
camera.location=(.22,-.34,.22);camera.rotation_euler=(Vector((0,0,.07))-camera.location).to_track_quat('-Z','Y').to_euler()
scene.render.filepath=str(ROOT/'public/assets/coffee-poster.png')
bpy.ops.render.render(write_still=True)
