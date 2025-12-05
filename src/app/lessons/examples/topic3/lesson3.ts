import {
  NodeParticleSystemSet,
  BoxShapeBlock,
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
} from '@babylonjs/core';

/**
 * Lesson 2.3: Attractors
 * 
 * This lesson introduces UpdateAttractorBlock for creating attractor effects.
 * Attractors pull particles toward a specific point in 3D space, creating effects
 * like particles being drawn to a black hole, magnetic fields, or gravitational wells.
 * 
 * Key concepts:
 * - UpdateAttractorBlock: Creates a force that pulls particles toward a target point
 * - Attractor position: The 3D point that particles are attracted to
 * - Attractor strength: How strong the attraction force is
 * - Force formula: force = (strength / distance²) * direction
 * - Distance-based force: Closer particles experience stronger pull
 * 
 * Prerequisites: Topic 2, Lesson 1 (Basic Forces and Physics)
 */
export function createTopic3Lesson3Set(existingSet?: NodeParticleSystemSet): NodeParticleSystemSet {
  const set = existingSet || new NodeParticleSystemSet('Topic 2, Lesson 3 · Attractors');
  set.clear();
  set.editorData = null;

  const systemBlock = new SystemBlock('Particle System');

  // CREATE PARTICLE
  const createParticle = new CreateParticleBlock('Create particle');
  const initialColor09 = new ParticleInputBlock('Initial Color');
  initialColor09.value = new Color4(1, 1, 1, 1); // White
  initialColor09.output.connectTo(createParticle.color);
  const baseSize09 = new ParticleInputBlock('Base Size');
  baseSize09.value = 0.3;
  baseSize09.output.connectTo(createParticle.size);
  const boxShape = new BoxShapeBlock('Box emitter');
  createParticle.particle.connectTo(boxShape.particle);

  // ATTRACTOR
  // UpdateAttractorBlock creates a force that pulls particles toward a specific point
  // This is useful for creating effects like:
  // - Particles being drawn to a black hole
  // - Magnetic fields
  // - Gravitational wells
  // - Particles orbiting a center point
  //
  // IMPORTANT: UpdateAttractorBlock modifies the particle's direction, so it must come BEFORE UpdatePositionBlock
  // The chain should be: CreateParticle → BoxShape → UpdateAttractor → UpdatePosition
  // This ensures the attractor modifies direction first, then position is updated based on the modified direction
  const updateAttractor = new UpdateAttractorBlock('Attractor');
  boxShape.output.connectTo(updateAttractor.particle);

  // CREATE ATTRACTOR POSITION
  // The attractor position is a 3D point (Vector3) that particles are attracted to
  // In this lesson, we set it to the origin (0, 0, 0) - the center of the scene
  // You can change these values to move the attractor anywhere in 3D space
  const attractorConverter = new ParticleConverterBlock('Attractor Position');
  const attractorX = new ParticleInputBlock('Attractor X');
  attractorX.value = 0.0; // X coordinate
  const attractorY = new ParticleInputBlock('Attractor Y');
  attractorY.value = 0.0; // Y coordinate (center)
  const attractorZ = new ParticleInputBlock('Attractor Z');
  attractorZ.value = 0.0; // Z coordinate
  attractorX.output.connectTo(attractorConverter.xIn);
  attractorY.output.connectTo(attractorConverter.yIn);
  attractorZ.output.connectTo(attractorConverter.zIn);
  attractorConverter.xyzOut.connectTo(updateAttractor.attractor);

  // ATTRACTOR STRENGTH
  // Strength determines how strong the attraction force is
  // Higher values = stronger pull
  // The force is inversely proportional to distance squared:
  //   - Close particles: strong pull
  //   - Distant particles: weak pull
  //
  // Formula: force = (strength / distance²) * direction
  // This creates realistic behavior where particles accelerate as they get closer
  const attractorStrength = new ParticleInputBlock('Attractor Strength');
  attractorStrength.value = 5.0; // Moderate strength
  attractorStrength.output.connectTo(updateAttractor.strength);

  // POSITION UPDATE
  // After the attractor modifies the direction, we update position based on the new direction
  // The chain is: UpdateAttractor → UpdatePosition
  const updatePosition = new UpdatePositionBlock('Update position');
  updateAttractor.output.connectTo(updatePosition.particle);
  const position = new ParticleInputBlock('Position');
  position.contextualValue = NodeParticleContextualSources.Position;
  const scaledDirection = new ParticleInputBlock('Scaled direction');
  scaledDirection.contextualValue = NodeParticleContextualSources.ScaledDirection;
  const addVector = new ParticleMathBlock('Position + Direction');
  addVector.operation = ParticleMathBlockOperations.Add;
  position.output.connectTo(addVector.left);
  scaledDirection.output.connectTo(addVector.right);
  addVector.output.connectTo(updatePosition.position);

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

