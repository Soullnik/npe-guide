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
} from '@babylonjs/core';

/**
 * Lesson 4.2: Texture Animation and Sprite Sheets
 * 
 * This lesson introduces sprite sheet animation for particles.
 * You'll learn how to use SetupSpriteSheetBlock and UpdateSpriteCellIndexBlock
 * to create animated textures that change over time.
 * 
 * Key concepts:
 * - Sprite sheets: Textures containing multiple frames of animation
 * - SetupSpriteSheetBlock: Configures the sprite sheet layout
 * - UpdateSpriteCellIndexBlock: Updates which frame to display
 * - Cell indexing: Converting age ratio to sprite cell index
 * - ParticleFloatToIntBlock: Converting float to integer for cell indices
 * 
 * Prerequisites: Topic 1, Lesson 3 (Time-Based Properties)
 */
export function createTopic4Lesson2Set(existingSet?: NodeParticleSystemSet): NodeParticleSystemSet {
  const set = existingSet || new NodeParticleSystemSet('Topic 4, Lesson 2 · Texture Animation and Sprite Sheets');
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
  const pointShape = new PointShapeBlock('Point emitter');
  createParticle.particle.connectTo(pointShape.particle);
  pointShape.output.connectTo(updatePosition.particle);

  // SETUP SPRITE SHEET
  // A sprite sheet is a texture containing multiple frames arranged in a grid
  // SetupSpriteSheetBlock configures how the sprite sheet is laid out
  const setupSpriteSheet = new SetupSpriteSheetBlock('Setup Sprite Sheet');
  
  // Cell range: which cells to use from the sprite sheet
  // start = 0: First cell index
  // end = 8: Last cell index (cells 0-8 = 9 total cells)
  setupSpriteSheet.start = 0;
  setupSpriteSheet.end = 8;
  
  // Cell dimensions: size of each cell in pixels
  // width = 64, height = 64: Each cell is 64x64 pixels
  // The sprite sheet texture should be arranged in a grid matching these dimensions
  setupSpriteSheet.width = 64;
  setupSpriteSheet.height = 64;
  
  // Loop: whether to loop the animation (true) or stop at the end (false)
  setupSpriteSheet.loop = true;
  
  // Random start cell: whether each particle starts at a random cell (true) or cell 0 (false)
  setupSpriteSheet.randomStartCell = false; // All particles start at cell 0
  
  updatePosition.output.connectTo(setupSpriteSheet.particle);

  // UPDATE SPRITE CELL INDEX
  // UpdateSpriteCellIndexBlock updates which cell (frame) to display
  // We'll calculate the cell index based on the particle's age
  const updateSpriteCell = new UpdateSpriteCellIndexBlock('Update Sprite Cell');
  setupSpriteSheet.output.connectTo(updateSpriteCell.particle);

  // CALCULATE SPRITE INDEX FROM AGE
  // We want to show different frames as the particle ages
  // When ageRatio = 0: show first frame (cell 0)
  // When ageRatio = 1: show last frame (cell 8)
  const age = new ParticleInputBlock('Age');
  age.contextualValue = NodeParticleContextualSources.Age;
  const lifetime = new ParticleInputBlock('Lifetime');
  lifetime.contextualValue = NodeParticleContextualSources.Lifetime;
  const ageRatio = new ParticleMathBlock('Age / Lifetime');
  ageRatio.operation = ParticleMathBlockOperations.Divide;
  age.output.connectTo(ageRatio.left);
  lifetime.output.connectTo(ageRatio.right);

  // MULTIPLY BY NUMBER OF CELLS
  // ageRatio is 0 to 1, but we need 0 to 8 (cell indices)
  // Multiply by cell count: ageRatio * 9 = 0 to 9 (but we'll clamp to 0-8)
  const cellCount = new ParticleInputBlock('Cell Count');
  cellCount.value = 9; // 0 to 8 = 9 cells total
  const scaledRatio = new ParticleMathBlock('Scaled Ratio');
  scaledRatio.operation = ParticleMathBlockOperations.Multiply;
  ageRatio.output.connectTo(scaledRatio.left);
  cellCount.output.connectTo(scaledRatio.right);

  // CONVERT TO INTEGER FOR CELL INDEX
  // Cell indices must be integers (0, 1, 2, ...), not floats (0.5, 1.7, ...)
  // ParticleFloatToIntBlock converts a float to an integer by truncating
  // Example: 2.7 becomes 2, 5.1 becomes 5
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

