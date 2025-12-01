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
} from 'babylonjs';

/**
 * Lesson 1.3: Time-Based Properties
 * 
 * This lesson introduces Age and Lifetime - two fundamental concepts for time-based effects.
 * We'll learn how to calculate age ratio and use it to change particle properties over time.
 * 
 * Key concepts:
 * - Age: How long the particle has been alive (starts at 0, increases over time)
 * - Lifetime: Total lifespan of the particle (constant value)
 * - Age Ratio: Age / Lifetime (value from 0 to 1, representing progress through particle's life)
 * - Using age ratio to change properties over time
 * - Basic math operations: Divide, Multiply, Add, Subtract
 */
export function createTopic1Lesson3Set(existingSet?: NodeParticleSystemSet): NodeParticleSystemSet {
  const set = existingSet || new NodeParticleSystemSet('Topic 1, Lesson 3 · Time-Based Properties');
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
  const initialColor = new ParticleInputBlock('Initial Color');
  initialColor.value = new Color4(1, 0.5, 0, 1); // Orange
  initialColor.output.connectTo(createParticle.color);
  const baseSize = new ParticleInputBlock('Base Size');
  baseSize.value = 0.3;
  baseSize.output.connectTo(createParticle.size);
  const pointShape = new PointShapeBlock('Point emitter');
  createParticle.particle.connectTo(pointShape.particle);
  pointShape.output.connectTo(updatePosition.particle);

  // TIME-BASED CALCULATIONS
  // Get the particle's age - how long it has been alive (in seconds)
  // Age starts at 0 when the particle is created and increases each frame
  const age = new ParticleInputBlock('Age');
  age.contextualValue = NodeParticleContextualSources.Age;
  
  // Get the particle's lifetime - total lifespan (in seconds)
  // Lifetime is a constant value set when the particle is created
  const lifetime = new ParticleInputBlock('Lifetime');
  lifetime.contextualValue = NodeParticleContextualSources.Lifetime;
  
  // Calculate age ratio: Age / Lifetime
  // This gives us a value from 0 (just created) to 1 (about to die)
  // Age ratio is the foundation for time-based effects
  const ageRatio = new ParticleMathBlock('Age / Lifetime');
  ageRatio.operation = ParticleMathBlockOperations.Divide;
  age.output.connectTo(ageRatio.left);
  lifetime.output.connectTo(ageRatio.right);

  // Color update - use age ratio to fade color
  // As age ratio increases (particle gets older), color fades
  const updateColor = new UpdateColorBlock('Update color');
  updatePosition.output.connectTo(updateColor.particle);
  
  // Get initial color
  const initialColorContextual = new ParticleInputBlock('Initial Color');
  initialColorContextual.contextualValue = NodeParticleContextualSources.InitialColor;
  
  // For this lesson, we'll use the initial color directly
  // The age ratio calculation is used for size growth, demonstrating time-based effects
  // Color fading will be covered in more detail in Lesson 1.4
  initialColorContextual.output.connectTo(updateColor.color);

  // Size update - use age ratio to make particles grow over time
  const updateSize = new UpdateSizeBlock('Update size');
  updateColor.output.connectTo(updateSize.particle);
  
  // Calculate size growth: baseSize * (1 + ageRatio)
  // When ageRatio = 0: size = baseSize * 1 = baseSize (small)
  // When ageRatio = 1: size = baseSize * 2 = 2 * baseSize (large)
  const baseSizeUpdate = new ParticleInputBlock('Base Size');
  baseSizeUpdate.value = 0.3;
  
  // Create constant value of 1.0 for the growth factor calculation
  const one = new ParticleInputBlock('One');
  one.value = 1.0;
  
  const growthFactor = new ParticleMathBlock('Growth Factor');
  growthFactor.operation = ParticleMathBlockOperations.Add;
  one.output.connectTo(growthFactor.left);
  ageRatio.output.connectTo(growthFactor.right);
  
  const finalSize = new ParticleMathBlock('Final Size');
  finalSize.operation = ParticleMathBlockOperations.Multiply;
  baseSizeUpdate.output.connectTo(finalSize.left);
  growthFactor.output.connectTo(finalSize.right);
  
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

