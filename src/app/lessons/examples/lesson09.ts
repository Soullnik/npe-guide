import {
  NodeParticleSystemSet,
  PointShapeBlock,
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
} from 'babylonjs';

export function createLesson09Set(): NodeParticleSystemSet {
  const set = new NodeParticleSystemSet('Lesson 09 · Advanced Math Operations');
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
  const initialColor10 = new ParticleInputBlock('Initial Color');
  initialColor10.value = new Color4(1, 1, 1, 1);
  initialColor10.output.connectTo(createParticle.color);
  const baseSize10 = new ParticleInputBlock('Base Size');
  baseSize10.value = 0.3;
  baseSize10.output.connectTo(createParticle.size);
  const pointShape = new PointShapeBlock('Point emitter');
  createParticle.particle.connectTo(pointShape.particle);
  pointShape.output.connectTo(updatePosition.particle);

  // Color update with trigonometric functions
  const updateColor = new UpdateColorBlock('Update color');
  updatePosition.output.connectTo(updateColor.particle);

  // Get system time for animation
  const time = new ParticleInputBlock('Time');
  time.systemSource = NodeParticleSystemSources.Time;

  // Scale time for different frequencies
  const timeScale = new ParticleInputBlock('Time Scale');
  timeScale.value = 0.5;
  const scaledTime = new ParticleMathBlock('Scaled Time');
  scaledTime.operation = ParticleMathBlockOperations.Multiply;
  time.output.connectTo(scaledTime.left);
  timeScale.output.connectTo(scaledTime.right);

  // Use multiple trigonometric functions
  // Sin wave for red component
  const sinTime = new ParticleTrigonometryBlock('Sin Time');
  sinTime.operation = ParticleTrigonometryBlockOperations.Sin;
  scaledTime.output.connectTo(sinTime.input);

  // Cos wave for green component (offset by phase)
  const cosTime = new ParticleTrigonometryBlock('Cos Time');
  cosTime.operation = ParticleTrigonometryBlockOperations.Cos;
  scaledTime.output.connectTo(cosTime.input);

  // Sqrt for blue component (smooth curve)
  const sqrtTime = new ParticleTrigonometryBlock('Sqrt Time');
  sqrtTime.operation = ParticleTrigonometryBlockOperations.Sqrt;
  const absTime = new ParticleTrigonometryBlock('Abs Time');
  absTime.operation = ParticleTrigonometryBlockOperations.Abs;
  scaledTime.output.connectTo(absTime.input);
  absTime.output.connectTo(sqrtTime.input);

  // Normalize all values to 0-1 range
  const one = new ParticleInputBlock('One');
  one.value = 1.0;
  const half = new ParticleInputBlock('Half');
  half.value = 0.5;

  // Sin: (sin + 1) / 2 -> 0 to 1
  const sinNormalized = new ParticleMathBlock('Sin Normalized');
  sinNormalized.operation = ParticleMathBlockOperations.Add;
  sinTime.output.connectTo(sinNormalized.left);
  one.output.connectTo(sinNormalized.right);
  const sinScaled = new ParticleMathBlock('Sin Scaled');
  sinScaled.operation = ParticleMathBlockOperations.Multiply;
  sinNormalized.output.connectTo(sinScaled.left);
  half.output.connectTo(sinScaled.right);

  // Cos: (cos + 1) / 2 -> 0 to 1
  const cosNormalized = new ParticleMathBlock('Cos Normalized');
  cosNormalized.operation = ParticleMathBlockOperations.Add;
  cosTime.output.connectTo(cosNormalized.left);
  one.output.connectTo(cosNormalized.right);
  const cosScaled = new ParticleMathBlock('Cos Scaled');
  cosScaled.operation = ParticleMathBlockOperations.Multiply;
  cosNormalized.output.connectTo(cosScaled.left);
  half.output.connectTo(cosScaled.right);

  // Sqrt: clamp and scale
  const sqrtClamped = new ParticleMathBlock('Sqrt Clamped');
  sqrtClamped.operation = ParticleMathBlockOperations.Multiply;
  sqrtTime.output.connectTo(sqrtClamped.left);
  const sqrtFactor = new ParticleInputBlock('Sqrt Factor');
  sqrtFactor.value = 0.3;
  sqrtFactor.output.connectTo(sqrtClamped.right);

  // Create color using multiple math functions
  const colorConverter = new ParticleConverterBlock('Animated Color');
  sinScaled.output.connectTo(colorConverter.xIn); // Red: sine wave
  cosScaled.output.connectTo(colorConverter.yIn); // Green: cosine wave
  sqrtClamped.output.connectTo(colorConverter.zIn); // Blue: square root curve
  one.output.connectTo(colorConverter.wIn); // Alpha: 1.0
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
