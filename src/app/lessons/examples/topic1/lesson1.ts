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
  Tools,
  Color4,
  ParticleTextureSourceBlock
} from 'babylonjs';

/**
 * Lesson 1.1: First Emission
 * 
 * This is the first lesson in the Node Particle Editor guide.
 * You'll learn how to create a simple particle system with basic blocks.
 * 
 * Key concepts:
 * - SystemBlock: The root of any particle system
 * - CreateParticleBlock: Creates new particles
 * - BoxShapeBlock: Defines where particles are emitted from (a box volume)
 * - UpdatePositionBlock: Updates particle position each frame
 * - Particle flow: Create → Shape → Update → System
 * 
 * Note: This is the first lesson, focusing only on basic particle creation and movement.
 * Color and size updates will be introduced in Lesson 1.2.
 */
export function createTopic1Lesson1Set(existingSet?: NodeParticleSystemSet): NodeParticleSystemSet {
  const set = existingSet || new NodeParticleSystemSet('Topic 1, Lesson 1 · First Emission');
  set.clear();
  set.editorData = null;

  // SystemBlock is the root of any particle system
  // It manages the overall system properties and connects to all particle-related blocks
  const systemBlock = new SystemBlock('Particle System');

  // POSITION UPDATE
  // UpdatePositionBlock updates the position of particles each frame
  // This is essential for any particle movement
  const updatePosition = new UpdatePositionBlock('Update position');
  
  // Get the current position of the particle
  // This is a contextual value that changes each frame as the particle moves
  const position = new ParticleInputBlock('Position');
  position.contextualValue = NodeParticleContextualSources.Position;
  
  // Get the scaled direction (direction * directionScale)
  // This represents how far the particle will move this frame
  // Scaled direction is already multiplied by the direction scale, so we can directly add it to position
  const scaledDirection = new ParticleInputBlock('Scaled direction');
  scaledDirection.contextualValue = NodeParticleContextualSources.ScaledDirection;
  
  // Add position and direction to get the new position
  // This is the basic movement formula: newPosition = oldPosition + movement
  // The ParticleMathBlock performs vector addition
  const addVector = new ParticleMathBlock('Position + Direction');
  addVector.operation = ParticleMathBlockOperations.Add;
  position.output.connectTo(addVector.left);
  scaledDirection.output.connectTo(addVector.right);
  addVector.output.connectTo(updatePosition.position);

  // CREATE PARTICLE
  // CreateParticleBlock is responsible for particle emission
  // It creates new particles with initial properties (color, size, etc.)
  const createParticle = new CreateParticleBlock('Create particle');
  
  // Set the initial color when the particle is created
  // Color4(1, 1, 1, 1) = white (R, G, B, Alpha all at maximum)
  const initialColor01 = new ParticleInputBlock('Initial Color');
  initialColor01.value = new Color4(1, 1, 1, 1); // White
  initialColor01.output.connectTo(createParticle.color);
  
  // Set the initial size when the particle is created
  // Size value of 0.3 is a good starting point for visible particles
  const baseSize01 = new ParticleInputBlock('Base Size');
  baseSize01.value = 0.3;
  baseSize01.output.connectTo(createParticle.size);
  
  // BoxShapeBlock defines a box-shaped emitter
  // Particles will be created within this box volume
  // The box has a default size, but you can customize it with radius properties
  const boxShape = new BoxShapeBlock('Box emitter');
  createParticle.particle.connectTo(boxShape.particle);
  boxShape.output.connectTo(updatePosition.particle);

  // Connect final output to system
  // The complete chain: CreateParticle → BoxShape → UpdatePosition → SystemBlock
  // Each block receives the particle from the previous block, modifies it, and passes it to the next block
  // Note: In this first lesson, we only handle movement. Color and size updates will be introduced in Lesson 1.2.
  updatePosition.output.connectTo(systemBlock.particle);

  // TEXTURE
  // ParticleTextureSourceBlock provides a texture for particles
  // This determines how particles look when rendered
  // The flare.png texture is a common choice for particle effects
  const texture = new ParticleTextureSourceBlock('Texture');
  texture.url = Tools.GetAssetUrl('https://assets.babylonjs.com/core/textures/flare.png');
  texture.texture.connectTo(systemBlock.texture);

  // Add the system block to the set
  // A set can contain multiple system blocks, but in this lesson we only have one
  set.systemBlocks.push(systemBlock);

  return set;
}

