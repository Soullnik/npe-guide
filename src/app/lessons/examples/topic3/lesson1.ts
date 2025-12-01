import {
  NodeParticleSystemSet,
  PointShapeBlock,
  CreateParticleBlock,
  NodeParticleContextualSources,
  NodeParticleSystemSources,
  ParticleInputBlock,
  ParticleMathBlock,
  ParticleMathBlockOperations,
  SystemBlock,
  UpdatePositionBlock,
  UpdateColorBlock,
  UpdateSizeBlock,
  UpdateDirectionBlock,
  ParticleConverterBlock,
  Tools,
  Color4,
  ParticleTextureSourceBlock
} from 'babylonjs';

/**
 * Lesson 2.1: Basic Forces and Physics
 * 
 * This lesson introduces physics-based particle movement using forces.
 * You'll learn how to apply forces like gravity to particles using UpdateDirectionBlock.
 * 
 * Key concepts:
 * - UpdateDirectionBlock: Modifies particle direction (velocity) each frame
 * - Forces: External influences that change particle direction (e.g., gravity)
 * - Delta Time: Time elapsed since last frame (essential for frame-rate independent physics)
 * - Physics formula: newDirection = currentDirection + (force * deltaTime)
 * 
 * Prerequisites: Topic 1, Lesson 1 (First Emission)
 */
