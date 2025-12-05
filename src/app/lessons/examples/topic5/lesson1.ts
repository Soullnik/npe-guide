import {
  NodeParticleSystemSet,
  CylinderShapeBlock,
  CreateParticleBlock,
  NodeParticleContextualSources,
  NodeParticleSystemSources,
  ParticleInputBlock,
  ParticleMathBlock,
  ParticleMathBlockOperations,
  ParticleTextureSourceBlock,
  SystemBlock,
  UpdatePositionBlock,
  UpdateColorBlock,
  UpdateSizeBlock,
  ParticleConverterBlock,
  ParticleTrigonometryBlock,
  ParticleTrigonometryBlockOperations,
  Tools,
  Color4,
} from '@babylonjs/core';

/**
 * Lesson 5.1: Advanced Math Operations
 * 
 * This lesson introduces ParticleTrigonometryBlock for advanced mathematical operations.
 * You'll learn how to use trigonometric functions (sin, cos, sqrt, abs) to create
 * animated, wave-based effects and smooth curves.
 * 
 * Key concepts:
 * - ParticleTrigonometryBlock: Performs trigonometric and advanced math operations
 * - System time: Global time value that increases continuously (not per-particle)
 * - Trigonometric functions: Sin, Cos for wave patterns
 * - Advanced functions: Sqrt, Abs for smooth curves
 * - Normalizing values: Converting function outputs to 0-1 range for color components
 * 
 * Prerequisites: Topic 1, Lesson 4 (Property Combinations)
 */
