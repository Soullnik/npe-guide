import {
  NodeParticleSystemSet,
  ConeShapeBlock,
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

export function createLesson03Set(existingSet?: NodeParticleSystemSet): NodeParticleSystemSet {
  const set = existingSet || new NodeParticleSystemSet('Lesson 03 · Different Emitter Shapes');
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
  const initialColor03 = new ParticleInputBlock('Initial Color');
  initialColor03.value = new Color4(1, 1, 1, 1);
  initialColor03.output.connectTo(createParticle.color);
  const baseSize03 = new ParticleInputBlock('Base Size');
  baseSize03.value = 0.3;
  baseSize03.output.connectTo(createParticle.size);

  // Use ConeShapeBlock to demonstrate different emitter shapes
  // Cone emits particles in a cone pattern
  const coneShape = new ConeShapeBlock('Cone emitter');
  const radius = new ParticleInputBlock('Radius');
  radius.value = 2.0;
  radius.output.connectTo(coneShape.radius);
  const angle = new ParticleInputBlock('Angle');
  angle.value = Math.PI / 4; // 45 degrees
  angle.output.connectTo(coneShape.angle);
  const radiusRange = new ParticleInputBlock('Radius Range');
  radiusRange.value = 1.0;
  radiusRange.output.connectTo(coneShape.radiusRange);
  const heightRange = new ParticleInputBlock('Height Range');
  heightRange.value = 1.0;
  heightRange.output.connectTo(coneShape.heightRange);

  createParticle.particle.connectTo(coneShape.particle);
  coneShape.output.connectTo(updatePosition.particle);

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

