import {
  NodeParticleSystemSet,
  SphereShapeBlock,
  CreateParticleBlock,
  NodeParticleContextualSources,
  NodeParticleSystemSources,
  ParticleInputBlock,
  ParticleMathBlock,
  ParticleMathBlockOperations,
  ParticleRandomBlock,
  ParticleRandomBlockLocks,
  SystemBlock,
  UpdatePositionBlock,
  UpdateColorBlock,
  UpdateSizeBlock,
  UpdateAngleBlock,
  Tools,
  Color4,
  ParticleTextureSourceBlock
} from '@babylonjs/core';

/**
 * Lesson 6.4: Complex Systems
 * 
 * This lesson combines all the concepts learned throughout the course to create
 * a complex, production-ready particle system. You'll use multiple techniques
 * including time-based properties, randomness, vector operations, and advanced
 * updates to create a sophisticated effect.
 * 
 * Key concepts:
 * - Combining multiple techniques in one system
 * - Complex block chains with multiple calculations
 * - Production-ready particle effects
 * - Best practices for complex systems
 */
export function createTopic6Lesson4Set(existingSet?: NodeParticleSystemSet): NodeParticleSystemSet {
  const set = existingSet || new NodeParticleSystemSet('Topic 6, Lesson 4 · Complex Systems');
  set.clear();
  set.editorData = null;

  const systemBlock = new SystemBlock('Particle System');

  // COMPLEX POSITION UPDATE
  // For this complex system, we'll skip direction modification to keep it simpler
  // Direction modification would require delta time and proper vector math
  // This lesson focuses on combining multiple techniques, not advanced physics

  const updatePosition = new UpdatePositionBlock('Update position');
  
  // Time for rotation calculation
  const time = new ParticleInputBlock('Time');
  time.systemSource = NodeParticleSystemSources.Time;
  const position = new ParticleInputBlock('Position');
  position.contextualValue = NodeParticleContextualSources.Position;
  const scaledDirection = new ParticleInputBlock('Scaled direction');
  scaledDirection.contextualValue = NodeParticleContextualSources.ScaledDirection;
  const addVector = new ParticleMathBlock('Position + Direction');
  addVector.operation = ParticleMathBlockOperations.Add;
  position.output.connectTo(addVector.left);
  scaledDirection.output.connectTo(addVector.right);
  addVector.output.connectTo(updatePosition.position);

  // CREATE PARTICLE WITH RANDOM PROPERTIES
  const createParticle = new CreateParticleBlock('Create particle');
  
  // Random color
  const minColor = new ParticleInputBlock('Min Color');
  minColor.value = new Color4(0.8, 0.2, 0.2, 1); // Red
  const maxColor = new ParticleInputBlock('Max Color');
  maxColor.value = new Color4(1, 0.8, 0.2, 1); // Yellow
  const randomColor = new ParticleRandomBlock('Random Color');
  randomColor.lockMode = ParticleRandomBlockLocks.OncePerParticle;
  minColor.output.connectTo(randomColor.min);
  maxColor.output.connectTo(randomColor.max);
  randomColor.output.connectTo(createParticle.color);

  // Random size
  const minSize = new ParticleInputBlock('Min Size');
  minSize.value = 0.2;
  const maxSize = new ParticleInputBlock('Max Size');
  maxSize.value = 0.5;
  const randomSize = new ParticleRandomBlock('Random Size');
  randomSize.lockMode = ParticleRandomBlockLocks.OncePerParticle;
  minSize.output.connectTo(randomSize.min);
  maxSize.output.connectTo(randomSize.max);
  randomSize.output.connectTo(createParticle.size);

  const sphereShape = new SphereShapeBlock('Sphere emitter');
  const sphereRadius = new ParticleInputBlock('Sphere Radius');
  sphereRadius.value = 1.5;
  sphereRadius.output.connectTo(sphereShape.radius);
  createParticle.particle.connectTo(sphereShape.particle);
  sphereShape.output.connectTo(updatePosition.particle);

  // TIME-BASED COLOR FADE
  const age = new ParticleInputBlock('Age');
  age.contextualValue = NodeParticleContextualSources.Age;
  const lifetime = new ParticleInputBlock('Lifetime');
  lifetime.contextualValue = NodeParticleContextualSources.Lifetime;
  const ageRatio = new ParticleMathBlock('Age / Lifetime');
  ageRatio.operation = ParticleMathBlockOperations.Divide;
  age.output.connectTo(ageRatio.left);
  lifetime.output.connectTo(ageRatio.right);

  const one = new ParticleInputBlock('One');
  one.value = 1.0;
  const fadeFactor = new ParticleMathBlock('Fade Factor');
  fadeFactor.operation = ParticleMathBlockOperations.Subtract;
  one.output.connectTo(fadeFactor.left);
  ageRatio.output.connectTo(fadeFactor.right);

  const updateColor = new UpdateColorBlock('Update color');
  updatePosition.output.connectTo(updateColor.particle);
  const initialColor = new ParticleInputBlock('Initial Color');
  initialColor.contextualValue = NodeParticleContextualSources.InitialColor;
  const fadeColor = new ParticleMathBlock('Faded Color');
  fadeColor.operation = ParticleMathBlockOperations.Multiply;
  initialColor.output.connectTo(fadeColor.left);
  fadeFactor.output.connectTo(fadeColor.right);
  fadeColor.output.connectTo(updateColor.color);

  // TIME-BASED SIZE GROWTH
  const updateSize = new UpdateSizeBlock('Update size');
  updateColor.output.connectTo(updateSize.particle);
  // Use a constant base size value instead of contextual Size
  // Size contextual value represents current size, not initial size
  const baseSize = new ParticleInputBlock('Base Size');
  baseSize.value = 0.3;
  const growthFactor = new ParticleMathBlock('Growth Factor');
  growthFactor.operation = ParticleMathBlockOperations.Add;
  one.output.connectTo(growthFactor.left);
  ageRatio.output.connectTo(growthFactor.right);
  const finalSize = new ParticleMathBlock('Final Size');
  finalSize.operation = ParticleMathBlockOperations.Multiply;
  baseSize.output.connectTo(finalSize.left);
  growthFactor.output.connectTo(finalSize.right);
  finalSize.output.connectTo(updateSize.size);

  // ANGLE ROTATION
  const rotationSpeed = new ParticleInputBlock('Rotation Speed');
  rotationSpeed.value = 3.0;
  const rotationAngle = new ParticleMathBlock('Rotation Angle');
  rotationAngle.operation = ParticleMathBlockOperations.Multiply;
  time.output.connectTo(rotationAngle.left);
  rotationSpeed.output.connectTo(rotationAngle.right);
  const updateAngle = new UpdateAngleBlock('Update Angle');
  updateSize.output.connectTo(updateAngle.particle);
  rotationAngle.output.connectTo(updateAngle.angle);

  // Connect final output to system
  updateAngle.output.connectTo(systemBlock.particle);

  // Texture
  const texture = new ParticleTextureSourceBlock('Texture');
  texture.url = Tools.GetAssetUrl('https://assets.babylonjs.com/core/textures/flare.png');
  texture.texture.connectTo(systemBlock.texture);

  set.systemBlocks.push(systemBlock);

  return set;
}

