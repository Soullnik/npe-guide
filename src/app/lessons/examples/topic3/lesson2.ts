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
  ParticleLerpBlock,
  Tools,
  Color4,
  ParticleTextureSourceBlock
} from 'babylonjs';

/**
 * Lesson 2.2: Advanced Movement and Physics
 * 
 * This lesson builds on Lesson 2.1 (Basic Forces) by combining speed control and drag effects.
 * You'll learn how to use ParticleLerpBlock to create smooth transitions and combine multiple physics effects.
 * 
 * Key concepts:
 * - ParticleLerpBlock: Linear interpolation between two values based on a gradient (0 to 1)
 * - Speed control: Particles can start fast and slow down (or vice versa)
 * - Drag effect: Simulates air resistance - particles lose speed over time
 * - Combining effects: Multiple physics effects can work together
 * - Formula: finalScale = directionScale * speedLerp * (1 - dragLerp)
 * 
 * Prerequisites: Topic 2, Lesson 1 (Basic Forces and Physics)
 */
export function createTopic3Lesson2Set(existingSet?: NodeParticleSystemSet): NodeParticleSystemSet {
  const set = existingSet || new NodeParticleSystemSet('Topic 2, Lesson 2 · Advanced Movement and Physics');
  set.clear();
  set.editorData = null;

  const systemBlock = new SystemBlock('Particle System');

  // POSITION UPDATE
  // We'll calculate position manually to have full control over movement
  const updatePosition = new UpdatePositionBlock('Update position');
  const position = new ParticleInputBlock('Position');
  position.contextualValue = NodeParticleContextualSources.Position;

  // Get direction and direction scale
  // Direction is the velocity vector (where and how fast the particle moves)
  // DirectionScale is a multiplier that determines how far the particle moves each frame
  // By modifying directionScale, we can control particle speed
  const direction = new ParticleInputBlock('Direction');
  direction.contextualValue = NodeParticleContextualSources.Direction;
  const directionScale = new ParticleInputBlock('Direction Scale');
  directionScale.contextualValue = NodeParticleContextualSources.DirectionScale;

  // Get age and lifetime for time-based physics calculations
  // We'll use age ratio to create effects that change over time
  const age = new ParticleInputBlock('Age');
  age.contextualValue = NodeParticleContextualSources.Age;
  const lifetime = new ParticleInputBlock('Lifetime');
  lifetime.contextualValue = NodeParticleContextualSources.Lifetime;

  // Calculate age ratio (0 to 1)
  // This represents how far through its life the particle is
  const ageRatio = new ParticleMathBlock('Age / Lifetime');
  ageRatio.operation = ParticleMathBlockOperations.Divide;
  age.output.connectTo(ageRatio.left);
  lifetime.output.connectTo(ageRatio.right);

  // PART 1: SPEED CONTROL USING LERP
  // ParticleLerpBlock performs linear interpolation (LERP) between two values
  // Formula: result = left + (right - left) * gradient
  // When gradient = 0: result = left (start speed)
  // When gradient = 1: result = right (end speed)
  // When gradient = 0.5: result = middle value
  // 
  // In this lesson, particles start fast (2.0) and slow down to 0.5
  // This creates a deceleration effect - particles gradually lose speed
  const startSpeed = new ParticleInputBlock('Start Speed');
  startSpeed.value = 2.0; // Fast initial speed
  const endSpeed = new ParticleInputBlock('End Speed');
  endSpeed.value = 0.5; // Slower final speed
  const speedLerp = new ParticleLerpBlock('Speed Lerp');
  startSpeed.output.connectTo(speedLerp.left);
  endSpeed.output.connectTo(speedLerp.right);
  ageRatio.output.connectTo(speedLerp.gradient); // Use age ratio as gradient (0 to 1)

  // PART 2: DRAG EFFECT
  // Drag simulates air resistance - particles lose speed over time
  // Drag value of 0 = no resistance, drag value of 1 = complete stop
  // We'll increase drag from 0 to 0.6 as particles age
  // This creates realistic physics where particles slow down due to air resistance
  const startDrag = new ParticleInputBlock('Start Drag');
  startDrag.value = 0.0; // No drag at start
  const endDrag = new ParticleInputBlock('End Drag');
  endDrag.value = 0.6; // 60% drag at end (particles lose 60% of speed)
  const dragLerp = new ParticleLerpBlock('Drag Lerp');
  startDrag.output.connectTo(dragLerp.left);
  endDrag.output.connectTo(dragLerp.right);
  ageRatio.output.connectTo(dragLerp.gradient);

  // COMBINE SPEED AND DRAG
  // We need to apply both effects together:
  // 1. Speed control: particles slow down from 2.0 to 0.5
  // 2. Drag effect: particles lose additional speed due to resistance
  //
  // Formula: finalSpeed = speedLerp * (1 - dragLerp)
  // - speedLerp: base speed transition (2.0 → 0.5)
  // - (1 - dragLerp): drag factor (1.0 → 0.4, meaning 100% → 40% of speed remains)
  // - Combined: particles start at 2.0 * 1.0 = 2.0, end at 0.5 * 0.4 = 0.2
  const one = new ParticleInputBlock('One');
  one.value = 1.0;
  const dragFactor = new ParticleMathBlock('1 - Drag');
  dragFactor.operation = ParticleMathBlockOperations.Subtract;
  one.output.connectTo(dragFactor.left);
  dragLerp.output.connectTo(dragFactor.right);

  // Apply both speed control and drag
  // This combines both effects into a single multiplier
  const combinedFactor = new ParticleMathBlock('Combined Factor');
  combinedFactor.operation = ParticleMathBlockOperations.Multiply;
  speedLerp.output.connectTo(combinedFactor.left);
  dragFactor.output.connectTo(combinedFactor.right);

  // MULTIPLY BASE DIRECTION SCALE BY COMBINED FACTOR
  // DirectionScale is the base speed multiplier
  // We multiply it by our combined factor to apply both speed control and drag
  // Result: modifiedScale = directionScale * speedLerp * (1 - dragLerp)
  const modifiedScale = new ParticleMathBlock('Modified Scale');
  modifiedScale.operation = ParticleMathBlockOperations.Multiply;
  directionScale.output.connectTo(modifiedScale.left);
  combinedFactor.output.connectTo(modifiedScale.right);

  // CALCULATE SCALED DIRECTION
  // Scaled direction = direction vector * modified scale
  // This gives us the actual movement vector for this frame
  const scaledDirection = new ParticleMathBlock('Scaled Direction');
  scaledDirection.operation = ParticleMathBlockOperations.Multiply;
  direction.output.connectTo(scaledDirection.left);
  modifiedScale.output.connectTo(scaledDirection.right);

  // ADD SCALED DIRECTION TO POSITION
  // Final position calculation: newPosition = oldPosition + movement
  const addVector = new ParticleMathBlock('Position + Direction');
  addVector.operation = ParticleMathBlockOperations.Add;
  position.output.connectTo(addVector.left);
  scaledDirection.output.connectTo(addVector.right);
  addVector.output.connectTo(updatePosition.position);

  // CREATE PARTICLE
  // Note: In this lesson, we calculate position manually, so we connect pointShape to updatePosition
  // This allows us to have full control over the movement calculation
  const createParticle = new CreateParticleBlock('Create particle');
  const initialColor06 = new ParticleInputBlock('Initial Color');
  initialColor06.value = new Color4(1, 1, 1, 1); // White
  initialColor06.output.connectTo(createParticle.color);
  const baseSize06 = new ParticleInputBlock('Base Size');
  baseSize06.value = 0.3;
  baseSize06.output.connectTo(createParticle.size);
  const pointShape = new PointShapeBlock('Point emitter');
  createParticle.particle.connectTo(pointShape.particle);
  pointShape.output.connectTo(updatePosition.particle);

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
  // Complete chain: CreateParticle → PointShape → UpdatePosition (with custom physics) → UpdateColor → UpdateSize → SystemBlock
  updateSize.output.connectTo(systemBlock.particle);

  // TEXTURE
  const texture = new ParticleTextureSourceBlock('Texture');
  texture.url = Tools.GetAssetUrl('https://assets.babylonjs.com/core/textures/flare.png');
  texture.texture.connectTo(systemBlock.texture);

  set.systemBlocks.push(systemBlock);

  return set;
}

