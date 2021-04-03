/**
 * Weapon system base class for the player actor.
 * 
 * @namespace Asteroids
 * @class Asteroids.Weapon
 */
class Weapon {

   constructor(player)
   {
      this.player = player;

      //add aab
      this.WEAPON_RECHARGE = 125;
      this.weaponRecharge = 0;

      return this;
   }
   
      WEAPON_RECHARGE = 125;
      weaponRecharge = 0;
      player= null;
      
      fire()
      {
         // now test we did not fire too recently
         if (GameHandler.frameStart - this.weaponRecharge > this.WEAPON_RECHARGE)
         {
            // ok, update last fired time and we can now generate a bullet
            this.weaponRecharge = GameHandler.frameStart;
            
            return this.doFire();
         }
      }
      
      doFire()
      {
      }
}


/**
 * Basic primary weapon for the player actor.
 * 
 * @namespace Asteroids
 * @class Asteroids.PrimaryWeapon
 */
class PrimaryWeapon extends Weapon { 
   constructor(player)
   {
      super( player);
      return this;
   }
   
      doFire()
      {
         // generate a vector rotated to the player heading and then add the current player
         // vector to give the bullet the correct directional momentum
         var t = new Vector(0.0, -4.5);
         t.rotate(this.player.heading * RAD);
         t.add(this.player.vector);
         
         return new Bullet(this.player.position.clone(), t, this.player.heading);
      }
}


/**
 * Twin Cannons primary weapon for the player actor.
 * 
 * @namespace Asteroids
 * @class Asteroids.TwinCannonsWeapon
 */
class TwinCannonsWeapon extends Weapon {
   constructor(player)
   {
      super(player);
      this.WEAPON_RECHARGE = 150;
      return this;
   };
   
      doFire()
      {
         var t = new Vector(0.0, -4.5);
         t.rotate(this.player.heading * RAD);
         t.add(this.player.vector);
         
         return new BulletX2(this.player.position.clone(), t, this.player.heading);
      }
}


/**
 * V Spray Cannons primary weapon for the player actor.
 * 
 * @namespace Asteroids
 * @class Asteroids.VSprayCannonsWeapon
 */
class VSprayCannonsWeapon extends Weapon {
  constructor(player)
   {
      super(player);
      this.WEAPON_RECHARGE = 250;
      return this;
   }
   
      doFire()
      {
         var t, h;
         
         var bullets = [];
         
         h = this.player.heading - 15;
         t = new Vector(0.0, -3.75).rotate(h * RAD).add(this.player.vector);
         bullets.push(new Bullet(this.player.position.clone(), t, h));
         
         h = this.player.heading;
         t = new Vector(0.0, -3.75).rotate(h * RAD).add(this.player.vector);
         bullets.push(new Bullet(this.player.position.clone(), t, h));
         
         h = this.player.heading + 15;
         t = new Vector(0.0, -3.75).rotate(h * RAD).add(this.player.vector);
         bullets.push(new Bullet(this.player.position.clone(), t, h));
         
         return bullets;
      }
}


/**
 * Side Guns additional primary weapon for the player actor.
 * 
 * @namespace Asteroids
 * @class Asteroids.SideGunWeapon
 */
class SideGunWeapon extends Weapon {
   constructor(player)
   {
      super(player);
      this.WEAPON_RECHARGE = 250;
      return this;
   }
   
      doFire()
      {
         var t, h;
         
         var bullets = [];
         
         h = this.player.heading - 90;
         t = new Vector(0.0, -4.5).rotate(h * RAD).add(this.player.vector);
         bullets.push(new Bullet(this.player.position.clone(), t, h, 750));
         
         h = this.player.heading + 90;
         t = new Vector(0.0, -4.5).rotate(h * RAD).add(this.player.vector);
         bullets.push(new Bullet(this.player.position.clone(), t, h, 750));
         
         return bullets;
      }
}