export function createTopic5Lesson1Set(existingSet?: NodeParticleSystemSet): NodeParticleSystemSet {
  const set = existingSet || new NodeParticleSystemSet('Topic 5, Lesson 1 · Advanced Math Operations');
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
  const initialColor10 = new ParticleInputBlock('Initial Color');
  initialColor10.value = new Color4(1, 1, 1, 1); // White
  initialColor10.output.connectTo(createParticle.color);
  const baseSize10 = new ParticleInputBlock('Base Size');
  baseSize10.value = 0.3;
  baseSize10.output.connectTo(createParticle.size);
  const cylinderShape = new CylinderShapeBlock('Cylinder emitter');
  createParticle.particle.connectTo(cylinderShape.particle);
  cylinderShape.output.connectTo(updatePosition.particle);

  // COLOR UPDATE WITH TRIGONOMETRIC FUNCTIONS
  // We'll create an animated color that changes over time using trigonometric functions
  // Each color component (R, G, B) will use a different math function, creating a dynamic effect
  const updateColor = new UpdateColorBlock('Update color');
  updatePosition.output.connectTo(updateColor.particle);

  // GET SYSTEM TIME
  // System time is a global value that increases continuously from 0
  // Unlike Age (which is per-particle), Time is the same for all particles
  // This allows us to create synchronized animations across all particles
  // Time is measured in seconds since the system started
  const time = new ParticleInputBlock('Time');
  time.systemSource = NodeParticleSystemSources.Time;

  // SCALE TIME FOR DIFFERENT FREQUENCIES
  // By multiplying time by a scale factor, we control the speed of the animation
  // Smaller scale = slower animation, larger scale = faster animation
  // This is useful for creating different animation speeds for different effects
  const timeScale = new ParticleInputBlock('Time Scale');
  timeScale.value = 0.5; // Slower animation
  const scaledTime = new ParticleMathBlock('Scaled Time');
  scaledTime.operation = ParticleMathBlockOperations.Multiply;
  time.output.connectTo(scaledTime.left);
  timeScale.output.connectTo(scaledTime.right);

  // TRIGONOMETRIC FUNCTIONS
  // ParticleTrigonometryBlock performs various mathematical operations
  // We'll use different functions for each color component to create a dynamic effect
  
  // SIN WAVE FOR RED COMPONENT
  // Sin function creates a smooth wave pattern: oscillates between -1 and 1
  // This creates a smooth, repeating animation
  // Sin is useful for: waves, oscillations, smooth transitions
  const sinTime = new ParticleTrigonometryBlock('Sin Time');
  sinTime.operation = ParticleTrigonometryBlockOperations.Sin;
  scaledTime.output.connectTo(sinTime.input);

  // COS WAVE FOR GREEN COMPONENT
  // Cos function is similar to Sin, but offset by 90 degrees (π/2)
  // Cos(0) = 1, while Sin(0) = 0
  // Using Cos for green creates a phase offset, making the color animation more interesting
  const cosTime = new ParticleTrigonometryBlock('Cos Time');
  cosTime.operation = ParticleTrigonometryBlockOperations.Cos;
  scaledTime.output.connectTo(cosTime.input);

  // SQRT FOR BLUE COMPONENT
  // Square root creates a smooth, curved function
  // Sqrt is always positive and increases slowly
  // We use Abs first to ensure the input is positive (sqrt of negative is undefined)
  const absTime = new ParticleTrigonometryBlock('Abs Time');
  absTime.operation = ParticleTrigonometryBlockOperations.Abs; // Absolute value (always positive)
  scaledTime.output.connectTo(absTime.input);
  
  const sqrtTime = new ParticleTrigonometryBlock('Sqrt Time');
  sqrtTime.operation = ParticleTrigonometryBlockOperations.Sqrt; // Square root
  absTime.output.connectTo(sqrtTime.input);

  // NORMALIZE VALUES TO 0-1 RANGE
  // Color components must be in the 0-1 range
  // Trigonometric functions output -1 to 1, so we need to normalize them
  const one = new ParticleInputBlock('One');
  one.value = 1.0;
  const half = new ParticleInputBlock('Half');
  half.value = 0.5;

  // SIN NORMALIZATION: (sin + 1) / 2
  // Sin outputs -1 to 1
  // (sin + 1) shifts it to 0 to 2
  // Dividing by 2 scales it to 0 to 1
  const sinNormalized = new ParticleMathBlock('Sin Normalized');
  sinNormalized.operation = ParticleMathBlockOperations.Add;
  sinTime.output.connectTo(sinNormalized.left);
  one.output.connectTo(sinNormalized.right);
  const sinScaled = new ParticleMathBlock('Sin Scaled');
  sinScaled.operation = ParticleMathBlockOperations.Multiply;
  sinNormalized.output.connectTo(sinScaled.left);
  half.output.connectTo(sinScaled.right);

  // COS NORMALIZATION: (cos + 1) / 2
  // Same process as Sin normalization
  const cosNormalized = new ParticleMathBlock('Cos Normalized');
  cosNormalized.operation = ParticleMathBlockOperations.Add;
  cosTime.output.connectTo(cosNormalized.left);
  one.output.connectTo(cosNormalized.right);
  const cosScaled = new ParticleMathBlock('Cos Scaled');
  cosScaled.operation = ParticleMathBlockOperations.Multiply;
  cosNormalized.output.connectTo(cosScaled.left);
  half.output.connectTo(cosScaled.right);

  // SQRT SCALING
  // Sqrt outputs positive values, but can be large
  // We multiply by a factor to keep it in a reasonable range
  const sqrtClamped = new ParticleMathBlock('Sqrt Clamped');
  sqrtClamped.operation = ParticleMathBlockOperations.Multiply;
  sqrtTime.output.connectTo(sqrtClamped.left);
  const sqrtFactor = new ParticleInputBlock('Sqrt Factor');
  sqrtFactor.value = 0.3; // Scale down to keep in 0-1 range
  sqrtFactor.output.connectTo(sqrtClamped.right);

  // CREATE COLOR USING MULTIPLE MATH FUNCTIONS
  // Each color component uses a different math function:
  // - Red: Sine wave (oscillates smoothly)
  // - Green: Cosine wave (oscillates with phase offset)
  // - Blue: Square root curve (smooth, increasing)
  // - Alpha: Constant (1.0, fully opaque)
  // This creates a dynamic, animated color that changes over time
  const colorConverter = new ParticleConverterBlock('Animated Color');
  sinScaled.output.connectTo(colorConverter.xIn); // Red: sine wave
  cosScaled.output.connectTo(colorConverter.yIn); // Green: cosine wave
  sqrtClamped.output.connectTo(colorConverter.zIn); // Blue: square root curve
  one.output.connectTo(colorConverter.wIn); // Alpha: 1.0 (fully opaque)
  colorConverter.colorOut.connectTo(updateColor.color);

  // Size update
  const updateSize = new UpdateSizeBlock('Update size');
  updateColor.output.connectTo(updateSize.particle);
  const baseSize = new ParticleInputBlock('Base Size');
  baseSize.value = 0.3;
  baseSize.output.connectTo(updateSize.size);

  // Connect final output to system
  updateSize.output.connectTo(systemBlock.particle);

  // Texture
  const texture = new ParticleTextureSourceBlock('Texture');
  texture.url = Tools.GetAssetUrl('https://assets.babylonjs.com/core/textures/flare.png');
  texture.texture.connectTo(systemBlock.texture);

  set.systemBlocks.push(systemBlock);

  return set;
}
