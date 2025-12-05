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
  UpdateScaleBlock,
  ParticleConverterBlock,
  Tools,
  Color4,
  ParticleTextureSourceBlock
} from '@babylonjs/core';

/**
 * Lesson 1.4: Property Combinations
 * 
 * This lesson combines all the concepts from previous lessons to create complex particle effects.
 * We'll learn how to combine multiple properties (color, size, scale) using age-based calculations.
 * 
 * Key concepts:
 * - Combining multiple properties with age ratio
 * - Complex color transitions using ParticleConverterBlock
 * - Non-uniform scaling (different X and Y scale)
 * - Chaining multiple update blocks
 * - Using inverted age ratio (1 - ageRatio) for different effects
 * 
 * Prerequisites: Lessons 1.1, 1.2, 1.3
 */
export function createTopic1Lesson4Set(existingSet?: NodeParticleSystemSet): NodeParticleSystemSet {
  const set = existingSet || new NodeParticleSystemSet('Topic 1, Lesson 4 · Property Combinations');
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
  const initialColor = new ParticleInputBlock('Initial Color');
  initialColor.value = new Color4(1, 0.5, 0, 1); // Orange - start color
  initialColor.output.connectTo(createParticle.color);
  const baseSize = new ParticleInputBlock('Base Size');
  baseSize.value = 0.3;
  baseSize.output.connectTo(createParticle.size);
  const boxShape = new BoxShapeBlock('Box emitter');
  createParticle.particle.connectTo(boxShape.particle);
  boxShape.output.connectTo(updatePosition.particle);

  // TIME-BASED CALCULATIONS
  // Get age and lifetime for all property calculations
  // These are the foundation for time-based effects
  const age = new ParticleInputBlock('Age');
  age.contextualValue = NodeParticleContextualSources.Age;
  const lifetime = new ParticleInputBlock('Lifetime');
  lifetime.contextualValue = NodeParticleContextualSources.Lifetime;
  
  // Calculate age ratio (0 to 1)
  // This value represents how far through its life the particle is
  const ageRatio = new ParticleMathBlock('Age / Lifetime');
  ageRatio.operation = ParticleMathBlockOperations.Divide;
  age.output.connectTo(ageRatio.left);
  lifetime.output.connectTo(ageRatio.right);

  // COLOR UPDATE - Complex color transition
  // We'll create a color that transitions from orange to red as the particle ages
  const updateColor = new UpdateColorBlock('Update color');
  updatePosition.output.connectTo(updateColor.particle);
  
  // Calculate inverted age ratio: 1 - ageRatio
  // This is useful for effects that fade or decrease over time
  const one = new ParticleInputBlock('One');
  one.value = 1.0;
  const ageRatioInverted = new ParticleMathBlock('1 - Age Ratio');
  ageRatioInverted.operation = ParticleMathBlockOperations.Subtract;
  one.output.connectTo(ageRatioInverted.left);
  ageRatio.output.connectTo(ageRatioInverted.right);

  // Create complex color using ParticleConverterBlock
  // This block converts individual R, G, B, A values into a Color4
  // Red component: increases with age (ageRatio)
  // Green component: fades with age (ageRatioInverted)
  // Blue component: fades with age, but multiplied by 0.5 for subtlety
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

  // SIZE UPDATE - Particles grow over time
  // Formula: size = baseSize * (1 + growthAmount * ageRatio)
  // When ageRatio = 0: size = baseSize * 1 = baseSize
  // When ageRatio = 1: size = baseSize * (1 + 2) = baseSize * 3
  const updateSize = new UpdateSizeBlock('Update size');
  updateColor.output.connectTo(updateSize.particle);
  const baseSizeUpdate = new ParticleInputBlock('Base Size');
  baseSizeUpdate.value = 0.3;
  
  // Calculate growth multiplier: 1 + (growthAmount * ageRatio)
  const growthMultiplier = new ParticleMathBlock('Growth Multiplier');
  growthMultiplier.operation = ParticleMathBlockOperations.Multiply;
  ageRatio.output.connectTo(growthMultiplier.left);
  const growthAmount = new ParticleInputBlock('Growth Amount');
  growthAmount.value = 2.0;
  growthAmount.output.connectTo(growthMultiplier.right);
  
  const growthFactor = new ParticleMathBlock('Growth Factor');
  growthFactor.operation = ParticleMathBlockOperations.Add;
  one.output.connectTo(growthFactor.left);
  growthMultiplier.output.connectTo(growthFactor.right);
  
  // Final size calculation
  const sizeGrowth = new ParticleMathBlock('Size Growth');
  sizeGrowth.operation = ParticleMathBlockOperations.Multiply;
  baseSizeUpdate.output.connectTo(sizeGrowth.left);
  growthFactor.output.connectTo(sizeGrowth.right);
  sizeGrowth.output.connectTo(updateSize.size);

  // SCALE UPDATE - Non-uniform scaling
  // Scale allows us to change particle size independently from the size property
  // We'll make particles wider (X scales down) but taller (Y scales up) over time
  const updateScale = new UpdateScaleBlock('Update scale');
  updateSize.output.connectTo(updateScale.particle);
  
  // Scale X: decreases over time (particles become wider)
  // Formula: scaleX = baseX * (1 - ageRatio)
  const scaleX = new ParticleMathBlock('Scale X');
  scaleX.operation = ParticleMathBlockOperations.Multiply;
  one.output.connectTo(scaleX.left);
  ageRatioInverted.output.connectTo(scaleX.right); // X scales down
  
  // Scale Y: increases over time (particles become taller)
  // Formula: scaleY = baseY * (1 + ageRatio)
  const scaleY = new ParticleMathBlock('Scale Y');
  scaleY.operation = ParticleMathBlockOperations.Multiply;
  one.output.connectTo(scaleY.left);
  const scaleYFactor = new ParticleMathBlock('Scale Y Factor');
  scaleYFactor.operation = ParticleMathBlockOperations.Add;
  one.output.connectTo(scaleYFactor.left);
  ageRatio.output.connectTo(scaleYFactor.right); // Y scales up
  scaleYFactor.output.connectTo(scaleY.right);

  // Convert X and Y scales to Vector2 for UpdateScaleBlock
  // UpdateScaleBlock requires a Vector2 input for non-uniform scaling
  const scaleConverter = new ParticleConverterBlock('Scale Vector2');
  scaleX.output.connectTo(scaleConverter.xIn);
  scaleY.output.connectTo(scaleConverter.yIn);
  scaleConverter.xyOut.connectTo(updateScale.scale);

  // Connect final output to system
  // The complete chain: CreateParticle → PointShape → UpdatePosition → UpdateColor → UpdateSize → UpdateScale → SystemBlock
  updateScale.output.connectTo(systemBlock.particle);

  // Texture
  const texture = new ParticleTextureSourceBlock('Texture');
  texture.url = Tools.GetAssetUrl('https://assets.babylonjs.com/core/textures/flare.png');
  texture.texture.connectTo(systemBlock.texture);

  set.systemBlocks.push(systemBlock);

  return set;
}