/**
 * Rear Gun additional primary weapon for the player actor.
 * 
 * @namespace Asteroids
 * @class Asteroids.RearGunWeapon
 */
class RearGunWeapon extends Weapon {

   constructor(player)
   {
      super(player);
      this.WEAPON_RECHARGE = 250;
      return this;
   }
   
      doFire()
      {
         var t = new Vector(0.0, -4.5);
         var h = this.player.heading + 180;
         t.rotate(h * RAD);
         t.add(this.player.vector);
         
         return new Bullet(this.player.position.clone(), t, h, 750);
      }
}


/**
 * Bullet actor class.
 *
 * @namespace Asteroids
 * @class Bullet
 */
class Bullet extends  Game.Actor { 
   constructor(p, v, h, lifespan)
   {
      super(p, v);
      this.heading = h;
      if (lifespan)
      {
         this.lifespan = lifespan;
      }
      this.bulletStart = GameHandler.frameStart;
      return this;
   }
   
      BULLET_WIDTH= 2;
      BULLET_HEIGHT= 6;
      FADE_LENGTH= 200;
      
      /**
       * Bullet heading
       */
      heading= 0;
      
      /**
       * Bullet lifespan
       */
      lifespan= 1300;
      
      /**
       * Bullet firing start time
       */
      bulletStart= 0;
      
      /**
       * Bullet power energy
       */
      powerLevel= 1;
      
      /**
       * Bullet rendering method
       * 
       * @param ctx {object} Canvas rendering context
       */
      onRender(ctx)
      {
         // hack to stop draw under player graphic
         if (GameHandler.frameStart - this.bulletStart > 40)
         {
            ctx.save();
            if (BITMAPS) ctx.globalCompositeOperation = "lighter";
            ctx.globalAlpha = this.fadeValue(1.0, this.FADE_LENGTH);
            // rotate the bullet bitmap into the correct heading
            ctx.translate(this.position.x, this.position.y);
            ctx.rotate(this.heading * RAD);
            ctx.drawImage(GameHandler.bitmaps.images["bullet"][BITMAPS?0:1],
               -(this.BULLET_WIDTH + GLOWSHADOWBLUR*2)*0.5, -(this.BULLET_HEIGHT + GLOWSHADOWBLUR*2)*0.5);
            ctx.restore();
         }
      }
      
      /**
       * Actor expiration test
       * 
       * @return true if expired and to be removed from the actor list, false if still in play
       */
      expired()
      {
         return (GameHandler.frameStart - this.bulletStart > this.lifespan);
      }
      
      /**
       * Area effect weapon radius - zero for primary bullets
       */
      effectRadius()
      {
         return 0;
      }
      
      radius()
      {
         // approximate based on average between width and height
         return (this.BULLET_HEIGHT + this.BULLET_WIDTH) * 0.5;
      }
      
      power()
      {
         return this.powerLevel;
      }
      
      /**
       * Helper to return a value multiplied by the ratio of the remaining lifespan
       * 
       * @param val     value to apply to the ratio of remaining lifespan
       * @param offset  offset at which to begin applying the ratio
       */
      fadeValue(val, offset)
      {
         var rem = this.lifespan - (GameHandler.frameStart - this.bulletStart),
             result = val;
         if (rem < offset)
         {
            result = (val / offset) * rem;
            // this is not a simple counter - so we need to crop the value
            // as the time between frames is not determinate
            if (result < 0) result = 0;
            else if (result > val) result = val;
         }
         return result;
      }
}


/**
 * Player BulletX2 actor class. Used by the TwinCannons primary weapon.
 *
 * @namespace Asteroids
 * @class BulletX2
 */
class BulletX2 extends Bullet {
   constructor(p, v, h)
   {
      super(p, v, h);
      this.lifespan = 1750;
      this.powerLevel = 2;
      return this;
   }
   
