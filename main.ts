namespace SpriteKind {
    export const Block = SpriteKind.create()
    export const BuildingAim = SpriteKind.create()
}

// --- Tile Textures ---
const skyTile = img`
    6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6
    6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6
    6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6
    6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6
    6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6
    6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6
    6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6
    6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6
    6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6
    6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6
    6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6
    6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6
    6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6
    6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6
    6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6
    6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6
`

const grassTile = img`
    7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7
    7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7
    7 e 7 7 e 7 7 7 e 7 7 e 7 7 7 7
    e e e e e e e e e e e e e e e e
    e e e f e e e e e e e e e f e e
    e e e e e e e e e f e e e e e e
    e e e e e e f e e e e e e e e e
    e f e e e e e e e e e e e e e e
    e e e e e e e e e e f e e e e e
    e e e e f e e e e e e e e e e e
    e e e e e e e e e e e e f e e e
    e e e e e e e f e e e e e e e e
    e e f e e e e e e e e e e e e e
    e e e e e e e e e e f e e e e e
    e e e e e f e e e e e e e e f e
    e e e e e e e e e e e e e e e e
`

const dirtTile = img`
    e e e e e e e e e e e e e e e e
    e e f e e e e e e e f e e e e e
    e e e e e e f e e e e e e e e e
    e e e e e e e e e e e e e f e e
    e f e e e e e e e f e e e e e e
    e e e e e f e e e e e e e e e e
    e e e e e e e e e e e f e e e e
    e e e f e e e e e e e e e e f e
    e e e e e e e e f e e e e e e e
    e e e e e e e e e e e e f e e e
    e f e e e e f e e e e e e e e e
    e e e e e e e e e e f e e e e e
    e e e e f e e e e e e e e e e e
    e e e e e e e e e e e e f e e e
    e e f e e e e e f e e e e e e e
    e e e e e e e e e e e e e f e e
`

const stoneTile = img`
    b b b c b b b b b c b b b b b b
    b c c c b b b b c c b b b c c b
    b b b b b b c b b b b b c c b b
    c c b b b c c b b b b b b b b b
    b b b b b b b b b c c b b b c c
    b b c c b b b b c c b b b b b b
    b b b b b b b b b b b b c c b b
    b b b b c c b b b b b b b b b b
    c c b b b b b b b c c b b b b c
    b b b b b c c b b b b b b c c b
    b b c c b b b b b b b b b b b b
    b b b b b b b c c b b b c c b b
    b b b c c b b b b b b b b b b b
    c c b b b b b b b c c b b b c c
    b b b b b c c b b b b b b b b b
    b b b b b b b b b b c c b b b b
`

// --- Create 32x16 Tilemap Purely in Code ---
const WORLD_COLS = 32
const WORLD_ROWS = 16
let mapData = Buffer.create(4 + WORLD_COLS * WORLD_ROWS)
mapData.setNumber(NumberFormat.UInt16LE, 0, WORLD_COLS)
mapData.setNumber(NumberFormat.UInt16LE, 2, WORLD_ROWS)

scene.setBackgroundColor(6)
tiles.setTilemap(tiles.createTilemap(
    mapData,
    image.create(WORLD_COLS, WORLD_ROWS),
    [skyTile, grassTile, dirtTile, stoneTile],
    TileScale.Sixteen
))

function generateWorld() {
    for (let col = 0; col < WORLD_COLS; col++) {
        let surfaceRow = 9 + Math.floor(Math.sin(col * 0.4) * 1.5)
        for (let row = 0; row < WORLD_ROWS; row++) {
            let loc = tiles.getTileLocation(col, row)
            if (row < surfaceRow) {
                tiles.setTileAt(loc, skyTile)
                tiles.setWallAt(loc, false)
            } else if (row == surfaceRow) {
                tiles.setTileAt(loc, grassTile)
                tiles.setWallAt(loc, true)
            } else if (row < surfaceRow + 3) {
                tiles.setTileAt(loc, dirtTile)
                tiles.setWallAt(loc, true)
            } else {
                tiles.setTileAt(loc, stoneTile)
                tiles.setWallAt(loc, true)
            }
        }
    }
}

// --- Player Setup ---
let Steve = sprites.create(img`
    ....eeeeeeee....
    ....eeeeeeee....
    ....edddddde....
    ....d18dd81d....
    ....d1fddf1d....
    ....dddddddd....
    ....dddddddd....
    ....dddddddd....
    999999bbbb999999
    9999999bb9999999
    9999999999999999
    9999999999999999
    dddd99999999dddd
    dddd99999999dddd
    dddd99999999dddd
    dddd99999999dddd
    dddd99999999dddd
    dddd99999999dddd
    dddd88888999dddd
    dddd88888899dddd
    ....88888888....
    ....88888888....
    ....88888888....
    ....88888888....
    ....88888888....
    ....88888888....
    ....88888888....
    ....88888888....
    ....88888888....
    ....88888888....
    ....ffffffff....
    ....ffffffff....
`, SpriteKind.Player)

