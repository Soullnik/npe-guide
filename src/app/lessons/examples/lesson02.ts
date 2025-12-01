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
  UpdateScaleBlock,
  ParticleConverterBlock,
  Tools,
  Color4,
  ParticleTextureSourceBlock
} from 'babylonjs';

export function createLesson02Set(): NodeParticleSystemSet {
  const set = new NodeParticleSystemSet('Lesson 02 · Particle Properties');
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
  const initialColor02 = new ParticleInputBlock('Initial Color');
  initialColor02.value = new Color4(1, 0.5, 0, 1); // Orange - start color
  initialColor02.output.connectTo(createParticle.color);
  const baseSize02 = new ParticleInputBlock('Base Size');
  baseSize02.value = 0.3;
  baseSize02.output.connectTo(createParticle.size);
  const pointShape = new PointShapeBlock('Point emitter');
  createParticle.particle.connectTo(pointShape.particle);
  pointShape.output.connectTo(updatePosition.particle);

  // Get age and lifetime for all property calculations
  const age = new ParticleInputBlock('Age');
  age.contextualValue = NodeParticleContextualSources.Age;
  const lifetime = new ParticleInputBlock('Lifetime');
  lifetime.contextualValue = NodeParticleContextualSources.Lifetime;
  const ageRatio = new ParticleMathBlock('Age / Lifetime');
  ageRatio.operation = ParticleMathBlockOperations.Divide;
  age.output.connectTo(ageRatio.left);
  lifetime.output.connectTo(ageRatio.right);

  // Color update - combine age-based gradient with inverted ratio
  const updateColor = new UpdateColorBlock('Update color');
  updatePosition.output.connectTo(updateColor.particle);
  const one = new ParticleInputBlock('One');
  one.value = 1.0;
  const ageRatioInverted = new ParticleMathBlock('1 - Age Ratio');
  ageRatioInverted.operation = ParticleMathBlockOperations.Subtract;
  one.output.connectTo(ageRatioInverted.left);
  ageRatio.output.connectTo(ageRatioInverted.right);

  // Create color: red component increases, green/blue fade
  const colorConverter = new ParticleConverterBlock('Color');
  ageRatio.output.connectTo(colorConverter.xIn); // Red increases
  ageRatioInverted.output.connectTo(colorConverter.yIn); // Green fades
  const blueValue = new ParticleMathBlock('Blue Value');
  blueValue.operation = ParticleMathBlockOperations.Multiply;
  ageRatioInverted.output.connectTo(blueValue.left);
  const blueFactor = new ParticleInputBlock('Blue Factor');
  blueFactor.value = 0.5;
  blueFactor.output.connectTo(blueValue.right);
  blueValue.output.connectTo(colorConverter.zIn);
  one.output.connectTo(colorConverter.wIn); // Alpha stays 1
  colorConverter.colorOut.connectTo(updateColor.color);

  // Size update - particles grow over time
  const updateSize = new UpdateSizeBlock('Update size');
  updateColor.output.connectTo(updateSize.particle);
  const baseSize = new ParticleInputBlock('Base Size');
  baseSize.value = 0.3;
  const sizeGrowth = new ParticleMathBlock('Size Growth');
  sizeGrowth.operation = ParticleMathBlockOperations.Multiply;
  baseSize.output.connectTo(sizeGrowth.left);
  const growthFactor = new ParticleMathBlock('Growth Factor');
  growthFactor.operation = ParticleMathBlockOperations.Add;
  one.output.connectTo(growthFactor.left);
  const growthMultiplier = new ParticleMathBlock('Growth Multiplier');
  growthMultiplier.operation = ParticleMathBlockOperations.Multiply;
  ageRatio.output.connectTo(growthMultiplier.left);
  const growthAmount = new ParticleInputBlock('Growth Amount');
  growthAmount.value = 2.0;
  growthAmount.output.connectTo(growthMultiplier.right);
  growthMultiplier.output.connectTo(growthFactor.right);
  growthFactor.output.connectTo(sizeGrowth.right);
  sizeGrowth.output.connectTo(updateSize.size);

  // Scale update - particles scale non-uniformly (X and Y different)
  const updateScale = new UpdateScaleBlock('Update scale');
  updateSize.output.connectTo(updateScale.particle);
  const scaleX = new ParticleMathBlock('Scale X');
  scaleX.operation = ParticleMathBlockOperations.Multiply;
  const scaleXBase = new ParticleInputBlock('Scale X Base');
  scaleXBase.value = 1.0;
  scaleXBase.output.connectTo(scaleX.left);
  ageRatioInverted.output.connectTo(scaleX.right); // X scales down

  const scaleY = new ParticleMathBlock('Scale Y');
  scaleY.operation = ParticleMathBlockOperations.Multiply;
  const scaleYBase = new ParticleInputBlock('Scale Y Base');
  scaleYBase.value = 1.0;
  scaleYBase.output.connectTo(scaleY.left);
  const scaleYFactor = new ParticleMathBlock('Scale Y Factor');
  scaleYFactor.operation = ParticleMathBlockOperations.Add;
  one.output.connectTo(scaleYFactor.left);
  ageRatio.output.connectTo(scaleYFactor.right); // Y scales up
  scaleYFactor.output.connectTo(scaleY.right);

  const scaleConverter = new ParticleConverterBlock('Scale Vector2');
  scaleX.output.connectTo(scaleConverter.xIn);
  scaleY.output.connectTo(scaleConverter.yIn);
  scaleConverter.xyOut.connectTo(updateScale.scale);

  // Connect final output to system
  updateScale.output.connectTo(systemBlock.particle);

  // Texture
  const texture = new ParticleTextureSourceBlock('Texture');
  texture.url = Tools.GetAssetUrl('https://assets.babylonjs.com/core/textures/flare.png');
  texture.texture.connectTo(systemBlock.texture);

  set.systemBlocks.push(systemBlock);

  return set;
}

