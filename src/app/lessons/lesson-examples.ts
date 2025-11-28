import {
  BoxShapeBlock,
  SphereShapeBlock,
  ConeShapeBlock,
  CylinderShapeBlock,
  PointShapeBlock,
  CreateParticleBlock,
  NodeParticleContextualSources,
  NodeParticleSystemSources,
  NodeParticleSystemSet,
  ParticleInputBlock,
  ParticleMathBlock,
  ParticleMathBlockOperations,
  ParticleTextureSourceBlock,
  SystemBlock,
  UpdatePositionBlock,
  UpdateColorBlock,
  UpdateSizeBlock,
  UpdateScaleBlock,
  UpdateDirectionBlock,
  UpdateAttractorBlock,
  SetupSpriteSheetBlock,
  UpdateSpriteCellIndexBlock,
  ParticleConverterBlock,
  ParticleLerpBlock,
  ParticleRandomBlock,
  ParticleRandomBlockLocks,
  ParticleTrigonometryBlock,
  ParticleTrigonometryBlockOperations,
  ParticleVectorLengthBlock,
  ParticleFloatToIntBlock,
  ParticleConditionBlock,
  ParticleConditionBlockTests,
  UpdateAngleBlock,
  AlignAngleBlock,
  ParticleLocalVariableBlock,
  Tools,
  Color4,
  Vector3,
} from 'babylonjs';