Steve.ay = 350
controller.moveSprite(Steve, 80, 0)
scene.cameraFollowSprite(Steve)
info.setScore(5)

let BuildingMode = false
let BuildingAim: Sprite = null
let FacingRight = true

// --- Controls ---
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    if (!BuildingMode && Steve.isHittingTile(CollisionDirection.Bottom)) {
        Steve.vy = -165
    }
})

controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    FacingRight = false
})

controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    FacingRight = true
})

controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (!BuildingMode) {
        if (info.score() <= 0) {
            game.showLongText("No blocks in inventory!", DialogLayout.Bottom)
            return
        }
        BuildingMode = true
        controller.moveSprite(Steve, 0, 0)
        BuildingAim = sprites.create(img`
            . . . . . . . 2 . . . . . . .
            . . . . 2 2 2 2 2 2 2 . . . .
            . . . 2 . . . 2 . . . 2 . . .
            . . 2 . . . . 2 . . . . 2 . .
            . 2 . . . . . 2 . . . . . 2 .
            . 2 . . . . . 2 . . . . . 2 .
            . 2 . . . . . 2 . . . . . 2 .
            2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
            . 2 . . . . . 2 . . . . . 2 .
            . 2 . . . . . 2 . . . . . 2 .
            . 2 . . . . . 2 . . . . . 2 .
            . . 2 . . . . 2 . . . . 2 . .
            . . . 2 . . . 2 . . . 2 . . .
            . . . . 2 2 2 2 2 2 2 . . . .
            . . . . . . . 2 . . . . . . .
        `, SpriteKind.BuildingAim)
        BuildingAim.setPosition(Steve.x + (FacingRight ? 16 : -16), Steve.y)
        controller.moveSprite(BuildingAim, 80, 80)
        scene.cameraFollowSprite(BuildingAim)
    } else {
        let targetLoc = BuildingAim.tilemapLocation()
        if (!tiles.tileAtLocationIsWall(targetLoc)) {
            tiles.setTileAt(targetLoc, dirtTile)
            tiles.setWallAt(targetLoc, true)
            info.changeScoreBy(-1)
        }
        sprites.destroy(BuildingAim)
        BuildingMode = false
        controller.moveSprite(Steve, 80, 0)
        scene.cameraFollowSprite(Steve)
    }
})

// --- Mining & Pickups ---
function mineTile(sprite: Sprite, location: tiles.Location) {
    tiles.setWallAt(location, false)
    tiles.setTileAt(location, skyTile)
    sprites.destroy(sprite, effects.spray, 200)
    let drop = sprites.create(img`
        e e e e e e e e
        e f e e e f e e
        e e e f e e e e
        e e e e e e f e
        e f e e e e e e
        e e e e f e e e
        e e f e e e e e
        e e e e e e f e
    `, SpriteKind.Block)
    tiles.placeOnTile(drop, location)
    drop.follow(Steve, 90)
}

scene.onOverlapTile(SpriteKind.Projectile, grassTile, mineTile)
scene.onOverlapTile(SpriteKind.Projectile, dirtTile, mineTile)
scene.onOverlapTile(SpriteKind.Projectile, stoneTile, mineTile)

sprites.onOverlap(SpriteKind.Block, SpriteKind.Player, function (sprite, otherSprite) {
    sprites.destroy(sprite)
    info.changeScoreBy(1)
})

// --- Pickaxe Swing (Hold B) ---
forever(function () {
    if (controller.B.isPressed() && !BuildingMode) {
        let vx = 0
        let vy = 0
        if (controller.left.isPressed()) vx = -40
        else if (controller.right.isPressed()) vx = 40
        if (controller.up.isPressed()) vy = -40
        else if (controller.down.isPressed()) vy = 40

        if (vx == 0 && vy == 0) {
            vx = FacingRight ? 40 : -40
        }

        let pickaxe = sprites.createProjectileFromSprite(img`
            . c c c c c .
            c c c c c c c
            c c . e . c c
            . . . e . . .
            . . . e . . .
            . . . e . . .
            . . . e . . .
        `, Steve, vx, vy)
        pickaxe.setFlag(SpriteFlag.GhostThroughWalls, true)
        pickaxe.lifespan = 220
    }
    pause(250)
})

generateWorld()
tiles.placeOnTile(Steve, tiles.getTileLocation(4, 5))
