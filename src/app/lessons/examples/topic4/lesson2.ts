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
  SetupSpriteSheetBlock,
  BasicSpriteUpdateBlock,
  Tools,
  Color4,
  ParticleTextureSourceBlock,
  Vector3
} from '@babylonjs/core';

/**
 * Lesson 4.2: Texture Animation and Sprite Sheets
 * 
 * This lesson introduces sprite sheet animation for particles.
 * You'll learn how to use SetupSpriteSheetBlock and BasicSpriteUpdateBlock
 * to create animated textures that change over time.
 * 
 * Key concepts:
 * - Sprite sheets: Textures containing multiple frames of animation
 * - SetupSpriteSheetBlock: Configures the sprite sheet layout and animation speed
 * - BasicSpriteUpdateBlock: Automatically updates sprite cells based on spriteCellChangeSpeed
 * - spriteCellChangeSpeed: Controls how fast sprites animate (frames per cell change)
 * - No manual calculation needed: BasicSpriteUpdateBlock handles everything automatically
 * 
 * Prerequisites: Topic 1, Lesson 1 (First Emission)
 */
export function createTopic4Lesson2Set(existingSet?: NodeParticleSystemSet): NodeParticleSystemSet {
  const set = existingSet || new NodeParticleSystemSet('Topic 4, Lesson 2 · Texture Animation and Sprite Sheets');
  set.clear();
  set.editorData = null;

  // SYSTEM BLOCK
  const systemBlock = new SystemBlock('particles');

  // Note: emitRate is set as a direct value in the JSON (value: 2)
  // It's not connected via a ParticleInputBlock in the simplified example

  // EMITTER POSITION
  const emitterPosition = new ParticleInputBlock('Emitter Position');
  emitterPosition.value = new Vector3(0, 0, 0);
  emitterPosition.output.connectTo(systemBlock.emitterPosition);

  // TEXTURE
  const texture = new ParticleTextureSourceBlock('Texture');
  texture.url = Tools.GetAssetUrl('https://playground.babylonjs.com/textures/player.png');
  texture.texture.connectTo(systemBlock.texture);

  // CREATE PARTICLE BLOCK - using direct values (no Random blocks)
  const createParticle = new CreateParticleBlock('Create Particle');

  // EMIT POWER - direct value: 1
  const emitPower = new ParticleInputBlock('Emit Power');
  emitPower.value = 1;
  emitPower.output.connectTo(createParticle.emitPower);

  // LIFETIME - direct value: 10
  const lifetime = new ParticleInputBlock('Lifetime');
  lifetime.value = 10;
  lifetime.output.connectTo(createParticle.lifeTime);

  // BOX SHAPE
  const boxShape = new BoxShapeBlock('Box Shape');
  createParticle.particle.connectTo(boxShape.particle);

  // Direction 1 - Vector3(-2, 0, 0)
  const direction = new ParticleInputBlock('Direction');
  direction.value = new Vector3(-2, 0, 0);
  direction.output.connectTo(boxShape.direction1);
  direction.output.connectTo(boxShape.direction2);

  // Min Emit Box - Vector3(-1, 0, -0.3)
  const minEmitBox = new ParticleInputBlock('Min Emit Box');
  minEmitBox.value = new Vector3(-1, 0, -0.3);
  minEmitBox.output.connectTo(boxShape.minEmitBox);

  // Max Emit Box - Vector3(0, 0, 0.3)
  const maxEmitBox = new ParticleInputBlock('Max Emit Box');
  maxEmitBox.value = new Vector3(0, 0, 0.3);
  maxEmitBox.output.connectTo(boxShape.maxEmitBox);

  // SETUP SPRITE SHEET
  const setupSpriteSheet = new SetupSpriteSheetBlock('Sprite Sheet Setup');
  setupSpriteSheet.start = 0;
  setupSpriteSheet.end = 9;
  setupSpriteSheet.width = 64;
  setupSpriteSheet.height = 64;
  setupSpriteSheet.spriteCellChangeSpeed = 30;
  setupSpriteSheet.loop = true;
  setupSpriteSheet.randomStartCell = false;
  boxShape.output.connectTo(setupSpriteSheet.particle);

  // UPDATE POSITION
  // In the simplified example, UpdatePosition comes after SetupSpriteSheet (no UpdateColor)
  const updatePosition = new UpdatePositionBlock('Position Update');
  setupSpriteSheet.output.connectTo(updatePosition.particle);

  // Position logic: Add Position (Position + Scaled Direction)
  const addPosition = new ParticleMathBlock('Add Position');
  addPosition.operation = ParticleMathBlockOperations.Add;
  const positionContext = new ParticleInputBlock('Position');
  positionContext.contextualValue = NodeParticleContextualSources.Position;
  const scaledDirectionContext = new ParticleInputBlock('Scaled Direction');
  scaledDirectionContext.contextualValue = NodeParticleContextualSources.ScaledDirection;
  positionContext.output.connectTo(addPosition.left);
  scaledDirectionContext.output.connectTo(addPosition.right);
  addPosition.output.connectTo(updatePosition.position);

  // BASIC SPRITE UPDATE
  const spriteUpdate = new BasicSpriteUpdateBlock('Sprite Cell Update');
  updatePosition.output.connectTo(spriteUpdate.particle);

  // Connect to system
  spriteUpdate.output.connectTo(systemBlock.particle);

  set.systemBlocks.push(systemBlock);

  return set;
}