export function createLesson01Set(): NodeParticleSystemSet {
  const set = new NodeParticleSystemSet('Lesson 01 · First Emission');
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
  const initialColor01 = new ParticleInputBlock('Initial Color');
  initialColor01.value = new Color4(1, 1, 1, 1); // White to match InitialColor
  initialColor01.output.connectTo(createParticle.color);
  const baseSize01 = new ParticleInputBlock('Base Size');
  baseSize01.value = 0.3;
  baseSize01.output.connectTo(createParticle.size);
  const boxShape = new BoxShapeBlock('Box emitter');
  createParticle.particle.connectTo(boxShape.particle);
  boxShape.output.connectTo(updatePosition.particle);

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

export function createLesson03Set(): NodeParticleSystemSet {
  const set = new NodeParticleSystemSet('Lesson 03 · Different Emitter Shapes');
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
  const initialColor03 = new ParticleInputBlock('Initial Color');
  initialColor03.value = new Color4(1, 1, 1, 1);
  initialColor03.output.connectTo(createParticle.color);
  const baseSize03 = new ParticleInputBlock('Base Size');
  baseSize03.value = 0.3;
  baseSize03.output.connectTo(createParticle.size);

  // Use ConeShapeBlock to demonstrate different emitter shapes
  // Cone emits particles in a cone pattern
  const coneShape = new ConeShapeBlock('Cone emitter');
  const radius = new ParticleInputBlock('Radius');
  radius.value = 2.0;
  radius.output.connectTo(coneShape.radius);
  const angle = new ParticleInputBlock('Angle');
  angle.value = Math.PI / 4; // 45 degrees
  angle.output.connectTo(coneShape.angle);
  const radiusRange = new ParticleInputBlock('Radius Range');
  radiusRange.value = 1.0;
  radiusRange.output.connectTo(coneShape.radiusRange);
  const heightRange = new ParticleInputBlock('Height Range');
  heightRange.value = 1.0;
  heightRange.output.connectTo(coneShape.heightRange);

  createParticle.particle.connectTo(coneShape.particle);
  coneShape.output.connectTo(updatePosition.particle);

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

export function createLesson04Set(): NodeParticleSystemSet {
  const set = new NodeParticleSystemSet('Lesson 04 · Basic Forces and Physics');
  set.clear();
  set.editorData = null;

  const systemBlock = new SystemBlock('Particle System');

  // Create particle
  const createParticle = new CreateParticleBlock('Create particle');
  const initialColor04 = new ParticleInputBlock('Initial Color');
  initialColor04.value = new Color4(1, 1, 1, 1); // White to match InitialColor
  initialColor04.output.connectTo(createParticle.color);
  const baseSize04 = new ParticleInputBlock('Base Size');
  baseSize04.value = 0.3;
  baseSize04.output.connectTo(createParticle.size);
  const pointShape = new PointShapeBlock('Point emitter');
  createParticle.particle.connectTo(pointShape.particle);

  // Direction update with gravity
  const updateDirection = new UpdateDirectionBlock('Update direction');
  pointShape.output.connectTo(updateDirection.particle);

  // Get current direction
  const currentDirection = new ParticleInputBlock('Direction');
  currentDirection.contextualValue = NodeParticleContextualSources.Direction;

  // Get delta time for physics calculations
  const deltaTime = new ParticleInputBlock('Delta Time');
  deltaTime.systemSource = NodeParticleSystemSources.Delta;

  // Create gravity vector (downward: 0, -9.8, 0)
  const gravityConverter = new ParticleConverterBlock('Gravity Vector');
  const gravityX = new ParticleInputBlock('Gravity X');
  gravityX.value = 0.0;
  const gravityY = new ParticleInputBlock('Gravity Y');
  gravityY.value = -9.8;
  const gravityZ = new ParticleInputBlock('Gravity Z');
  gravityZ.value = 0.0;
  gravityX.output.connectTo(gravityConverter.xIn);
  gravityY.output.connectTo(gravityConverter.yIn);
  gravityZ.output.connectTo(gravityConverter.zIn);

  // Multiply gravity by delta time
  const gravityDelta = new ParticleMathBlock('Gravity * Delta');
  gravityDelta.operation = ParticleMathBlockOperations.Multiply;
  gravityConverter.xyzOut.connectTo(gravityDelta.left);
  deltaTime.output.connectTo(gravityDelta.right);

  // Add gravity to current direction
  const addGravity = new ParticleMathBlock('Direction + Gravity');
  addGravity.operation = ParticleMathBlockOperations.Add;
  currentDirection.output.connectTo(addGravity.left);
  gravityDelta.output.connectTo(addGravity.right);
  addGravity.output.connectTo(updateDirection.direction);

  // Position update
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

export function createLesson05Set(): NodeParticleSystemSet {
  const set = new NodeParticleSystemSet('Lesson 05 · Advanced Color Management');
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
  const initialColor05 = new ParticleInputBlock('Initial Color');
  initialColor05.value = new Color4(1.0, 0.2, 0.2, 1.0); // Bright red - start color of lerp
  initialColor05.output.connectTo(createParticle.color);
  const baseSize05 = new ParticleInputBlock('Base Size');
  baseSize05.value = 0.4;
  baseSize05.output.connectTo(createParticle.size);
  const boxShape = new BoxShapeBlock('Box emitter');
  createParticle.particle.connectTo(boxShape.particle);
  boxShape.output.connectTo(updatePosition.particle);

  // Color update with gradient
  const updateColor = new UpdateColorBlock('Update color');
  updatePosition.output.connectTo(updateColor.particle);

  // Get age and lifetime for color interpolation
  const age = new ParticleInputBlock('Age');
  age.contextualValue = NodeParticleContextualSources.Age;
  const lifetime = new ParticleInputBlock('Lifetime');
  lifetime.contextualValue = NodeParticleContextualSources.Lifetime;

  // Calculate age ratio (0 to 1)
  const ageRatio = new ParticleMathBlock('Age / Lifetime');
  ageRatio.operation = ParticleMathBlockOperations.Divide;
  age.output.connectTo(ageRatio.left);
  lifetime.output.connectTo(ageRatio.right);

  // Create start color (bright red)
  const startColorConverter = new ParticleConverterBlock('Start Color');
  const startR = new ParticleInputBlock('Start R');
  startR.value = 1.0;
  const startG = new ParticleInputBlock('Start G');
  startG.value = 0.2;
  const startB = new ParticleInputBlock('Start B');
  startB.value = 0.2;
  const startA = new ParticleInputBlock('Start A');
  startA.value = 1.0;
  startR.output.connectTo(startColorConverter.xIn);
  startG.output.connectTo(startColorConverter.yIn);
  startB.output.connectTo(startColorConverter.zIn);
  startA.output.connectTo(startColorConverter.wIn);

  // Create end color (blue, fading to transparent)
  const endColorConverter = new ParticleConverterBlock('End Color');
  const endR = new ParticleInputBlock('End R');
  endR.value = 0.2;
  const endG = new ParticleInputBlock('End G');
  endG.value = 0.2;
  const endB = new ParticleInputBlock('End B');
  endB.value = 1.0;
  const endA = new ParticleInputBlock('End A');
  endA.value = 0.0;
  endR.output.connectTo(endColorConverter.xIn);
  endG.output.connectTo(endColorConverter.yIn);
  endB.output.connectTo(endColorConverter.zIn);
  endA.output.connectTo(endColorConverter.wIn);

  // Lerp between start and end color based on age ratio
  const colorLerp = new ParticleLerpBlock('Color Lerp');
  startColorConverter.colorOut.connectTo(colorLerp.left);
  endColorConverter.colorOut.connectTo(colorLerp.right);
  ageRatio.output.connectTo(colorLerp.gradient);
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

export function createLesson06Set(): NodeParticleSystemSet {
  const set = new NodeParticleSystemSet('Lesson 06 · Movement and Physics');
  set.clear();
  set.editorData = null;

  const systemBlock = new SystemBlock('Particle System');

  // Position update
  const updatePosition = new UpdatePositionBlock('Update position');
  const position = new ParticleInputBlock('Position');
  position.contextualValue = NodeParticleContextualSources.Position;

  // Get direction and direction scale
  const direction = new ParticleInputBlock('Direction');
  direction.contextualValue = NodeParticleContextualSources.Direction;
  const directionScale = new ParticleInputBlock('Direction Scale');
  directionScale.contextualValue = NodeParticleContextualSources.DirectionScale;

  // Get age and lifetime for physics calculations
  const age = new ParticleInputBlock('Age');
  age.contextualValue = NodeParticleContextualSources.Age;
  const lifetime = new ParticleInputBlock('Lifetime');
  lifetime.contextualValue = NodeParticleContextualSources.Lifetime;

  // Calculate age ratio (0 to 1)
  const ageRatio = new ParticleMathBlock('Age / Lifetime');
  ageRatio.operation = ParticleMathBlockOperations.Divide;
  age.output.connectTo(ageRatio.left);
  lifetime.output.connectTo(ageRatio.right);

  // PART 1: Speed control using LERP - particles start fast and slow down
  const startSpeed = new ParticleInputBlock('Start Speed');
  startSpeed.value = 2.0;
  const endSpeed = new ParticleInputBlock('End Speed');
  endSpeed.value = 0.5;
  const speedLerp = new ParticleLerpBlock('Speed Lerp');
  startSpeed.output.connectTo(speedLerp.left);
  endSpeed.output.connectTo(speedLerp.right);
  ageRatio.output.connectTo(speedLerp.gradient);

  // PART 2: Drag effect - particles lose speed over time
  const startDrag = new ParticleInputBlock('Start Drag');
  startDrag.value = 0.0;
  const endDrag = new ParticleInputBlock('End Drag');
  endDrag.value = 0.6;
  const dragLerp = new ParticleLerpBlock('Drag Lerp');
  startDrag.output.connectTo(dragLerp.left);
  endDrag.output.connectTo(dragLerp.right);
  ageRatio.output.connectTo(dragLerp.gradient);

  // Combine speed and drag: (1 - drag) * speed
  const one = new ParticleInputBlock('One');
  one.value = 1.0;
  const dragFactor = new ParticleMathBlock('1 - Drag');
  dragFactor.operation = ParticleMathBlockOperations.Subtract;
  one.output.connectTo(dragFactor.left);
  dragLerp.output.connectTo(dragFactor.right);

  // Apply both speed control and drag
  const combinedFactor = new ParticleMathBlock('Combined Factor');
  combinedFactor.operation = ParticleMathBlockOperations.Multiply;
  speedLerp.output.connectTo(combinedFactor.left);
  dragFactor.output.connectTo(combinedFactor.right);

  // Multiply base direction scale by combined factor
  const modifiedScale = new ParticleMathBlock('Modified Scale');
  modifiedScale.operation = ParticleMathBlockOperations.Multiply;
  directionScale.output.connectTo(modifiedScale.left);
  combinedFactor.output.connectTo(modifiedScale.right);

  // Calculate scaled direction: direction * modifiedScale
  const scaledDirection = new ParticleMathBlock('Scaled Direction');
  scaledDirection.operation = ParticleMathBlockOperations.Multiply;
  direction.output.connectTo(scaledDirection.left);
  modifiedScale.output.connectTo(scaledDirection.right);

  // Add scaled direction to position
  const addVector = new ParticleMathBlock('Position + Direction');
  addVector.operation = ParticleMathBlockOperations.Add;
  position.output.connectTo(addVector.left);
  scaledDirection.output.connectTo(addVector.right);
  addVector.output.connectTo(updatePosition.position);

  // Create particle
  const createParticle = new CreateParticleBlock('Create particle');
  const initialColor06 = new ParticleInputBlock('Initial Color');
  initialColor06.value = new Color4(1, 1, 1, 1);
  initialColor06.output.connectTo(createParticle.color);
  const baseSize06 = new ParticleInputBlock('Base Size');
  baseSize06.value = 0.3;
  baseSize06.output.connectTo(createParticle.size);
  const pointShape = new PointShapeBlock('Point emitter');
  createParticle.particle.connectTo(pointShape.particle);
  pointShape.output.connectTo(updatePosition.particle);

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

export function createLesson07Set(): NodeParticleSystemSet {
  const set = new NodeParticleSystemSet('Lesson 07 · Noise and Randomness');
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
  const initialColor07 = new ParticleInputBlock('Initial Color');
  initialColor07.value = new Color4(0.6, 0.5, 0.6, 1.0); // Average between blue and orange
  initialColor07.output.connectTo(createParticle.color);
  const avgSize07 = new ParticleInputBlock('Average Size');
  avgSize07.value = 0.4; // Average between minSize (0.2) and maxSize (0.6)
  avgSize07.output.connectTo(createParticle.size);
  const pointShape = new PointShapeBlock('Point emitter');
  createParticle.particle.connectTo(pointShape.particle);
  pointShape.output.connectTo(updatePosition.particle);

  // Random color using ParticleRandomBlock
  const updateColor = new UpdateColorBlock('Update color');
  updatePosition.output.connectTo(updateColor.particle);

  // Create random color between two colors
  const minColor = new ParticleInputBlock('Min Color');
  minColor.value = new Color4(0.2, 0.5, 1.0, 1.0); // Blue
  const maxColor = new ParticleInputBlock('Max Color');
  maxColor.value = new Color4(1.0, 0.5, 0.2, 1.0); // Orange
  const randomColor = new ParticleRandomBlock('Random Color');
  randomColor.lockMode = ParticleRandomBlockLocks.OncePerParticle; // Same color for particle lifetime
  minColor.output.connectTo(randomColor.min);
  maxColor.output.connectTo(randomColor.max);
  randomColor.output.connectTo(updateColor.color);

  // Random size using ParticleRandomBlock
  const updateSize = new UpdateSizeBlock('Update size');
  updateColor.output.connectTo(updateSize.particle);
  const minSize = new ParticleInputBlock('Min Size');
  minSize.value = 0.2;
  const maxSize = new ParticleInputBlock('Max Size');
  maxSize.value = 0.6;
  const randomSize = new ParticleRandomBlock('Random Size');
  randomSize.lockMode = ParticleRandomBlockLocks.OncePerParticle; // Same size for particle lifetime
  minSize.output.connectTo(randomSize.min);
  maxSize.output.connectTo(randomSize.max);
  randomSize.output.connectTo(updateSize.size);

  // Connect final output to system
  updateSize.output.connectTo(systemBlock.particle);

  // Texture
  const texture = new ParticleTextureSourceBlock('Texture');
  texture.url = Tools.GetAssetUrl('https://assets.babylonjs.com/core/textures/flare.png');
  texture.texture.connectTo(systemBlock.texture);

  set.systemBlocks.push(systemBlock);

  return set;
}

export function createLesson08Set(): NodeParticleSystemSet {
  const set = new NodeParticleSystemSet('Lesson 08 · Drag and Resistance');
  set.clear();
  set.editorData = null;

  const systemBlock = new SystemBlock('Particle System');

  // Position update
  const updatePosition = new UpdatePositionBlock('Update position');
  const position = new ParticleInputBlock('Position');
  position.contextualValue = NodeParticleContextualSources.Position;

  // Get direction and direction scale
  const direction = new ParticleInputBlock('Direction');
  direction.contextualValue = NodeParticleContextualSources.Direction;
  const directionScale = new ParticleInputBlock('Direction Scale');
  directionScale.contextualValue = NodeParticleContextualSources.DirectionScale;

  // Get age and lifetime for drag calculation
  const age = new ParticleInputBlock('Age');
  age.contextualValue = NodeParticleContextualSources.Age;
  const lifetime = new ParticleInputBlock('Lifetime');
  lifetime.contextualValue = NodeParticleContextualSources.Lifetime;

  // Calculate age ratio (0 to 1)
  const ageRatio = new ParticleMathBlock('Age / Lifetime');
  ageRatio.operation = ParticleMathBlockOperations.Divide;
  age.output.connectTo(ageRatio.left);
  lifetime.output.connectTo(ageRatio.right);

  // Create drag factor: start with no drag (0), increase to high drag (0.8)
  const startDrag = new ParticleInputBlock('Start Drag');
  startDrag.value = 0.0;
  const endDrag = new ParticleInputBlock('End Drag');
  endDrag.value = 0.8;
  const dragLerp = new ParticleLerpBlock('Drag Lerp');
  startDrag.output.connectTo(dragLerp.left);
  endDrag.output.connectTo(dragLerp.right);
  ageRatio.output.connectTo(dragLerp.gradient);

  // Calculate drag factor: 1.0 - drag (drag reduces speed)
  const one = new ParticleInputBlock('One');
  one.value = 1.0;
  const dragFactor = new ParticleMathBlock('1 - Drag');
  dragFactor.operation = ParticleMathBlockOperations.Subtract;
  one.output.connectTo(dragFactor.left);
  dragLerp.output.connectTo(dragFactor.right);

  // Multiply direction scale by drag factor
  const modifiedScale = new ParticleMathBlock('Modified Scale');
  modifiedScale.operation = ParticleMathBlockOperations.Multiply;
  directionScale.output.connectTo(modifiedScale.left);
  dragFactor.output.connectTo(modifiedScale.right);

  // Calculate scaled direction: direction * modifiedScale
  const scaledDirection = new ParticleMathBlock('Scaled Direction');
  scaledDirection.operation = ParticleMathBlockOperations.Multiply;
  direction.output.connectTo(scaledDirection.left);
  modifiedScale.output.connectTo(scaledDirection.right);

  // Add scaled direction to position
  const addVector = new ParticleMathBlock('Position + Direction');
  addVector.operation = ParticleMathBlockOperations.Add;
  position.output.connectTo(addVector.left);
  scaledDirection.output.connectTo(addVector.right);
  addVector.output.connectTo(updatePosition.position);

  // Create particle
  const createParticle = new CreateParticleBlock('Create particle');
  const initialColor08 = new ParticleInputBlock('Initial Color');
  initialColor08.value = new Color4(1, 1, 1, 1); // White to match InitialColor
  initialColor08.output.connectTo(createParticle.color);
  const baseSize08 = new ParticleInputBlock('Base Size');
  baseSize08.value = 0.3;
  baseSize08.output.connectTo(createParticle.size);
  const pointShape = new PointShapeBlock('Point emitter');
  createParticle.particle.connectTo(pointShape.particle);
  pointShape.output.connectTo(updatePosition.particle);

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

export function createLesson09Set(): NodeParticleSystemSet {
  const set = new NodeParticleSystemSet('Lesson 09 · Attractors');
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
  const initialColor09 = new ParticleInputBlock('Initial Color');
  initialColor09.value = new Color4(1, 1, 1, 1);
  initialColor09.output.connectTo(createParticle.color);
  const baseSize09 = new ParticleInputBlock('Base Size');
  baseSize09.value = 0.3;
  baseSize09.output.connectTo(createParticle.size);
  const pointShape = new PointShapeBlock('Point emitter');
  createParticle.particle.connectTo(pointShape.particle);
  pointShape.output.connectTo(updatePosition.particle);

  // Attractor - particles are attracted to a point in space
  const updateAttractor = new UpdateAttractorBlock('Attractor');
  updatePosition.output.connectTo(updateAttractor.particle);

  // Create attractor position (center point)
  const attractorConverter = new ParticleConverterBlock('Attractor Position');
  const attractorX = new ParticleInputBlock('Attractor X');
  attractorX.value = 0.0;
  const attractorY = new ParticleInputBlock('Attractor Y');
  attractorY.value = 0.0;
  const attractorZ = new ParticleInputBlock('Attractor Z');
  attractorZ.value = 0.0;
  attractorX.output.connectTo(attractorConverter.xIn);
  attractorY.output.connectTo(attractorConverter.yIn);
  attractorZ.output.connectTo(attractorConverter.zIn);
  attractorConverter.xyzOut.connectTo(updateAttractor.attractor);

  // Attractor strength
  const attractorStrength = new ParticleInputBlock('Attractor Strength');
  attractorStrength.value = 5.0;
  attractorStrength.output.connectTo(updateAttractor.strength);

  // Color update
  const updateColor = new UpdateColorBlock('Update color');
  updateAttractor.output.connectTo(updateColor.particle);
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

export function createLesson10Set(): NodeParticleSystemSet {
  const set = new NodeParticleSystemSet('Lesson 10 · Advanced Math Operations');
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
  const initialColor10 = new ParticleInputBlock('Initial Color');
  initialColor10.value = new Color4(1, 1, 1, 1);
  initialColor10.output.connectTo(createParticle.color);
  const baseSize10 = new ParticleInputBlock('Base Size');
  baseSize10.value = 0.3;
  baseSize10.output.connectTo(createParticle.size);
  const pointShape = new PointShapeBlock('Point emitter');
  createParticle.particle.connectTo(pointShape.particle);
  pointShape.output.connectTo(updatePosition.particle);

  // Color update with trigonometric functions
  const updateColor = new UpdateColorBlock('Update color');
  updatePosition.output.connectTo(updateColor.particle);

  // Get system time for animation
  const time = new ParticleInputBlock('Time');
  time.systemSource = NodeParticleSystemSources.Time;

  // Scale time for different frequencies
  const timeScale = new ParticleInputBlock('Time Scale');
  timeScale.value = 0.5;
  const scaledTime = new ParticleMathBlock('Scaled Time');
  scaledTime.operation = ParticleMathBlockOperations.Multiply;
  time.output.connectTo(scaledTime.left);
  timeScale.output.connectTo(scaledTime.right);

  // Use multiple trigonometric functions
  // Sin wave for red component
  const sinTime = new ParticleTrigonometryBlock('Sin Time');
  sinTime.operation = ParticleTrigonometryBlockOperations.Sin;
  scaledTime.output.connectTo(sinTime.input);

  // Cos wave for green component (offset by phase)
  const cosTime = new ParticleTrigonometryBlock('Cos Time');
  cosTime.operation = ParticleTrigonometryBlockOperations.Cos;
  scaledTime.output.connectTo(cosTime.input);

  // Sqrt for blue component (smooth curve)
  const sqrtTime = new ParticleTrigonometryBlock('Sqrt Time');
  sqrtTime.operation = ParticleTrigonometryBlockOperations.Sqrt;
  const absTime = new ParticleTrigonometryBlock('Abs Time');
  absTime.operation = ParticleTrigonometryBlockOperations.Abs;
  scaledTime.output.connectTo(absTime.input);
  absTime.output.connectTo(sqrtTime.input);

  // Normalize all values to 0-1 range
  const one = new ParticleInputBlock('One');
  one.value = 1.0;
  const half = new ParticleInputBlock('Half');
  half.value = 0.5;

  // Sin: (sin + 1) / 2 -> 0 to 1
  const sinNormalized = new ParticleMathBlock('Sin Normalized');
  sinNormalized.operation = ParticleMathBlockOperations.Add;
  sinTime.output.connectTo(sinNormalized.left);
  one.output.connectTo(sinNormalized.right);
  const sinScaled = new ParticleMathBlock('Sin Scaled');
  sinScaled.operation = ParticleMathBlockOperations.Multiply;
  sinNormalized.output.connectTo(sinScaled.left);
  half.output.connectTo(sinScaled.right);

  // Cos: (cos + 1) / 2 -> 0 to 1
  const cosNormalized = new ParticleMathBlock('Cos Normalized');
  cosNormalized.operation = ParticleMathBlockOperations.Add;
  cosTime.output.connectTo(cosNormalized.left);
  one.output.connectTo(cosNormalized.right);
  const cosScaled = new ParticleMathBlock('Cos Scaled');
  cosScaled.operation = ParticleMathBlockOperations.Multiply;
  cosNormalized.output.connectTo(cosScaled.left);
  half.output.connectTo(cosScaled.right);

  // Sqrt: clamp and scale
  const sqrtClamped = new ParticleMathBlock('Sqrt Clamped');
  sqrtClamped.operation = ParticleMathBlockOperations.Multiply;
  sqrtTime.output.connectTo(sqrtClamped.left);
  const sqrtFactor = new ParticleInputBlock('Sqrt Factor');
  sqrtFactor.value = 0.3;
  sqrtFactor.output.connectTo(sqrtClamped.right);

  // Create color using multiple math functions
  const colorConverter = new ParticleConverterBlock('Animated Color');
  sinScaled.output.connectTo(colorConverter.xIn); // Red: sine wave
  cosScaled.output.connectTo(colorConverter.yIn); // Green: cosine wave
  sqrtClamped.output.connectTo(colorConverter.zIn); // Blue: square root curve
  one.output.connectTo(colorConverter.wIn); // Alpha: 1.0
  colorConverter.colorOut.connectTo(updateColor.color);

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

export function createLesson10SetNew(): NodeParticleSystemSet {
  const set = new NodeParticleSystemSet('Lesson 10 · Texture Animation and Sprite Sheets');
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
  const initialColor11 = new ParticleInputBlock('Initial Color');
  initialColor11.value = new Color4(1, 1, 1, 1);
  initialColor11.output.connectTo(createParticle.color);
  const baseSize11 = new ParticleInputBlock('Base Size');
  baseSize11.value = 0.3;
  baseSize11.output.connectTo(createParticle.size);
  const pointShape = new PointShapeBlock('Point emitter');
  createParticle.particle.connectTo(pointShape.particle);
  pointShape.output.connectTo(updatePosition.particle);

  // Setup sprite sheet
  const setupSpriteSheet = new SetupSpriteSheetBlock('Setup Sprite Sheet');
  setupSpriteSheet.start = 0;
  setupSpriteSheet.end = 8;
  setupSpriteSheet.width = 64;
  setupSpriteSheet.height = 64;
  setupSpriteSheet.loop = true;
  setupSpriteSheet.randomStartCell = false;
  updatePosition.output.connectTo(setupSpriteSheet.particle);

  // Update sprite cell index based on age
  const updateSpriteCell = new UpdateSpriteCellIndexBlock('Update Sprite Cell');
  setupSpriteSheet.output.connectTo(updateSpriteCell.particle);

  // Calculate sprite index from age (0 to end cell)
  const age = new ParticleInputBlock('Age');
  age.contextualValue = NodeParticleContextualSources.Age;
  const lifetime = new ParticleInputBlock('Lifetime');
  lifetime.contextualValue = NodeParticleContextualSources.Lifetime;
  const ageRatio = new ParticleMathBlock('Age / Lifetime');
  ageRatio.operation = ParticleMathBlockOperations.Divide;
  age.output.connectTo(ageRatio.left);
  lifetime.output.connectTo(ageRatio.right);

  // Multiply by number of cells (end - start + 1)
  const cellCount = new ParticleInputBlock('Cell Count');
  cellCount.value = 9; // 0 to 8 = 9 cells
  const scaledRatio = new ParticleMathBlock('Scaled Ratio');
  scaledRatio.operation = ParticleMathBlockOperations.Multiply;
  ageRatio.output.connectTo(scaledRatio.left);
  cellCount.output.connectTo(scaledRatio.right);

  // Convert to integer for cell index
  const floatToInt = new ParticleFloatToIntBlock('Cell Index');
  scaledRatio.output.connectTo(floatToInt.input);
  floatToInt.output.connectTo(updateSpriteCell.cellIndex);

  // Color update
  const updateColor = new UpdateColorBlock('Update color');
  updateSpriteCell.output.connectTo(updateColor.particle);
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

  // Texture - using a sprite sheet texture
  const texture = new ParticleTextureSourceBlock('Texture');
  texture.url = Tools.GetAssetUrl('https://playground.babylonjs.com/textures/player.png');
  texture.texture.connectTo(systemBlock.texture);

  set.systemBlocks.push(systemBlock);

  return set;
}

export function createLesson11Set(): NodeParticleSystemSet {
  const set = new NodeParticleSystemSet('Lesson 11 · Conditional Logic');
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
  const initialColor11 = new ParticleInputBlock('Initial Color');
  initialColor11.value = new Color4(1, 1, 1, 1);
  initialColor11.output.connectTo(createParticle.color);
  const baseSize11 = new ParticleInputBlock('Base Size');
  baseSize11.value = 0.3;
  baseSize11.output.connectTo(createParticle.size);
  const pointShape = new PointShapeBlock('Point emitter');
  createParticle.particle.connectTo(pointShape.particle);
  pointShape.output.connectTo(updatePosition.particle);

  // Get age and lifetime for conditional logic
  const age = new ParticleInputBlock('Age');
  age.contextualValue = NodeParticleContextualSources.Age;
  const lifetime = new ParticleInputBlock('Lifetime');
  lifetime.contextualValue = NodeParticleContextualSources.Lifetime;
  const ageRatio = new ParticleMathBlock('Age / Lifetime');
  ageRatio.operation = ParticleMathBlockOperations.Divide;
  age.output.connectTo(ageRatio.left);
  lifetime.output.connectTo(ageRatio.right);

  // Conditional logic: if ageRatio > 0.5, use one color, else use another
  const threshold = new ParticleInputBlock('Threshold');
  threshold.value = 0.5;
  const condition = new ParticleConditionBlock('Age > Threshold');
  condition.test = ParticleConditionBlockTests.GreaterThan;
  ageRatio.output.connectTo(condition.left);
  threshold.output.connectTo(condition.right);

  // Create two colors
  const color1 = new ParticleInputBlock('Color 1');
  color1.value = new Color4(1, 0, 0, 1); // Red
  const color2 = new ParticleInputBlock('Color 2');
  color2.value = new Color4(0, 0, 1, 1); // Blue

  // Use condition to select color: if condition is true, use color1, else use color2
  color1.output.connectTo(condition.ifTrue);
  color2.output.connectTo(condition.ifFalse);

  // Color update
  const updateColor = new UpdateColorBlock('Update color');
  updatePosition.output.connectTo(updateColor.particle);
  condition.output.connectTo(updateColor.color);

  // Size update - also use conditional logic
  const updateSize = new UpdateSizeBlock('Update size');
  updateColor.output.connectTo(updateSize.particle);
  const baseSize = new ParticleInputBlock('Base Size');
  baseSize.value = 0.3;
  const largeSize = new ParticleInputBlock('Large Size');
  largeSize.value = 0.6;
  const sizeCondition = new ParticleConditionBlock('Size Condition');
  sizeCondition.test = ParticleConditionBlockTests.GreaterThan;
  ageRatio.output.connectTo(sizeCondition.left);
  threshold.output.connectTo(sizeCondition.right);
  largeSize.output.connectTo(sizeCondition.ifTrue);
  baseSize.output.connectTo(sizeCondition.ifFalse);
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

export function createLesson12Set(): NodeParticleSystemSet {
  const set = new NodeParticleSystemSet('Lesson 12 · Angle and Rotation');
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
  const initialColor12 = new ParticleInputBlock('Initial Color');
  initialColor12.value = new Color4(1, 1, 1, 1);
  initialColor12.output.connectTo(createParticle.color);
  const baseSize12 = new ParticleInputBlock('Base Size');
  baseSize12.value = 0.3;
  baseSize12.output.connectTo(createParticle.size);
  const pointShape = new PointShapeBlock('Point emitter');
  createParticle.particle.connectTo(pointShape.particle);
  pointShape.output.connectTo(updatePosition.particle);

  // Get system time for rotation animation
  const time = new ParticleInputBlock('Time');
  time.systemSource = NodeParticleSystemSources.Time;

  // Calculate rotation angle based on time
  const rotationSpeed = new ParticleInputBlock('Rotation Speed');
  rotationSpeed.value = 2.0; // Rotations per second
  const rotationAngle = new ParticleMathBlock('Rotation Angle');
  rotationAngle.operation = ParticleMathBlockOperations.Multiply;
  time.output.connectTo(rotationAngle.left);
  rotationSpeed.output.connectTo(rotationAngle.right);

  // Update angle with time-based rotation
  const updateAngle = new UpdateAngleBlock('Update Angle');
  updatePosition.output.connectTo(updateAngle.particle);
  rotationAngle.output.connectTo(updateAngle.angle);

  // Align angle to direction (optional - can be used instead of or in addition to UpdateAngleBlock)
  // const alignAngle = new AlignAngleBlock('Align Angle');
  // updateAngle.output.connectTo(alignAngle.particle);

  // Color update
  const updateColor = new UpdateColorBlock('Update color');
  updateAngle.output.connectTo(updateColor.particle);
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
