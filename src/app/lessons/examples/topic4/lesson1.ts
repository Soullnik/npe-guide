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
} from '@babylonjs/core';

/**
 * Lesson 4.1: Advanced Color Management
 * 
 * This lesson introduces ParticleLerpBlock for creating smooth color gradients.
 * You'll learn how to interpolate between two colors over time, creating smooth transitions.
 * 
 * Key concepts:
 * - ParticleLerpBlock: Linear interpolation between two values (colors, sizes, etc.)
 * - Color gradients: Smooth transitions from one color to another
 * - Alpha fading: Making particles fade to transparent over time
 * - Using ParticleConverterBlock to create Color4 from individual components
 * 
 * Prerequisites: Topic 1, Lesson 4 (Property Combinations)
 */
export function createTopic4Lesson1Set(existingSet?: NodeParticleSystemSet): NodeParticleSystemSet {
  const set = existingSet || new NodeParticleSystemSet('Topic 4, Lesson 1 · Advanced Color Management');
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
  const initialColor05 = new ParticleInputBlock('Initial Color');
  initialColor05.value = new Color4(1.0, 0.2, 0.2, 1.0); // Bright red - start color
  initialColor05.output.connectTo(createParticle.color);
  const baseSize05 = new ParticleInputBlock('Base Size');
  baseSize05.value = 0.4;
  baseSize05.output.connectTo(createParticle.size);
  const boxShape = new BoxShapeBlock('Box emitter');
  createParticle.particle.connectTo(boxShape.particle);
  boxShape.output.connectTo(updatePosition.particle);

  // COLOR UPDATE WITH GRADIENT
  // We'll create a smooth color transition from red to blue, fading to transparent
  const updateColor = new UpdateColorBlock('Update color');
  updatePosition.output.connectTo(updateColor.particle);

  // Get age and lifetime for color interpolation
  // We'll use age ratio to control the interpolation progress
  const age = new ParticleInputBlock('Age');
  age.contextualValue = NodeParticleContextualSources.Age;
  const lifetime = new ParticleInputBlock('Lifetime');
  lifetime.contextualValue = NodeParticleContextualSources.Lifetime;

  // Calculate age ratio (0 to 1)
  // This will be our gradient value for the lerp
  const ageRatio = new ParticleMathBlock('Age / Lifetime');
  ageRatio.operation = ParticleMathBlockOperations.Divide;
  age.output.connectTo(ageRatio.left);
  lifetime.output.connectTo(ageRatio.right);

  // CREATE START COLOR (bright red)
  // ParticleConverterBlock converts individual R, G, B, A values into a Color4
  // This allows us to create colors programmatically
  const startColorConverter = new ParticleConverterBlock('Start Color');
  const startR = new ParticleInputBlock('Start R');
  startR.value = 1.0; // Full red
  const startG = new ParticleInputBlock('Start G');
  startG.value = 0.2; // Low green
  const startB = new ParticleInputBlock('Start B');
  startB.value = 0.2; // Low blue
  const startA = new ParticleInputBlock('Start A');
  startA.value = 1.0; // Full alpha (opaque)
  startR.output.connectTo(startColorConverter.xIn); // R component
  startG.output.connectTo(startColorConverter.yIn); // G component
  startB.output.connectTo(startColorConverter.zIn); // B component
  startA.output.connectTo(startColorConverter.wIn); // A component (alpha)

  // CREATE END COLOR (blue, fading to transparent)
  // The end color will be blue with alpha fading to 0 (transparent)
  const endColorConverter = new ParticleConverterBlock('End Color');
  const endR = new ParticleInputBlock('End R');
  endR.value = 0.2; // Low red
  const endG = new ParticleInputBlock('End G');
  endG.value = 0.2; // Low green
  const endB = new ParticleInputBlock('End B');
  endB.value = 1.0; // Full blue
  const endA = new ParticleInputBlock('End A');
  endA.value = 0.0; // Zero alpha (fully transparent)
  endR.output.connectTo(endColorConverter.xIn);
  endG.output.connectTo(endColorConverter.yIn);
  endB.output.connectTo(endColorConverter.zIn);
  endA.output.connectTo(endColorConverter.wIn);

  // LERP BETWEEN START AND END COLOR
  // ParticleLerpBlock performs linear interpolation between two colors
  // Formula: result = startColor + (endColor - startColor) * gradient
  // When gradient = 0 (ageRatio = 0): result = startColor (red, opaque)
  // When gradient = 1 (ageRatio = 1): result = endColor (blue, transparent)
  // When gradient = 0.5: result = middle color (purple, semi-transparent)
  //
  // This creates a smooth transition:
  // - Color: red → purple → blue
  // - Alpha: 1.0 → 0.5 → 0.0 (fades to transparent)
  const colorLerp = new ParticleLerpBlock('Color Lerp');
  startColorConverter.colorOut.connectTo(colorLerp.left); // Start color
  endColorConverter.colorOut.connectTo(colorLerp.right); // End color
  ageRatio.output.connectTo(colorLerp.gradient); // Interpolation factor (0 to 1)
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

