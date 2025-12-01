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
  ParticleConditionBlock,
  ParticleConditionBlockTests,
  Tools,
  Color4,
  ParticleTextureSourceBlock
} from 'babylonjs';

export function createLesson11Set(existingSet?: NodeParticleSystemSet): NodeParticleSystemSet {
  const set = existingSet || new NodeParticleSystemSet('Lesson 11 · Conditional Logic');
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
  const initialColor11 = new ParticleInputBlock('Initial Color');
  initialColor11.value = new Color4(1, 1, 1, 1);
  initialColor11.output.connectTo(createParticle.color);
  const baseSize11 = new ParticleInputBlock('Base Size');
  baseSize11.value = 0.3;
  baseSize11.output.connectTo(createParticle.size);
  const pointShape = new PointShapeBlock('Point emitter');
  createParticle.particle.connectTo(pointShape.particle);
  pointShape.output.connectTo(updatePosition.particle);

  // Get age and lifetime for conditional logic
  const age = new ParticleInputBlock('Age');
  age.contextualValue = NodeParticleContextualSources.Age;
  const lifetime = new ParticleInputBlock('Lifetime');
  lifetime.contextualValue = NodeParticleContextualSources.Lifetime;
  const ageRatio = new ParticleMathBlock('Age / Lifetime');
  ageRatio.operation = ParticleMathBlockOperations.Divide;
  age.output.connectTo(ageRatio.left);
  lifetime.output.connectTo(ageRatio.right);

  // Conditional logic: if ageRatio > 0.5, use one color, else use another
  const threshold = new ParticleInputBlock('Threshold');
  threshold.value = 0.5;
  const condition = new ParticleConditionBlock('Age > Threshold');
  condition.test = ParticleConditionBlockTests.GreaterThan;
  ageRatio.output.connectTo(condition.left);
  threshold.output.connectTo(condition.right);

  // Create two colors
  const color1 = new ParticleInputBlock('Color 1');
  color1.value = new Color4(1, 0, 0, 1); // Red
  const color2 = new ParticleInputBlock('Color 2');
  color2.value = new Color4(0, 0, 1, 1); // Blue

  // Use condition to select color: if condition is true, use color1, else use color2
  color1.output.connectTo(condition.ifTrue);
  color2.output.connectTo(condition.ifFalse);

  // Color update
  const updateColor = new UpdateColorBlock('Update color');
  updatePosition.output.connectTo(updateColor.particle);
  condition.output.connectTo(updateColor.color);

  // Size update - also use conditional logic
  const updateSize = new UpdateSizeBlock('Update size');
  updateColor.output.connectTo(updateSize.particle);
  const baseSize = new ParticleInputBlock('Base Size');
  baseSize.value = 0.3;
  const largeSize = new ParticleInputBlock('Large Size');
  largeSize.value = 0.6;
  const sizeCondition = new ParticleConditionBlock('Size Condition');
  sizeCondition.test = ParticleConditionBlockTests.GreaterThan;
  ageRatio.output.connectTo(sizeCondition.left);
  threshold.output.connectTo(sizeCondition.right);
  largeSize.output.connectTo(sizeCondition.ifTrue);
  baseSize.output.connectTo(sizeCondition.ifFalse);
  sizeCondition.output.connectTo(updateSize.size);

  // Connect final output to system
  updateSize.output.connectTo(systemBlock.particle);

  // Texture
  const texture = new ParticleTextureSourceBlock('Texture');
  texture.url = Tools.GetAssetUrl('https://assets.babylonjs.com/core/textures/flare.png');
  texture.texture.connectTo(systemBlock.texture);

  set.systemBlocks.push(systemBlock);

  return set;
}

