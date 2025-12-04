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
 * Lesson 1.2: Basic Properties
 * 
 * This lesson introduces UpdateColorBlock and UpdateSizeBlock.
 * We'll learn how to update particle color and size with simple constant values,
 * without using time-based calculations.
 * 
 * Key concepts:
 * - UpdateColorBlock: Updates particle color each frame
 * - UpdateSizeBlock: Updates particle size each frame
 * - Using constant values (no Age/Lifetime yet)
 * - Chaining update blocks: UpdatePosition → UpdateColor → UpdateSize
 */
export function createTopic1Lesson2Set(existingSet?: NodeParticleSystemSet): NodeParticleSystemSet {
  const set = existingSet || new NodeParticleSystemSet('Topic 1, Lesson 2 · Basic Properties');
  set.clear();
  set.editorData = null;

  const systemBlock = new SystemBlock('Particle System');

  // Position update - same as lesson 1.1
  // Get the current position of the particle
  const updatePosition = new UpdatePositionBlock('Update position');
  const position = new ParticleInputBlock('Position');
  position.contextualValue = NodeParticleContextualSources.Position;
  
  // Get the scaled direction (direction * directionScale)
  // This represents how far the particle will move this frame
  const scaledDirection = new ParticleInputBlock('Scaled direction');
  scaledDirection.contextualValue = NodeParticleContextualSources.ScaledDirection;
  
  // Add position and direction to get the new position
  // This is the basic movement formula: newPosition = oldPosition + movement
  const addVector = new ParticleMathBlock('Position + Direction');
  addVector.operation = ParticleMathBlockOperations.Add;
  position.output.connectTo(addVector.left);
  scaledDirection.output.connectTo(addVector.right);
  addVector.output.connectTo(updatePosition.position);

  // Create particle
  // Set initial color and size when the particle is created
  const createParticle = new CreateParticleBlock('Create particle');
  const initialColor = new ParticleInputBlock('Initial Color');
  initialColor.value = new Color4(1, 0.5, 0, 1); // Orange color
  initialColor.output.connectTo(createParticle.color);
  
  const baseSize = new ParticleInputBlock('Base Size');
  baseSize.value = 0.3;
  baseSize.output.connectTo(createParticle.size);
  
  // Use PointShapeBlock to emit particles from a single point
  const pointShape = new PointShapeBlock('Point emitter');
  createParticle.particle.connectTo(pointShape.particle);
  pointShape.output.connectTo(updatePosition.particle);

  // Color update - UpdateColorBlock allows us to change particle color each frame
  // In this lesson, we'll use the initial color (constant value)
  // In later lessons, we'll learn to change color over time
  const updateColor = new UpdateColorBlock('Update color');
  updatePosition.output.connectTo(updateColor.particle);
  
  // Get the initial color that was set when the particle was created
  // This is a contextual value that remembers the color from CreateParticleBlock
  const initialColorContextual = new ParticleInputBlock('Initial Color');
  initialColorContextual.contextualValue = NodeParticleContextualSources.InitialColor;
  initialColorContextual.output.connectTo(updateColor.color);

  // Size update - UpdateSizeBlock allows us to change particle size each frame
  // In this lesson, we'll use a constant size value
  // In later lessons, we'll learn to change size over time
  const updateSize = new UpdateSizeBlock('Update size');
  updateColor.output.connectTo(updateSize.particle);
  
  // Use a constant size value (same as base size)
  const constantSize = new ParticleInputBlock('Constant Size');
  constantSize.value = 0.3;
  constantSize.output.connectTo(updateSize.size);

  // Connect final output to system
  // The chain is: CreateParticle → PointShape → UpdatePosition → UpdateColor → UpdateSize → SystemBlock
  updateSize.output.connectTo(systemBlock.particle);

  // Texture
  const texture = new ParticleTextureSourceBlock('Texture');
  texture.url = Tools.GetAssetUrl('https://assets.babylonjs.com/core/textures/flare.png');
  texture.texture.connectTo(systemBlock.texture);

  set.systemBlocks.push(systemBlock);

  return set;
}

