import {
  NodeParticleSystemSet,
  MeshShapeBlock,
  CreateParticleBlock,
  NodeParticleContextualSources,
  ParticleInputBlock,
  ParticleMathBlock,
  ParticleMathBlockOperations,
  SystemBlock,
  UpdatePositionBlock,
  UpdateColorBlock,
  UpdateSizeBlock,
  Tools,
  Color4,
  ParticleTextureSourceBlock
} from '@babylonjs/core';

/**
 * Lesson 2.3: Mesh Shape Emitters
 * 
 * This lesson introduces MeshShapeBlock, which allows you to emit particles
 * from the surface of a 3D mesh. This is useful for creating effects that follow
 * the shape of objects, like sparks from a sword or smoke from a character.
 * 
 * Key concepts:
 * - MeshShapeBlock: Emits particles from mesh surface
 * - Mesh reference: How to reference a mesh in the scene
 * - Surface emission: Particles spawn on the mesh surface
 * - Use cases: Character effects, object-based emissions, surface following
 */
export function createTopic2Lesson3Set(existingSet?: NodeParticleSystemSet): NodeParticleSystemSet {
  const set = existingSet || new NodeParticleSystemSet('Topic 2, Lesson 3 · Mesh Shape Emitters');
  set.clear();
  set.editorData = null;

  const systemBlock = new SystemBlock('Particle System');

  // POSITION UPDATE
  const updatePosition = new UpdatePositionBlock('Update position');
  const position = new ParticleInputBlock('Position');
  position.contextualValue = NodeParticleContextualSources.Position;
  const scaledDirection = new ParticleInputBlock('Scaled direction');
  scaledDirection.contextualValue = NodeParticleContextualSources.ScaledDirection;
  const addVector = new ParticleMathBlock('Position + Direction');
  addVector.operation = ParticleMathBlockOperations.Add;
  position.output.connectTo(addVector.left);
  scaledDirection.output.connectTo(addVector.right);
  addVector.output.connectTo(updatePosition.position);

  // CREATE PARTICLE
  const createParticle = new CreateParticleBlock('Create particle');
  const initialColor = new ParticleInputBlock('Initial Color');
  initialColor.value = new Color4(1, 0.8, 0.2, 1); // Yellow-orange
  initialColor.output.connectTo(createParticle.color);
  const baseSize = new ParticleInputBlock('Base Size');
  baseSize.value = 0.3;
  baseSize.output.connectTo(createParticle.size);

  // MESH SHAPE EMITTER
  // Note: In a real scenario, you would reference an actual mesh from the scene
  // For this example, we'll use MeshShapeBlock which emits from mesh surface
  const meshShape = new MeshShapeBlock('Mesh emitter');
  createParticle.particle.connectTo(meshShape.particle);
  meshShape.output.connectTo(updatePosition.particle);

  // Color update
  const updateColor = new UpdateColorBlock('Update color');
  updatePosition.output.connectTo(updateColor.particle);
  const initialColorContextual = new ParticleInputBlock('Initial Color');
  initialColorContextual.contextualValue = NodeParticleContextualSources.InitialColor;
  initialColorContextual.output.connectTo(updateColor.color);

  // Size update
  const updateSize = new UpdateSizeBlock('Update size');
  updateColor.output.connectTo(updateSize.particle);
  const constantSize = new ParticleInputBlock('Constant Size');
  constantSize.value = 0.3;
  constantSize.output.connectTo(updateSize.size);

  // Connect final output to system
  updateSize.output.connectTo(systemBlock.particle);

  // Texture
  const texture = new ParticleTextureSourceBlock('Texture');
  texture.url = Tools.GetAssetUrl('https://assets.babylonjs.com/core/textures/flare.png');
  texture.texture.connectTo(systemBlock.texture);

  set.systemBlocks.push(systemBlock);

  return set;
}

