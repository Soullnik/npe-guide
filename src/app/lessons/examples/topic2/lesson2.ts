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
} from '@babylonjs/core';

/**
 * Lesson 3.2: Randomness
 * 
 * This lesson introduces ParticleRandomBlock for adding randomness to particle properties.
 * You'll learn how to create random colors, sizes, and other properties, and understand
 * the difference between per-particle and per-frame randomness.
 * 
 * Key concepts:
 * - ParticleRandomBlock: Generates random values between min and max
 * - Lock modes: OncePerParticle vs EveryFrame
 * - Random colors: Creating varied particle appearances
 * - Random sizes: Creating varied particle scales
 * - Using average values for initial properties
 * 
 * Prerequisites: Topic 1, Lesson 1 (First Emission)
 */
export function createTopic2Lesson2Set(existingSet?: NodeParticleSystemSet): NodeParticleSystemSet {
  const set = existingSet || new NodeParticleSystemSet('Topic 3, Lesson 2 · Randomness');
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
  // We use average values for initial color and size
  // These are just starting points - the actual values will be randomized in update blocks
  const createParticle = new CreateParticleBlock('Create particle');
  const initialColor07 = new ParticleInputBlock('Initial Color');
  // Average between blue (0.2, 0.5, 1.0) and orange (1.0, 0.5, 0.2)
  // This gives us a neutral starting point
  initialColor07.value = new Color4(0.6, 0.5, 0.6, 1.0);
  initialColor07.output.connectTo(createParticle.color);
  const avgSize07 = new ParticleInputBlock('Average Size');
  // Average between minSize (0.2) and maxSize (0.6) = 0.4
  avgSize07.value = 0.4;
  avgSize07.output.connectTo(createParticle.size);
  const pointShape = new PointShapeBlock('Point emitter');
  createParticle.particle.connectTo(pointShape.particle);
  pointShape.output.connectTo(updatePosition.particle);

  // RANDOM COLOR USING PARTICLERANDOMBLOCK
  // ParticleRandomBlock generates a random value between min and max
  // This can be used for colors, sizes, positions, or any numeric property
  const updateColor = new UpdateColorBlock('Update color');
  updatePosition.output.connectTo(updateColor.particle);

  // Define the color range
  // Particles will have random colors between these two colors
  const minColor = new ParticleInputBlock('Min Color');
  minColor.value = new Color4(0.2, 0.5, 1.0, 1.0); // Blue
  const maxColor = new ParticleInputBlock('Max Color');
  maxColor.value = new Color4(1.0, 0.5, 0.2, 1.0); // Orange
  
  // Create random color block
  const randomColor = new ParticleRandomBlock('Random Color');
  
  // LOCK MODE: OncePerParticle
  // This means the random value is calculated once when the particle is created
  // and stays the same for the particle's entire lifetime
  // Alternative: EveryFrame - random value changes every frame (creates flickering effect)
  randomColor.lockMode = ParticleRandomBlockLocks.OncePerParticle;
  
  minColor.output.connectTo(randomColor.min);
  maxColor.output.connectTo(randomColor.max);
  randomColor.output.connectTo(updateColor.color);

  // RANDOM SIZE USING PARTICLERANDOMBLOCK
  // Same concept as random color, but for size values
  const updateSize = new UpdateSizeBlock('Update size');
  updateColor.output.connectTo(updateSize.particle);
  
  // Define the size range
  const minSize = new ParticleInputBlock('Min Size');
  minSize.value = 0.2; // Small particles
  const maxSize = new ParticleInputBlock('Max Size');
  maxSize.value = 0.6; // Large particles
  
  // Create random size block
  const randomSize = new ParticleRandomBlock('Random Size');
  
  // OncePerParticle: Each particle gets a random size when created and keeps it
  // This creates variety - some particles are small, some are large
  randomSize.lockMode = ParticleRandomBlockLocks.OncePerParticle;
  
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