      /**
       * Bullet rendering method
       * 
       * @param ctx {object} Canvas rendering context
       */
      onRender(ctx)
      {
         // hack to stop draw under player graphic
         if (GameHandler.frameStart - this.bulletStart > 40)
         {
            ctx.save();
            if (BITMAPS) ctx.globalCompositeOperation = "lighter";
            ctx.globalAlpha = this.fadeValue(1.0, this.FADE_LENGTH);
            // rotate the bullet bitmap into the correct heading
            ctx.translate(this.position.x, this.position.y);
            ctx.rotate(this.heading * RAD);
            ctx.drawImage(GameHandler.bitmaps.images["bulletx2"][BITMAPS?0:1],
               -(this.BULLET_WIDTH + GLOWSHADOWBLUR*4)*0.5, -(this.BULLET_HEIGHT + GLOWSHADOWBLUR*2)*0.5);
            ctx.restore();
         }
      }
      
      radius()
      {
         // double width bullets - so bigger hit area than basic ones
         return (this.BULLET_HEIGHT);
      }
}


/**
 * Bomb actor class.
 *
 * @namespace Asteroids
 * @class Asteroids.Bomb
 */
class Bomb extends  Bullet {
   constructor(p, v)
   {
      super(p, v);
      this.lifespan = 3000;
      return this;
   };
   
      BOMB_RADIUS= 4;
      FADE_LENGTH= 200;
      EFFECT_RADIUS= 45;
      
      /**
       * Bomb rendering method
       * 
       * @param ctx {object} Canvas rendering context
       */
      onRender(ctx)
      {
         ctx.save();
         if (BITMAPS) ctx.globalCompositeOperation = "lighter";
         ctx.globalAlpha = this.fadeValue(1.0, this.FADE_LENGTH);
         ctx.translate(this.position.x, this.position.y);
         ctx.rotate((GameHandler.frameStart % (360*32)) / 32);
         var scale = this.fadeValue(1.0, this.FADE_LENGTH);
         if (scale <= 0) scale = 0.01;
         ctx.scale(scale, scale);
         ctx.drawImage(GameHandler.bitmaps.images["bomb"][BITMAPS?0:1],
               -(this.BOMB_RADIUS*2 + GLOWSHADOWBLUR*2)*0.5, -(this.BOMB_RADIUS*2 + GLOWSHADOWBLUR*2)*0.5);
         ctx.restore();
      }
      
      /**
       * Area effect weapon radius
       */
      effectRadius()
      {
         return this.EFFECT_RADIUS;
      }
      
      radius()
      {
         return this.fadeValue(this.BOMB_RADIUS, this.FADE_LENGTH);
      }
}


/**
 * Enemy Bullet actor class.
 *
 * @namespace Asteroids
 * @class Asteroids.EnemyBullet
 */
class EnemyBullet extends Bullet {
   constructor(p, v)
   {
      super(p, v, 0);
      this.lifespan = 2800;
      return this;
   }
   
      BULLET_RADIUS= 4;
      FADE_LENGTH= 200;
      
      /**
       * Bullet rendering method
       * 
       * @param ctx {object} Canvas rendering context
       */
      onRender(ctx)
      {
         ctx.save();
         ctx.globalAlpha = this.fadeValue(1.0, this.FADE_LENGTH);
         if (BITMAPS) ctx.globalCompositeOperation = "lighter";
         ctx.translate(this.position.x, this.position.y);
         ctx.rotate((GameHandler.frameStart % (360*64)) / 64);
         var scale = this.fadeValue(1.0, this.FADE_LENGTH);
         if (scale <= 0) scale = 0.01;
         ctx.scale(scale, scale);
         ctx.drawImage(GameHandler.bitmaps.images["enemybullet"][BITMAPS?0:1],
               -(this.BULLET_RADIUS*2 + GLOWSHADOWBLUR*2)*0.5, -(this.BULLET_RADIUS*2 + GLOWSHADOWBLUR*2)*0.5);
         ctx.restore();
      }
      
      radius()
      {
         return this.fadeValue(this.BULLET_RADIUS, this.FADE_LENGTH) + 1;
      }
}
