import {
  NodeParticleSystemSet,
  BoxShapeBlock,
  CreateParticleBlock,
  NodeParticleContextualSources,
  ParticleInputBlock,
  ParticleMathBlock,
  ParticleMathBlockOperations,
  SystemBlock,
  UpdatePositionBlock,
  UpdateColorBlock,
  UpdateSizeBlock,
  ParticleConverterBlock,
  ParticleLerpBlock,
  Tools,
  Color4,
  ParticleTextureSourceBlock
} from 'babylonjs';

export function createLesson05Set(): NodeParticleSystemSet {
  const set = new NodeParticleSystemSet('Lesson 05 · Advanced Color Management');
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
  const initialColor05 = new ParticleInputBlock('Initial Color');
  initialColor05.value = new Color4(1.0, 0.2, 0.2, 1.0); // Bright red - start color of lerp
  initialColor05.output.connectTo(createParticle.color);
  const baseSize05 = new ParticleInputBlock('Base Size');
  baseSize05.value = 0.4;
  baseSize05.output.connectTo(createParticle.size);
  const boxShape = new BoxShapeBlock('Box emitter');
  createParticle.particle.connectTo(boxShape.particle);
  boxShape.output.connectTo(updatePosition.particle);

  // Color update with gradient
  const updateColor = new UpdateColorBlock('Update color');
  updatePosition.output.connectTo(updateColor.particle);

  // Get age and lifetime for color interpolation
  const age = new ParticleInputBlock('Age');
  age.contextualValue = NodeParticleContextualSources.Age;
  const lifetime = new ParticleInputBlock('Lifetime');
  lifetime.contextualValue = NodeParticleContextualSources.Lifetime;

  // Calculate age ratio (0 to 1)
  const ageRatio = new ParticleMathBlock('Age / Lifetime');
  ageRatio.operation = ParticleMathBlockOperations.Divide;
  age.output.connectTo(ageRatio.left);
  lifetime.output.connectTo(ageRatio.right);

  // Create start color (bright red)
  const startColorConverter = new ParticleConverterBlock('Start Color');
  const startR = new ParticleInputBlock('Start R');
  startR.value = 1.0;
  const startG = new ParticleInputBlock('Start G');
  startG.value = 0.2;
  const startB = new ParticleInputBlock('Start B');
  startB.value = 0.2;
  const startA = new ParticleInputBlock('Start A');
  startA.value = 1.0;
  startR.output.connectTo(startColorConverter.xIn);
  startG.output.connectTo(startColorConverter.yIn);
  startB.output.connectTo(startColorConverter.zIn);
  startA.output.connectTo(startColorConverter.wIn);

  // Create end color (blue, fading to transparent)
  const endColorConverter = new ParticleConverterBlock('End Color');
  const endR = new ParticleInputBlock('End R');
  endR.value = 0.2;
  const endG = new ParticleInputBlock('End G');
  endG.value = 0.2;
  const endB = new ParticleInputBlock('End B');
  endB.value = 1.0;
  const endA = new ParticleInputBlock('End A');
  endA.value = 0.0;
  endR.output.connectTo(endColorConverter.xIn);
  endG.output.connectTo(endColorConverter.yIn);
  endB.output.connectTo(endColorConverter.zIn);
  endA.output.connectTo(endColorConverter.wIn);

  // Lerp between start and end color based on age ratio
  const colorLerp = new ParticleLerpBlock('Color Lerp');
  startColorConverter.colorOut.connectTo(colorLerp.left);
  endColorConverter.colorOut.connectTo(colorLerp.right);
  ageRatio.output.connectTo(colorLerp.gradient);
  colorLerp.output.connectTo(updateColor.color);

  // Size update
  const updateSize = new UpdateSizeBlock('Update size');
  updateColor.output.connectTo(updateSize.particle);
  const baseSize = new ParticleInputBlock('Base Size');
  baseSize.value = 0.4;
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