export function createTopic3Lesson1Set(existingSet?: NodeParticleSystemSet): NodeParticleSystemSet {
  const set = existingSet || new NodeParticleSystemSet('Topic 2, Lesson 1 · Basic Forces and Physics');
  set.clear();
  set.editorData = null;

  const systemBlock = new SystemBlock('Particle System');

  // CREATE PARTICLE
  const createParticle = new CreateParticleBlock('Create particle');
  const initialColor04 = new ParticleInputBlock('Initial Color');
  initialColor04.value = new Color4(1, 1, 1, 1); // White
  initialColor04.output.connectTo(createParticle.color);
  const baseSize04 = new ParticleInputBlock('Base Size');
  baseSize04.value = 0.3;
  baseSize04.output.connectTo(createParticle.size);
  
  // Use PointShapeBlock to emit particles from a single point
  // This is ideal for physics demonstrations where particles fall due to gravity
  const pointShape = new PointShapeBlock('Point emitter');
  createParticle.particle.connectTo(pointShape.particle);

  // DIRECTION UPDATE WITH GRAVITY
  // UpdateDirectionBlock modifies the direction (velocity) of particles each frame
  // This is essential for applying forces like gravity, wind, or other directional effects
  // Direction represents the velocity vector - how fast and in what direction the particle moves
  const updateDirection = new UpdateDirectionBlock('Update direction');
  pointShape.output.connectTo(updateDirection.particle);

  // Get the current direction of the particle
  // This is the velocity vector that was set when the particle was created
  // We'll modify this by adding the force (gravity) to it
  const currentDirection = new ParticleInputBlock('Direction');
  currentDirection.contextualValue = NodeParticleContextualSources.Direction;

  // DELTA TIME - Critical for frame-rate independent physics
  // Delta time is the time elapsed since the last frame (in seconds)
  // Without delta time, physics would be frame-rate dependent:
  //   - On a fast computer (60 FPS): particles move slowly
  //   - On a slow computer (30 FPS): particles move quickly
  // By multiplying forces by delta time, we ensure consistent behavior regardless of frame rate
  // Example: If deltaTime = 0.016 (60 FPS), force effect is small. If deltaTime = 0.033 (30 FPS), force effect is larger.
  // This compensates for the different frame rates, making physics consistent.
  const deltaTime = new ParticleInputBlock('Delta Time');
  deltaTime.systemSource = NodeParticleSystemSources.Delta;

  // CREATE GRAVITY VECTOR
  // Gravity is a force that pulls particles downward
  // In 3D space, we represent gravity as a Vector3: (X, Y, Z)
  // Standard Earth gravity: (0, -9.8, 0) - pulls downward on the Y axis
  // Negative Y value means downward (in most 3D coordinate systems, Y is up)
  const gravityConverter = new ParticleConverterBlock('Gravity Vector');
  const gravityX = new ParticleInputBlock('Gravity X');
  gravityX.value = 0.0; // No horizontal gravity
  const gravityY = new ParticleInputBlock('Gravity Y');
  gravityY.value = -9.8; // Downward gravity (9.8 m/s² is Earth's gravity)
  const gravityZ = new ParticleInputBlock('Gravity Z');
  gravityZ.value = 0.0; // No depth gravity
  gravityX.output.connectTo(gravityConverter.xIn);
  gravityY.output.connectTo(gravityConverter.yIn);
  gravityZ.output.connectTo(gravityConverter.zIn);

  // MULTIPLY GRAVITY BY DELTA TIME
  // This is the key step for frame-rate independent physics
  // Formula: gravityAcceleration = gravity * deltaTime
  // This gives us the change in velocity per frame
  // Without delta time, gravity would be too strong on fast computers and too weak on slow computers
  const gravityDelta = new ParticleMathBlock('Gravity * Delta');
  gravityDelta.operation = ParticleMathBlockOperations.Multiply;
  gravityConverter.xyzOut.connectTo(gravityDelta.left);
  deltaTime.output.connectTo(gravityDelta.right);

  // ADD GRAVITY TO CURRENT DIRECTION
  // Physics formula: newDirection = currentDirection + (force * deltaTime)
  // This is the fundamental physics equation for applying forces
  // The force (gravity) changes the velocity (direction) of the particle
  // Over time, this creates acceleration - particles fall faster and faster
  const addGravity = new ParticleMathBlock('Direction + Gravity');
  addGravity.operation = ParticleMathBlockOperations.Add;
  currentDirection.output.connectTo(addGravity.left);
  gravityDelta.output.connectTo(addGravity.right);
  addGravity.output.connectTo(updateDirection.direction);

  // POSITION UPDATE
  // After updating direction (velocity), we update position based on the new direction
  // The chain is: UpdateDirection → UpdatePosition
  // This ensures that forces affect direction first, then position is calculated from the new direction
  const updatePosition = new UpdatePositionBlock('Update position');
  updateDirection.output.connectTo(updatePosition.particle);
  const position = new ParticleInputBlock('Position');
  position.contextualValue = NodeParticleContextualSources.Position;
  const scaledDirection = new ParticleInputBlock('Scaled direction');
  scaledDirection.contextualValue = NodeParticleContextualSources.ScaledDirection;
  const addVector = new ParticleMathBlock('Position + Direction');
  addVector.operation = ParticleMathBlockOperations.Add;
  position.output.connectTo(addVector.left);
  scaledDirection.output.connectTo(addVector.right);
  addVector.output.connectTo(updatePosition.position);

  // COLOR UPDATE
  const updateColor = new UpdateColorBlock('Update color');
  updatePosition.output.connectTo(updateColor.particle);
  const initialColor = new ParticleInputBlock('Initial Color');
  initialColor.contextualValue = NodeParticleContextualSources.InitialColor;
  initialColor.output.connectTo(updateColor.color);

  // SIZE UPDATE
  const updateSize = new UpdateSizeBlock('Update size');
  updateColor.output.connectTo(updateSize.particle);
  const baseSize = new ParticleInputBlock('Base Size');
  baseSize.value = 0.3;
  baseSize.output.connectTo(updateSize.size);

  // Connect final output to system
  // Complete chain: CreateParticle → PointShape → UpdateDirection → UpdatePosition → UpdateColor → UpdateSize → SystemBlock
  updateSize.output.connectTo(systemBlock.particle);

  // TEXTURE
  const texture = new ParticleTextureSourceBlock('Texture');
  texture.url = Tools.GetAssetUrl('https://assets.babylonjs.com/core/textures/flare.png');
  texture.texture.connectTo(systemBlock.texture);

  set.systemBlocks.push(systemBlock);

  return set;
}

