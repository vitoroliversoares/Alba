"""Model a linen napkin and render the approved cup for the support fork."""
from pathlib import Path
import math
import bpy
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[1]
bpy.ops.wm.read_factory_settings(use_empty=True)

def color(hexcode):
    values = [int(hexcode[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(v / 12.92 if v <= .04045 else ((v + .055) / 1.055) ** 2.4 for v in values) + (1,)

def material(name, hexcode, roughness=.7):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    shader = mat.node_tree.nodes.get('Principled BSDF')
    shader.inputs['Base Color'].default_value = color(hexcode)
    shader.inputs['Roughness'].default_value = roughness
    return mat

bpy.ops.import_scene.gltf(filepath=str(ROOT / 'public/assets/models/copo-cafe.glb'))
palette = {'Cafe_Corpo': '16483B', 'Cafe_Faixa_Pessego': 'EFE5CD', 'Cafe_Tampa': 'F7F2E9'}
for obj in list(bpy.context.scene.objects):
    if obj.type == 'MESH':
        obj.location.z += .0036
        obj.data.materials.clear()
        obj.data.materials.append(material(obj.name + '_Matte', palette[obj.name], .64))

linen = material('Natural flax linen', 'E4D3AD', .92)
nodes, links = linen.node_tree.nodes, linen.node_tree.links
tex = nodes.new('ShaderNodeTexNoise')
tex.inputs['Scale'].default_value = 260
tex.inputs['Detail'].default_value = 2
bump = nodes.new('ShaderNodeBump')
bump.inputs['Strength'].default_value = .12
bump.inputs['Distance'].default_value = .00012
links.new(tex.outputs['Fac'], bump.inputs['Height'])
links.new(bump.outputs['Normal'], nodes.get('Principled BSDF').inputs['Normal'])

# Two offset layers give the folded fabric thickness without a rigid plinth.
def cloth_layer(name, width, depth, height, angle, offset):
    size = 40
    vertices, faces = [], []
    for j in range(size + 1):
        y = (j / size - .5) * depth
        for i in range(size + 1):
            x = (i / size - .5) * width
            edge = max(abs(x) / (width / 2), abs(y) / (depth / 2)) ** 5
            wave = (.00055 * math.sin(x * 100 + y * 65) + .00035 * math.cos(y * 155)) * edge
            crease = .0007 * math.exp(-((y + depth * .35) / .008) ** 2)
            vertices.append((x, y, height + wave + crease))
    for j in range(size):
        for i in range(size):
            a = j * (size + 1) + i
            faces.append((a, a + 1, a + size + 2, a + size + 1))
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(vertices, [], faces)
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    obj.data.materials.append(linen)
    obj.rotation_euler.z = math.radians(angle)
    obj.location.x, obj.location.y = offset
    solid = obj.modifiers.new('Soft folded edge', 'SOLIDIFY')
    solid.thickness = .00065
    bevel = obj.modifiers.new('Rounded fabric edge', 'BEVEL')
    bevel.width = .0005
    bevel.segments = 3
    for face in mesh.polygons:
        face.use_smooth = True
    return obj

cloth_layer('Linen lower fold', .155, .126, .0012, -16, (.006, -.003))
cloth_layer('Linen upper fold', .151, .12, .0024, -12, (.002, .001))

# No floor or shadow catcher: their wide translucent shadow reached the image
# boundary. Contact shadows remain between the cup and the fabric itself.

scene = bpy.context.scene
scene.render.engine = 'CYCLES'
scene.cycles.samples = 32
scene.cycles.use_denoising = True
scene.render.threads_mode = 'FIXED'
scene.render.threads = 6
scene.render.resolution_x = 960
scene.render.resolution_y = 1040
scene.render.resolution_percentage = 100
scene.render.film_transparent = True
scene.render.image_settings.file_format = 'PNG'
scene.render.image_settings.color_mode = 'RGBA'
scene.view_settings.view_transform = 'AgX'
scene.view_settings.exposure = -.8
scene.world = bpy.data.worlds.new('Warm studio')
scene.world.use_nodes = True
scene.world.node_tree.nodes['Background'].inputs[0].default_value = (.78, .73, .64, 1)
scene.world.node_tree.nodes['Background'].inputs[1].default_value = .35
target = Vector((0, 0, .065))
for name, position, energy, size in [
    ('Large window', (-.22, -.3, .42), 10, .35),
    ('Soft fill', (.3, -.05, .25), 3, .4),
    ('Upper rim', (.05, .28, .35), 5, .3),
]:
    data = bpy.data.lights.new(name, 'AREA')
    data.energy, data.size = energy, size
    obj = bpy.data.objects.new(name, data)
    scene.collection.objects.link(obj)
    obj.location = position
    obj.rotation_euler = (target - obj.location).to_track_quat('-Z', 'Y').to_euler()
camera_data = bpy.data.cameras.new('Editorial camera')
camera = bpy.data.objects.new('Editorial camera', camera_data)
scene.collection.objects.link(camera)
scene.camera = camera
camera_data.type = 'ORTHO'
camera_data.ortho_scale = .232
camera.location = (.21, -.34, .255)
camera.rotation_euler = (target - camera.location).to_track_quat('-Z', 'Y').to_euler()
scene.render.filepath = str(ROOT / 'public/assets/support-still-life-transparent.png')
(ROOT / 'design').mkdir(exist_ok=True)
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT / 'design/support-still-life.blend'))
bpy.ops.render.render(write_still=True)
