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
  UpdateDirectionBlock,
  ParticleConverterBlock,
  Tools,
  Color4,
  ParticleTextureSourceBlock
} from 'babylonjs';

export function createLesson04Set(): NodeParticleSystemSet {
  const set = new NodeParticleSystemSet('Lesson 04 · Basic Forces and Physics');
  set.clear();
  set.editorData = null;

  const systemBlock = new SystemBlock('Particle System');

  // Create particle
  const createParticle = new CreateParticleBlock('Create particle');
  const initialColor04 = new ParticleInputBlock('Initial Color');
  initialColor04.value = new Color4(1, 1, 1, 1); // White to match InitialColor
  initialColor04.output.connectTo(createParticle.color);
  const baseSize04 = new ParticleInputBlock('Base Size');
  baseSize04.value = 0.3;
  baseSize04.output.connectTo(createParticle.size);
  const pointShape = new PointShapeBlock('Point emitter');
  createParticle.particle.connectTo(pointShape.particle);

  // Direction update with gravity
  const updateDirection = new UpdateDirectionBlock('Update direction');
  pointShape.output.connectTo(updateDirection.particle);

  // Get current direction
  const currentDirection = new ParticleInputBlock('Direction');
  currentDirection.contextualValue = NodeParticleContextualSources.Direction;

  // Get delta time for physics calculations
  const deltaTime = new ParticleInputBlock('Delta Time');
  deltaTime.systemSource = NodeParticleSystemSources.Delta;

  // Create gravity vector (downward: 0, -9.8, 0)
  const gravityConverter = new ParticleConverterBlock('Gravity Vector');
  const gravityX = new ParticleInputBlock('Gravity X');
  gravityX.value = 0.0;
  const gravityY = new ParticleInputBlock('Gravity Y');
  gravityY.value = -9.8;
  const gravityZ = new ParticleInputBlock('Gravity Z');
  gravityZ.value = 0.0;
  gravityX.output.connectTo(gravityConverter.xIn);
  gravityY.output.connectTo(gravityConverter.yIn);
  gravityZ.output.connectTo(gravityConverter.zIn);

  // Multiply gravity by delta time
  const gravityDelta = new ParticleMathBlock('Gravity * Delta');
  gravityDelta.operation = ParticleMathBlockOperations.Multiply;
  gravityConverter.xyzOut.connectTo(gravityDelta.left);
  deltaTime.output.connectTo(gravityDelta.right);

  // Add gravity to current direction
  const addGravity = new ParticleMathBlock('Direction + Gravity');
  addGravity.operation = ParticleMathBlockOperations.Add;
  currentDirection.output.connectTo(addGravity.left);
  gravityDelta.output.connectTo(addGravity.right);
  addGravity.output.connectTo(updateDirection.direction);

  // Position update
  const updatePosition = new UpdatePositionBlock('Update position');
  updateDirection.output.connectTo(updatePosition.particle);
  const position = new ParticleInputBlock('Position');
  position.contextualValue = NodeParticleContextualSources.Position;
  const scaledDirection = new ParticleInputBlock('Scaled direction');
  scaledDirection.contextualValue = NodeParticleContextualSources.ScaledDirection;
  const addVector = new ParticleMathBlock('Position + Direction');
  addVector.operation = ParticleMathBlockOperations.Add;
  position.output.connectTo(addVector.left);
  scaledDirection.output.connectTo(addVector.right);
  addVector.output.connectTo(updatePosition.position);

  // Color update
  const updateColor = new UpdateColorBlock('Update color');
  updatePosition.output.connectTo(updateColor.particle);
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

