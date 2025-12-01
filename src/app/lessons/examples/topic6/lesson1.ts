import {
  NodeParticleSystemSet,
  PointShapeBlock,
  CreateParticleBlock,
  NodeParticleContextualSources,
  NodeParticleSystemSources,
  ParticleInputBlock,
  ParticleMathBlock,
  ParticleMathBlockOperations,
  SystemBlock,
  UpdatePositionBlock,
  UpdateColorBlock,
  UpdateSizeBlock,
  UpdateAngleBlock,
  AlignAngleBlock,
  Tools,
  Color4,
  ParticleTextureSourceBlock
} from 'babylonjs';

/**
 * Lesson 6.1: Angle and Rotation
 * 
 * This lesson introduces UpdateAngleBlock and AlignAngleBlock for controlling particle rotation.
 * You'll learn how to rotate particles over time and align them to their movement direction.
 * 
 * Key concepts:
 * - UpdateAngleBlock: Sets the rotation angle of particles
 * - AlignAngleBlock: Automatically aligns particles to their movement direction
 * - Time-based rotation: Using system time to create continuous rotation
 * - Rotation speed: Controlling how fast particles rotate
 * 
 * Prerequisites: Topic 2, Lesson 2 (Advanced Movement and Physics)
 */
export function createTopic6Lesson1Set(existingSet?: NodeParticleSystemSet): NodeParticleSystemSet {
  const set = existingSet || new NodeParticleSystemSet('Topic 6, Lesson 1 · Angle and Rotation');
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
  const initialColor12 = new ParticleInputBlock('Initial Color');
  initialColor12.value = new Color4(1, 1, 1, 1); // White
  initialColor12.output.connectTo(createParticle.color);
  const baseSize12 = new ParticleInputBlock('Base Size');
  baseSize12.value = 0.3;
  baseSize12.output.connectTo(createParticle.size);
  const pointShape = new PointShapeBlock('Point emitter');
  createParticle.particle.connectTo(pointShape.particle);
  pointShape.output.connectTo(updatePosition.particle);

  // TIME-BASED ROTATION
  // We'll use system time to create continuous rotation
  // System time increases continuously, allowing for smooth, synchronized rotation
  const time = new ParticleInputBlock('Time');
  time.systemSource = NodeParticleSystemSources.Time;

  // CALCULATE ROTATION ANGLE
  // Rotation angle = time * rotationSpeed
  // This creates continuous rotation at a constant speed
  // rotationSpeed = 2.0 means 2 full rotations per second
  // Higher values = faster rotation, lower values = slower rotation
  const rotationSpeed = new ParticleInputBlock('Rotation Speed');
  rotationSpeed.value = 2.0; // Rotations per second (in radians: 2 * 2π = 4π radians/second)
  const rotationAngle = new ParticleMathBlock('Rotation Angle');
  rotationAngle.operation = ParticleMathBlockOperations.Multiply;
  time.output.connectTo(rotationAngle.left);
  rotationSpeed.output.connectTo(rotationAngle.right);

  // UPDATE ANGLE
  // UpdateAngleBlock sets the rotation angle of particles
  // The angle is in radians and determines how the particle texture is oriented
  // Angle = 0: default orientation
  // Angle = π/2: rotated 90 degrees
  // Angle = π: rotated 180 degrees
  // Angle = 2π: full rotation (back to start)
  const updateAngle = new UpdateAngleBlock('Update Angle');
  updatePosition.output.connectTo(updateAngle.particle);
  rotationAngle.output.connectTo(updateAngle.angle);

  // ALIGN ANGLE TO DIRECTION
  // AlignAngleBlock automatically aligns particles to their movement direction
  // This is useful for effects like sparks, trails, or particles that should face their direction
  // You can use this instead of or in addition to UpdateAngleBlock
  // 
  // Example use cases:
  // - Particles that should always face their movement direction
  // - Creating arrow-like effects
  // - Making particles look like they're moving forward
  //
  // In this lesson, we use both UpdateAngleBlock (for rotation) and AlignAngleBlock (for direction alignment)
  // This creates particles that rotate continuously AND face their movement direction
  const alignAngle = new AlignAngleBlock('Align Angle');
  updateAngle.output.connectTo(alignAngle.particle);

  // Color update
  const updateColor = new UpdateColorBlock('Update color');
  alignAngle.output.connectTo(updateColor.particle);
  const initialColor = new ParticleInputBlock('Initial Color');
  initialColor.contextualValue = NodeParticleContextualSources.InitialColor;
  initialColor.output.connectTo(updateColor.color);

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
