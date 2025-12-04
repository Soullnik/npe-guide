import {
  NodeParticleSystemSet,
  PointShapeBlock,
  SphereShapeBlock,
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
} from '@babylonjs/core';

/**
 * Lesson 2.4: Multiple Emitters
 * 
 * This lesson demonstrates how to create multiple particle systems with different
 * emitters in a single NodeParticleSystemSet. This allows you to create complex
 * effects by combining different emission patterns.
 * 
 * Key concepts:
 * - Multiple SystemBlocks in one set
 * - Different shapes for different systems
 * - Combining emission patterns
 * - Use cases: Multi-source effects, layered particles, complex scenes
 */
export function createTopic2Lesson4Set(existingSet?: NodeParticleSystemSet): NodeParticleSystemSet {
  const set = existingSet || new NodeParticleSystemSet('Topic 2, Lesson 4 · Multiple Emitters');
  set.clear();
  set.editorData = null;

  // FIRST PARTICLE SYSTEM - Point emitter
  const systemBlock1 = new SystemBlock('Point Particle System');

  const updatePosition1 = new UpdatePositionBlock('Update position 1');
  const position1 = new ParticleInputBlock('Position 1');
  position1.contextualValue = NodeParticleContextualSources.Position;
  const scaledDirection1 = new ParticleInputBlock('Scaled direction 1');
  scaledDirection1.contextualValue = NodeParticleContextualSources.ScaledDirection;
  const addVector1 = new ParticleMathBlock('Position + Direction 1');
  addVector1.operation = ParticleMathBlockOperations.Add;
  position1.output.connectTo(addVector1.left);
  scaledDirection1.output.connectTo(addVector1.right);
  addVector1.output.connectTo(updatePosition1.position);

  const createParticle1 = new CreateParticleBlock('Create particle 1');
  const initialColor1 = new ParticleInputBlock('Initial Color 1');
  initialColor1.value = new Color4(1, 0.2, 0.2, 1); // Red
  initialColor1.output.connectTo(createParticle1.color);
  const baseSize1 = new ParticleInputBlock('Base Size 1');
  baseSize1.value = 0.2;
  baseSize1.output.connectTo(createParticle1.size);
  const pointShape = new PointShapeBlock('Point emitter');
  createParticle1.particle.connectTo(pointShape.particle);
  pointShape.output.connectTo(updatePosition1.particle);

  const updateColor1 = new UpdateColorBlock('Update color 1');
  updatePosition1.output.connectTo(updateColor1.particle);
  const initialColorContextual1 = new ParticleInputBlock('Initial Color 1');
  initialColorContextual1.contextualValue = NodeParticleContextualSources.InitialColor;
  initialColorContextual1.output.connectTo(updateColor1.color);

  const updateSize1 = new UpdateSizeBlock('Update size 1');
  updateColor1.output.connectTo(updateSize1.particle);
  const constantSize1 = new ParticleInputBlock('Constant Size 1');
  constantSize1.value = 0.2;
  constantSize1.output.connectTo(updateSize1.size);

  updateSize1.output.connectTo(systemBlock1.particle);

  const texture1 = new ParticleTextureSourceBlock('Texture 1');
  texture1.url = Tools.GetAssetUrl('https://assets.babylonjs.com/core/textures/flare.png');
  texture1.texture.connectTo(systemBlock1.texture);

  // SECOND PARTICLE SYSTEM - Sphere emitter
  const systemBlock2 = new SystemBlock('Sphere Particle System');

  const updatePosition2 = new UpdatePositionBlock('Update position 2');
  const position2 = new ParticleInputBlock('Position 2');
  position2.contextualValue = NodeParticleContextualSources.Position;
  const scaledDirection2 = new ParticleInputBlock('Scaled direction 2');
  scaledDirection2.contextualValue = NodeParticleContextualSources.ScaledDirection;
  const addVector2 = new ParticleMathBlock('Position + Direction 2');
  addVector2.operation = ParticleMathBlockOperations.Add;
  position2.output.connectTo(addVector2.left);
  scaledDirection2.output.connectTo(addVector2.right);
  addVector2.output.connectTo(updatePosition2.position);

  const createParticle2 = new CreateParticleBlock('Create particle 2');
  const initialColor2 = new ParticleInputBlock('Initial Color 2');
  initialColor2.value = new Color4(0.2, 0.2, 1, 1); // Blue
  initialColor2.output.connectTo(createParticle2.color);
  const baseSize2 = new ParticleInputBlock('Base Size 2');
  baseSize2.value = 0.4;
  baseSize2.output.connectTo(createParticle2.size);
  const sphereShape = new SphereShapeBlock('Sphere emitter');
  const sphereRadius = new ParticleInputBlock('Sphere Radius');
  sphereRadius.value = 2.0;
  sphereRadius.output.connectTo(sphereShape.radius);
  createParticle2.particle.connectTo(sphereShape.particle);
  sphereShape.output.connectTo(updatePosition2.particle);

  const updateColor2 = new UpdateColorBlock('Update color 2');
  updatePosition2.output.connectTo(updateColor2.particle);
  const initialColorContextual2 = new ParticleInputBlock('Initial Color 2');
  initialColorContextual2.contextualValue = NodeParticleContextualSources.InitialColor;
  initialColorContextual2.output.connectTo(updateColor2.color);

  const updateSize2 = new UpdateSizeBlock('Update size 2');
  updateColor2.output.connectTo(updateSize2.particle);
  const constantSize2 = new ParticleInputBlock('Constant Size 2');
  constantSize2.value = 0.4;
  constantSize2.output.connectTo(updateSize2.size);

  updateSize2.output.connectTo(systemBlock2.particle);

  const texture2 = new ParticleTextureSourceBlock('Texture 2');
  texture2.url = Tools.GetAssetUrl('https://assets.babylonjs.com/core/textures/flare.png');
  texture2.texture.connectTo(systemBlock2.texture);

  set.systemBlocks.push(systemBlock1, systemBlock2);

  return set;
}

