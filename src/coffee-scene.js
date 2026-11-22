import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export async function mountCoffeeScene(host, {
  onContextLost
} = {}) {
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: 'low-power'
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  const contextLost = () => onContextLost?.();
  renderer.domElement.addEventListener('webglcontextlost', contextLost);
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-.12, .12, .12, -.12, .01, 3);
  camera.position.set(.22, .13, .34);
  camera.lookAt(0, 0, 0);
  scene.add(new THREE.HemisphereLight(0xfff8e9, 0x536e5c, 2.1));
  const key = new THREE.DirectionalLight(0xfff4dc, 3.2);
  key.position.set(.24, .4, .35);
  key.castShadow = true;
  key.shadow.mapSize.set(512, 512);
  Object.assign(key.shadow.camera, {
    near: .01,
    far: 2,
    left: -.2,
    right: .2,
    top: .2,
    bottom: -.2
  });
  key.shadow.bias = -.00015;
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xe9efe2, 1.4);
  fill.position.set(-.3, .12, -.2);
  scene.add(fill);
  let model;
  const pivot = new THREE.Group();
  scene.add(pivot);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(.5, .5), new THREE.ShadowMaterial({
    opacity: .12
  }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -.077;
  floor.receiveShadow = true;
  scene.add(floor);
  try {
    model = (await new GLTFLoader().loadAsync('/assets/models/copo-cafe.glb')).scene;
  } catch (error) {
    floor.geometry.dispose();
    floor.material.dispose();
    renderer.dispose();
    throw error;
  }
  const center = new THREE.Box3().setFromObject(model).getCenter(new THREE.Vector3());
  model.position.sub(center);
  const colors = {
    Cafe_Corpo: '#16483B',
    Cafe_Faixa_Pessego: '#F2D38B',
    Cafe_Tampa: '#F7F2E9'
  };
  model.traverse(object => {
    if (!object.isMesh) return;
    object.material = object.material.clone();
    object.material.color.set(colors[object.name] || '#F7F2E9');
    object.material.roughness = .62;
    object.castShadow = true;
    object.receiveShadow = true;
  });
  pivot.add(model);
  const lid = model.getObjectByName('Cafe_Tampa');
  const lidRest = lid?.position.y || 0;
  let progress = 0;
  let disposed = false;
  const update = value => {
    if (disposed || renderer.getContext().isContextLost()) return;
    progress = Math.max(0, Math.min(1, value));
    const arc = Math.sin(progress * Math.PI);
    pivot.rotation.set(-.08 + arc * .13, -.35 + progress * 1.6, -.09 + arc * .17);
    if (lid) lid.position.y = lidRest + arc * arc * .009;
    renderer.render(scene, camera);
  };
  const resize = () => {
    if (disposed) return;
    const width = Math.max(1, host.clientWidth),
      height = Math.max(1, host.clientHeight);
    renderer.setSize(width, height, false);
    const viewHeight = .235;
    camera.left = -viewHeight * width / height / 2;
    camera.right = -camera.left;
    camera.top = viewHeight / 2;
    camera.bottom = -camera.top;
    camera.updateProjectionMatrix();
    update(progress);
  };
  host.appendChild(renderer.domElement);
  resize();
  return {
    update,
    resize,
    dispose() {
      if (disposed) return;
      disposed = true;
      scene.traverse(object => {
        if (!object.isMesh) return;
        object.geometry.dispose();
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach(material => material.dispose());
      });
      key.shadow.dispose();
      renderer.domElement.removeEventListener('webglcontextlost', contextLost);
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    }
  };
}
