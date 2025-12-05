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
  ParticleConditionBlock,
  ParticleConditionBlockTests,
  Tools,
  Color4,
  ParticleTextureSourceBlock
} from '@babylonjs/core';

/**
 * Lesson 5.2: Conditional Logic
 * 
 * This lesson introduces ParticleConditionBlock for conditional logic in particle systems.
 * You'll learn how to use if-else logic to create effects that change based on conditions,
 * such as particle age, position, or other properties.
 * 
 * Key concepts:
 * - ParticleConditionBlock: Performs conditional tests (greater than, less than, equal, etc.)
 * - Conditional selection: Choose between two values based on a condition
 * - Multiple conditions: Using different conditions for different properties
 * - Threshold values: Setting breakpoints for conditional behavior
 * 
 * Prerequisites: Topic 1, Lesson 3 (Time-Based Properties)
 */
export function createTopic5Lesson2Set(existingSet?: NodeParticleSystemSet): NodeParticleSystemSet {
  const set = existingSet || new NodeParticleSystemSet('Topic 5, Lesson 2 · Conditional Logic');
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
  const initialColor11 = new ParticleInputBlock('Initial Color');
  initialColor11.value = new Color4(1, 1, 1, 1); // White
  initialColor11.output.connectTo(createParticle.color);
  const baseSize11 = new ParticleInputBlock('Base Size');
  baseSize11.value = 0.3;
  baseSize11.output.connectTo(createParticle.size);
  const boxShape = new BoxShapeBlock('Box emitter');
  createParticle.particle.connectTo(boxShape.particle);
  boxShape.output.connectTo(updatePosition.particle);

  // GET AGE AND LIFETIME FOR CONDITIONAL LOGIC
  // We'll use age ratio to create conditions based on particle age
  const age = new ParticleInputBlock('Age');
  age.contextualValue = NodeParticleContextualSources.Age;
  const lifetime = new ParticleInputBlock('Lifetime');
  lifetime.contextualValue = NodeParticleContextualSources.Lifetime;
  const ageRatio = new ParticleMathBlock('Age / Lifetime');
  ageRatio.operation = ParticleMathBlockOperations.Divide;
  age.output.connectTo(ageRatio.left);
  lifetime.output.connectTo(ageRatio.right);

  // CONDITIONAL LOGIC FOR COLOR
  // ParticleConditionBlock performs a test and returns one of two values based on the result
  // This is like an if-else statement: if (condition) then value1 else value2
  //
  // In this lesson: if ageRatio > 0.5, use red color, else use blue color
  // This creates particles that change color halfway through their lifetime
  const threshold = new ParticleInputBlock('Threshold');
  threshold.value = 0.5; // 50% through particle's life
  
  // Create the condition block
  // Test: GreaterThan - checks if left value > right value
  // Other tests available: LessThan, Equal, NotEqual, etc.
  const condition = new ParticleConditionBlock('Age > Threshold');
  condition.test = ParticleConditionBlockTests.GreaterThan;
  ageRatio.output.connectTo(condition.left); // Value to test
  threshold.output.connectTo(condition.right); // Value to compare against

  // CREATE TWO COLORS
  // We'll choose between these two colors based on the condition
  const color1 = new ParticleInputBlock('Color 1');
  color1.value = new Color4(1, 0, 0, 1); // Red - used when condition is true
  const color2 = new ParticleInputBlock('Color 2');
  color2.value = new Color4(0, 0, 1, 1); // Blue - used when condition is false

  // CONNECT COLORS TO CONDITION
  // ifTrue: Value returned when condition is true (ageRatio > 0.5)
  // ifFalse: Value returned when condition is false (ageRatio <= 0.5)
  color1.output.connectTo(condition.ifTrue); // Red when old
  color2.output.connectTo(condition.ifFalse); // Blue when young

  // COLOR UPDATE
  // The condition block's output is the selected color (red or blue)
  const updateColor = new UpdateColorBlock('Update color');
  updatePosition.output.connectTo(updateColor.particle);
  condition.output.connectTo(updateColor.color);

  // SIZE UPDATE - ALSO USE CONDITIONAL LOGIC
  // We can use the same condition or a different one for size
  // In this case, we'll use the same condition: large size when old, small size when young
  const updateSize = new UpdateSizeBlock('Update size');
  updateColor.output.connectTo(updateSize.particle);
  
  const baseSize = new ParticleInputBlock('Base Size');
  baseSize.value = 0.3; // Small size
  const largeSize = new ParticleInputBlock('Large Size');
  largeSize.value = 0.6; // Large size
  
  // Create a separate condition block for size
  // This allows us to use different thresholds or tests if needed
  const sizeCondition = new ParticleConditionBlock('Size Condition');
  sizeCondition.test = ParticleConditionBlockTests.GreaterThan;
  ageRatio.output.connectTo(sizeCondition.left);
  threshold.output.connectTo(sizeCondition.right);
  
  largeSize.output.connectTo(sizeCondition.ifTrue); // Large when old
  baseSize.output.connectTo(sizeCondition.ifFalse); // Small when young
  sizeCondition.output.connectTo(updateSize.size);

  // Connect final output to system
  updateSize.output.connectTo(systemBlock.particle);

  // Texture
  const texture = new ParticleTextureSourceBlock('Texture');
  texture.url = Tools.GetAssetUrl('https://assets.babylonjs.com/core/textures/flare.png');
  texture.texture.connectTo(systemBlock.texture);

  set.systemBlocks.push(systemBlock);

  return set;
}

