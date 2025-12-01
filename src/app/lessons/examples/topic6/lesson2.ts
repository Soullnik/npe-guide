import {
  NodeParticleSystemSet,
  PointShapeBlock,
  CreateParticleBlock,
  NodeParticleContextualSources,
  ParticleInputBlock,
  ParticleMathBlock,
  ParticleMathBlockOperations,
  ParticleVectorLengthBlock,
  ParticleConverterBlock,
  SystemBlock,
  UpdatePositionBlock,
  UpdateColorBlock,
  UpdateSizeBlock,
  Tools,
  Color4,
  ParticleTextureSourceBlock
} from 'babylonjs';

/**
 * Lesson 6.2: Vector Operations
 * 
 * This lesson introduces advanced vector operations for particle systems.
 * You'll learn how to calculate vector lengths, normalize vectors, and perform
 * complex vector math to create sophisticated particle behaviors.
 * 
 * Key concepts:
 * - ParticleVectorLengthBlock: Calculate the length/magnitude of a vector
 * - Vector normalization: Creating unit vectors
 * - Vector math: Combining vector operations for complex effects
 * - Distance calculations: Using vector length for distance-based effects
 */
export function createTopic6Lesson2Set(existingSet?: NodeParticleSystemSet): NodeParticleSystemSet {
  const set = existingSet || new NodeParticleSystemSet('Topic 6, Lesson 2 · Vector Operations');
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
  initialColor.value = new Color4(0.5, 0.8, 1, 1); // Light blue
  initialColor.output.connectTo(createParticle.color);
  const baseSize = new ParticleInputBlock('Base Size');
  baseSize.value = 0.3;
  baseSize.output.connectTo(createParticle.size);
  const pointShape = new PointShapeBlock('Point emitter');
  createParticle.particle.connectTo(pointShape.particle);
  pointShape.output.connectTo(updatePosition.particle);

  // VECTOR LENGTH CALCULATION
  // Calculate the length of the particle's direction vector
  // This can be used for speed-based effects, distance calculations, etc.
  const directionLength = new ParticleVectorLengthBlock('Direction Length');
  scaledDirection.output.connectTo(directionLength.input);
  
  // Use the length to affect particle size (faster particles = larger)
  const sizeMultiplier = new ParticleMathBlock('Size Multiplier');
  sizeMultiplier.operation = ParticleMathBlockOperations.Multiply;
  directionLength.output.connectTo(sizeMultiplier.left);
  const sizeFactor = new ParticleInputBlock('Size Factor');
  sizeFactor.value = 0.1;
  sizeFactor.output.connectTo(sizeMultiplier.right);

  // Color update
  const updateColor = new UpdateColorBlock('Update color');
  updatePosition.output.connectTo(updateColor.particle);
  const initialColorContextual = new ParticleInputBlock('Initial Color');
  initialColorContextual.contextualValue = NodeParticleContextualSources.InitialColor;
  initialColorContextual.output.connectTo(updateColor.color);

  // Size update - affected by vector length
  const updateSize = new UpdateSizeBlock('Update size');
  updateColor.output.connectTo(updateSize.particle);
  const baseSizeUpdate = new ParticleInputBlock('Base Size');
  baseSizeUpdate.value = 0.3;
  const finalSize = new ParticleMathBlock('Final Size');
  finalSize.operation = ParticleMathBlockOperations.Add;
  baseSizeUpdate.output.connectTo(finalSize.left);
  sizeMultiplier.output.connectTo(finalSize.right);
  finalSize.output.connectTo(updateSize.size);

  // Connect final output to system
  updateSize.output.connectTo(systemBlock.particle);

  // Texture
  const texture = new ParticleTextureSourceBlock('Texture');
  texture.url = Tools.GetAssetUrl('https://assets.babylonjs.com/core/textures/flare.png');
  texture.texture.connectTo(systemBlock.texture);

  set.systemBlocks.push(systemBlock);

  return set;
}

