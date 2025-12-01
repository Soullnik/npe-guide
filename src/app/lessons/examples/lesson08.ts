import {
  NodeParticleSystemSet,
  PointShapeBlock,
  CreateParticleBlock,
  NodeParticleContextualSources,
  ParticleInputBlock,
  ParticleMathBlock,
  ParticleMathBlockOperations,
  ParticleTextureSourceBlock,
  SystemBlock,
  UpdatePositionBlock,
  UpdateColorBlock,
  UpdateSizeBlock,
  UpdateAttractorBlock,
  ParticleConverterBlock,
  Tools,
  Color4,
} from 'babylonjs';

export function createLesson08Set(): NodeParticleSystemSet {
  const set = new NodeParticleSystemSet('Lesson 08 · Attractors');
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
  const initialColor09 = new ParticleInputBlock('Initial Color');
  initialColor09.value = new Color4(1, 1, 1, 1);
  initialColor09.output.connectTo(createParticle.color);
  const baseSize09 = new ParticleInputBlock('Base Size');
  baseSize09.value = 0.3;
  baseSize09.output.connectTo(createParticle.size);
  const pointShape = new PointShapeBlock('Point emitter');
  createParticle.particle.connectTo(pointShape.particle);
  pointShape.output.connectTo(updatePosition.particle);

  // Attractor - particles are attracted to a point in space
  const updateAttractor = new UpdateAttractorBlock('Attractor');
  updatePosition.output.connectTo(updateAttractor.particle);

  // Create attractor position (center point)
  const attractorConverter = new ParticleConverterBlock('Attractor Position');
  const attractorX = new ParticleInputBlock('Attractor X');
  attractorX.value = 0.0;
  const attractorY = new ParticleInputBlock('Attractor Y');
  attractorY.value = 0.0;
  const attractorZ = new ParticleInputBlock('Attractor Z');
  attractorZ.value = 0.0;
  attractorX.output.connectTo(attractorConverter.xIn);
  attractorY.output.connectTo(attractorConverter.yIn);
  attractorZ.output.connectTo(attractorConverter.zIn);
  attractorConverter.xyzOut.connectTo(updateAttractor.attractor);

  // Attractor strength
  const attractorStrength = new ParticleInputBlock('Attractor Strength');
  attractorStrength.value = 5.0;
  attractorStrength.output.connectTo(updateAttractor.strength);

  // Color update
  const updateColor = new UpdateColorBlock('Update color');
  updateAttractor.output.connectTo(updateColor.particle);
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

