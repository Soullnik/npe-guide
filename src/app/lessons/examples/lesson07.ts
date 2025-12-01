import {
  NodeParticleSystemSet,
  PointShapeBlock,
  CreateParticleBlock,
  NodeParticleContextualSources,
  ParticleInputBlock,
  ParticleMathBlock,
  ParticleMathBlockOperations,
  SystemBlock,
  UpdatePositionBlock,
  UpdateColorBlock,
  UpdateSizeBlock,
  ParticleRandomBlock,
  ParticleRandomBlockLocks,
  Tools,
  Color4,
  ParticleTextureSourceBlock
} from 'babylonjs';

export function createLesson07Set(): NodeParticleSystemSet {
  const set = new NodeParticleSystemSet('Lesson 07 · Noise and Randomness');
  set.clear();
  set.editorData = null;

  const systemBlock = new SystemBlock('Particle System');

  // Position update
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

  // Create particle
  const createParticle = new CreateParticleBlock('Create particle');
  const initialColor07 = new ParticleInputBlock('Initial Color');
  initialColor07.value = new Color4(0.6, 0.5, 0.6, 1.0); // Average between blue and orange
  initialColor07.output.connectTo(createParticle.color);
  const avgSize07 = new ParticleInputBlock('Average Size');
  avgSize07.value = 0.4; // Average between minSize (0.2) and maxSize (0.6)
  avgSize07.output.connectTo(createParticle.size);
  const pointShape = new PointShapeBlock('Point emitter');
  createParticle.particle.connectTo(pointShape.particle);
  pointShape.output.connectTo(updatePosition.particle);

  // Random color using ParticleRandomBlock
  const updateColor = new UpdateColorBlock('Update color');
  updatePosition.output.connectTo(updateColor.particle);

  // Create random color between two colors
  const minColor = new ParticleInputBlock('Min Color');
  minColor.value = new Color4(0.2, 0.5, 1.0, 1.0); // Blue
  const maxColor = new ParticleInputBlock('Max Color');
  maxColor.value = new Color4(1.0, 0.5, 0.2, 1.0); // Orange
  const randomColor = new ParticleRandomBlock('Random Color');
  randomColor.lockMode = ParticleRandomBlockLocks.OncePerParticle; // Same color for particle lifetime
  minColor.output.connectTo(randomColor.min);
  maxColor.output.connectTo(randomColor.max);
  randomColor.output.connectTo(updateColor.color);

  // Random size using ParticleRandomBlock
  const updateSize = new UpdateSizeBlock('Update size');
  updateColor.output.connectTo(updateSize.particle);
  const minSize = new ParticleInputBlock('Min Size');
  minSize.value = 0.2;
  const maxSize = new ParticleInputBlock('Max Size');
  maxSize.value = 0.6;
  const randomSize = new ParticleRandomBlock('Random Size');
  randomSize.lockMode = ParticleRandomBlockLocks.OncePerParticle; // Same size for particle lifetime
  minSize.output.connectTo(randomSize.min);
  maxSize.output.connectTo(randomSize.max);
  randomSize.output.connectTo(updateSize.size);

  // Connect final output to system
  updateSize.output.connectTo(systemBlock.particle);

  // Texture
  const texture = new ParticleTextureSourceBlock('Texture');
  texture.url = Tools.GetAssetUrl('https://assets.babylonjs.com/core/textures/flare.png');
  texture.texture.connectTo(systemBlock.texture);

  set.systemBlocks.push(systemBlock);

  return set;
}

