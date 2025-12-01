import {
  NodeParticleSystemSet,
  ConeShapeBlock,
  CreateParticleBlock,
  NodeParticleContextualSources,
  ParticleInputBlock,
  ParticleMathBlock,
  ParticleMathBlockOperations,
  SystemBlock,
  UpdatePositionBlock,
  UpdateColorBlock,
  UpdateSizeBlock,
  Tools,
  Color4,
  ParticleTextureSourceBlock
} from 'babylonjs';

/**
 * Lesson 3.1: Emitter Shapes
 * 
 * This lesson introduces different emitter shapes available in the Node Particle Editor.
 * You'll learn how to use ConeShapeBlock and understand the properties that control emitter shape.
 * 
 * Key concepts:
 * - Emitter shapes define where and how particles are created
 * - Different shapes: Box, Point, Cone, Sphere, Cylinder, Mesh
 * - Shape properties: radius, angle, ranges for variation
 * - Each shape creates particles in a different pattern
 * 
 * Prerequisites: Topic 1, Lesson 1 (First Emission)
 */
export function createTopic2Lesson1Set(existingSet?: NodeParticleSystemSet): NodeParticleSystemSet {
  const set = existingSet || new NodeParticleSystemSet('Topic 3, Lesson 1 · Emitter Shapes');
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
  const initialColor03 = new ParticleInputBlock('Initial Color');
  initialColor03.value = new Color4(1, 1, 1, 1); // White
  initialColor03.output.connectTo(createParticle.color);
  const baseSize03 = new ParticleInputBlock('Base Size');
  baseSize03.value = 0.3;
  baseSize03.output.connectTo(createParticle.size);

  // CONE SHAPE EMITTER
  // ConeShapeBlock emits particles in a cone pattern
  // This is useful for effects like fire, smoke, or directional sprays
  // 
  // Cone properties:
  // - radius: Base radius of the cone (how wide at the bottom)
  // - angle: Opening angle of the cone (how spread out the cone is)
  // - radiusRange: Random variation in radius (adds randomness to particle positions)
  // - heightRange: Random variation in height (adds randomness along the cone's height)
  const coneShape = new ConeShapeBlock('Cone emitter');
  
  // Base radius of the cone (in units)
  // Larger radius = wider cone base
  const radius = new ParticleInputBlock('Radius');
  radius.value = 2.0;
  radius.output.connectTo(coneShape.radius);
  
  // Opening angle of the cone (in radians)
  // Math.PI / 4 = 45 degrees - a moderate spread
  // Smaller angle = narrower cone (more focused)
  // Larger angle = wider cone (more spread out)
  const angle = new ParticleInputBlock('Angle');
  angle.value = Math.PI / 4; // 45 degrees
  angle.output.connectTo(coneShape.angle);
  
  // Radius range adds randomness to the base radius
  // Particles can be created anywhere within radius ± radiusRange
  // This creates variation in the cone's width
  const radiusRange = new ParticleInputBlock('Radius Range');
  radiusRange.value = 1.0;
  radiusRange.output.connectTo(coneShape.radiusRange);
  
  // Height range adds randomness along the cone's height
  // Particles can be created at different heights within the cone
  // This creates variation in the cone's length
  const heightRange = new ParticleInputBlock('Height Range');
  heightRange.value = 1.0;
  heightRange.output.connectTo(coneShape.heightRange);

  // Connect particle to cone shape
  // The cone shape will position particles within the cone volume
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

