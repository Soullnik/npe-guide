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

export function createLesson12Set(existingSet?: NodeParticleSystemSet): NodeParticleSystemSet {
  const set = existingSet || new NodeParticleSystemSet('Lesson 12 · Angle and Rotation');
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
  const initialColor12 = new ParticleInputBlock('Initial Color');
  initialColor12.value = new Color4(1, 1, 1, 1);
  initialColor12.output.connectTo(createParticle.color);
  const baseSize12 = new ParticleInputBlock('Base Size');
  baseSize12.value = 0.3;
  baseSize12.output.connectTo(createParticle.size);
  const pointShape = new PointShapeBlock('Point emitter');
  createParticle.particle.connectTo(pointShape.particle);
  pointShape.output.connectTo(updatePosition.particle);

  // Get system time for rotation animation
  const time = new ParticleInputBlock('Time');
  time.systemSource = NodeParticleSystemSources.Time;

  // Calculate rotation angle based on time
  const rotationSpeed = new ParticleInputBlock('Rotation Speed');
  rotationSpeed.value = 2.0; // Rotations per second
  const rotationAngle = new ParticleMathBlock('Rotation Angle');
  rotationAngle.operation = ParticleMathBlockOperations.Multiply;
  time.output.connectTo(rotationAngle.left);
  rotationSpeed.output.connectTo(rotationAngle.right);

  // Update angle with time-based rotation
  const updateAngle = new UpdateAngleBlock('Update Angle');
  updatePosition.output.connectTo(updateAngle.particle);
  rotationAngle.output.connectTo(updateAngle.angle);

  // Align angle to direction (optional - can be used instead of or in addition to UpdateAngleBlock)
  // const alignAngle = new AlignAngleBlock('Align Angle');
  // updateAngle.output.connectTo(alignAngle.particle);

  // Color update
  const updateColor = new UpdateColorBlock('Update color');
  updateAngle.output.connectTo(updateColor.particle);
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
