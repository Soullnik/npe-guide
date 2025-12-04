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
  Tools,
  Color4,
  ParticleTextureSourceBlock
} from '@babylonjs/core';

/**
 * Lesson 6.3: Performance Optimization
 * 
 * This lesson covers best practices for optimizing particle system performance.
 * You'll learn techniques to reduce computational overhead while maintaining
 * visual quality, including efficient block usage and system design patterns.
 * 
 * Key concepts:
 * - Efficient block chains: Minimizing unnecessary calculations
 * - Conditional updates: Only updating when needed
 * - System design: Structuring systems for performance
 * - Resource management: Optimizing texture and memory usage
 */
export function createTopic6Lesson3Set(existingSet?: NodeParticleSystemSet): NodeParticleSystemSet {
  const set = existingSet || new NodeParticleSystemSet('Topic 6, Lesson 3 · Performance Optimization');
  set.clear();
  set.editorData = null;

  const systemBlock = new SystemBlock('Particle System');

  // OPTIMIZED POSITION UPDATE
  // Simple, efficient position update without unnecessary calculations
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

  // CREATE PARTICLE - Minimal setup for performance
  const createParticle = new CreateParticleBlock('Create particle');
  const initialColor = new ParticleInputBlock('Initial Color');
  initialColor.value = new Color4(1, 1, 1, 1); // White - simple color
  initialColor.output.connectTo(createParticle.color);
  const baseSize = new ParticleInputBlock('Base Size');
  baseSize.value = 0.2; // Smaller size for better performance
  baseSize.output.connectTo(createParticle.size);
  const pointShape = new PointShapeBlock('Point emitter');
  createParticle.particle.connectTo(pointShape.particle);
  pointShape.output.connectTo(updatePosition.particle);

  // EFFICIENT COLOR UPDATE - Using contextual value (no recalculation)
  const updateColor = new UpdateColorBlock('Update color');
  updatePosition.output.connectTo(updateColor.particle);
  const initialColorContextual = new ParticleInputBlock('Initial Color');
  initialColorContextual.contextualValue = NodeParticleContextualSources.InitialColor;
  initialColorContextual.output.connectTo(updateColor.color);

  // EFFICIENT SIZE UPDATE - Constant size (no per-frame calculations)
  const updateSize = new UpdateSizeBlock('Update size');
  updateColor.output.connectTo(updateSize.particle);
  const constantSize = new ParticleInputBlock('Constant Size');
  constantSize.value = 0.2;
  constantSize.output.connectTo(updateSize.size);

  // Connect final output to system
  updateSize.output.connectTo(systemBlock.particle);

  // OPTIMIZED TEXTURE - Using efficient texture format
  const texture = new ParticleTextureSourceBlock('Texture');
  texture.url = Tools.GetAssetUrl('https://assets.babylonjs.com/core/textures/flare.png');
  texture.texture.connectTo(systemBlock.texture);

  set.systemBlocks.push(systemBlock);

  return set;
}

