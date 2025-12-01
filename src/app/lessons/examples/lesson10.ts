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
  SetupSpriteSheetBlock,
  UpdateSpriteCellIndexBlock,
  ParticleFloatToIntBlock,
  Tools,
  Color4,
  ParticleTextureSourceBlock
} from 'babylonjs';

export function createLesson10Set(): NodeParticleSystemSet {
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

