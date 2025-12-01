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
  ParticleLerpBlock,
  Tools,
  Color4,
  ParticleTextureSourceBlock
} from 'babylonjs';

export function createLesson06Set(existingSet?: NodeParticleSystemSet): NodeParticleSystemSet {
  const set = existingSet || new NodeParticleSystemSet('Lesson 06 · Movement and Physics');
  set.clear();
  set.editorData = null;

  const systemBlock = new SystemBlock('Particle System');

  // Position update
  const updatePosition = new UpdatePositionBlock('Update position');
  const position = new ParticleInputBlock('Position');
  position.contextualValue = NodeParticleContextualSources.Position;

  // Get direction and direction scale
  const direction = new ParticleInputBlock('Direction');
  direction.contextualValue = NodeParticleContextualSources.Direction;
  const directionScale = new ParticleInputBlock('Direction Scale');
  directionScale.contextualValue = NodeParticleContextualSources.DirectionScale;

  // Get age and lifetime for physics calculations
  const age = new ParticleInputBlock('Age');
  age.contextualValue = NodeParticleContextualSources.Age;
  const lifetime = new ParticleInputBlock('Lifetime');
  lifetime.contextualValue = NodeParticleContextualSources.Lifetime;

  // Calculate age ratio (0 to 1)
  const ageRatio = new ParticleMathBlock('Age / Lifetime');
  ageRatio.operation = ParticleMathBlockOperations.Divide;
  age.output.connectTo(ageRatio.left);
  lifetime.output.connectTo(ageRatio.right);

  // PART 1: Speed control using LERP - particles start fast and slow down
  const startSpeed = new ParticleInputBlock('Start Speed');
  startSpeed.value = 2.0;
  const endSpeed = new ParticleInputBlock('End Speed');
  endSpeed.value = 0.5;
  const speedLerp = new ParticleLerpBlock('Speed Lerp');
  startSpeed.output.connectTo(speedLerp.left);
  endSpeed.output.connectTo(speedLerp.right);
  ageRatio.output.connectTo(speedLerp.gradient);

  // PART 2: Drag effect - particles lose speed over time
  const startDrag = new ParticleInputBlock('Start Drag');
  startDrag.value = 0.0;
  const endDrag = new ParticleInputBlock('End Drag');
  endDrag.value = 0.6;
  const dragLerp = new ParticleLerpBlock('Drag Lerp');
  startDrag.output.connectTo(dragLerp.left);
  endDrag.output.connectTo(dragLerp.right);
  ageRatio.output.connectTo(dragLerp.gradient);

  // Combine speed and drag: (1 - drag) * speed
  const one = new ParticleInputBlock('One');
  one.value = 1.0;
  const dragFactor = new ParticleMathBlock('1 - Drag');
  dragFactor.operation = ParticleMathBlockOperations.Subtract;
  one.output.connectTo(dragFactor.left);
  dragLerp.output.connectTo(dragFactor.right);

  // Apply both speed control and drag
  const combinedFactor = new ParticleMathBlock('Combined Factor');
  combinedFactor.operation = ParticleMathBlockOperations.Multiply;
  speedLerp.output.connectTo(combinedFactor.left);
  dragFactor.output.connectTo(combinedFactor.right);

  // Multiply base direction scale by combined factor
  const modifiedScale = new ParticleMathBlock('Modified Scale');
  modifiedScale.operation = ParticleMathBlockOperations.Multiply;
  directionScale.output.connectTo(modifiedScale.left);
  combinedFactor.output.connectTo(modifiedScale.right);

  // Calculate scaled direction: direction * modifiedScale
  const scaledDirection = new ParticleMathBlock('Scaled Direction');
  scaledDirection.operation = ParticleMathBlockOperations.Multiply;
  direction.output.connectTo(scaledDirection.left);
  modifiedScale.output.connectTo(scaledDirection.right);

  // Add scaled direction to position
  const addVector = new ParticleMathBlock('Position + Direction');
  addVector.operation = ParticleMathBlockOperations.Add;
  position.output.connectTo(addVector.left);
  scaledDirection.output.connectTo(addVector.right);
  addVector.output.connectTo(updatePosition.position);

  // Create particle
  const createParticle = new CreateParticleBlock('Create particle');
  const initialColor06 = new ParticleInputBlock('Initial Color');
  initialColor06.value = new Color4(1, 1, 1, 1);
  initialColor06.output.connectTo(createParticle.color);
  const baseSize06 = new ParticleInputBlock('Base Size');
  baseSize06.value = 0.3;
  baseSize06.output.connectTo(createParticle.size);
  const pointShape = new PointShapeBlock('Point emitter');
  createParticle.particle.connectTo(pointShape.particle);
  pointShape.output.connectTo(updatePosition.particle);

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

