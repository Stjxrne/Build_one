import utils from '../node_modules/decentraland-ecs-utils/index'

//set constant
let openPos: Quaternion = Quaternion.Euler(0, 90, 0)
let closedPos: Quaternion = Quaternion.Euler(0, 0, 0)
let openSliding_door = new Vector3(6, 3.9, 7.45)
let closedSliding_door = new Vector3(9.3, 3.9, 7.45)

//set new entities
const sliding_door = new Entity()
const doorPivot = new Entity()
const door = new Entity()
const house = new Entity()
const sliding_doorParent = new Entity()
const grass = new Entity()

// Adding Component
sliding_door.addComponent(
	new Transform({
		position: new Vector3(9.3,3.9,7.45)
})
	)
house.addComponent(
	new Transform({
		position: new Vector3(9, 0, 6)
})
	)
door.addComponent(
	new Transform({
		position: new Vector3(0, 0, 0)
})
	)
doorPivot.addComponent(
	new Transform({
		position: new Vector3(5.8, 0, 8.2),
		rotation: closedPos
  })
)
sliding_doorParent.addComponent(
  new Transform({
    position: new Vector3(1, 0, 1)
  })
)
grass.addComponent(
	new Transform({
		position: new Vector3(8,0,8)
	})
)

// Adding shape to entities
house.addComponent(new GLTFShape("src/models/House.gltf"))
door.addComponent(new GLTFShape("src/models/door.gltf"))
sliding_door.addComponent(new GLTFShape("src/models/sliding_door.gltf"))
grass.addComponent(new GLTFShape("src/models/grass.gltf"))

// Adding the entities to the engine
engine.addEntity(house)
engine.addEntity(door)
engine.addEntity(doorPivot)
engine.addEntity(sliding_door)
engine.addEntity(sliding_doorParent)
engine.addEntity(grass)


//parents and children
door.setParent(doorPivot)
sliding_door.setParent(sliding_doorParent)

//toggle behavior for sliding_door
sliding_door.addComponent(
  new utils.ToggleComponent(utils.ToggleState.Off, value => {
    if (value == utils.ToggleState.On) {
      sliding_door.addComponentOrReplace(
        new utils.MoveTransformComponent(closedSliding_door, openSliding_door, 1))
    } else {
      sliding_door.addComponentOrReplace(
        new utils.MoveTransformComponent(openSliding_door, closedSliding_door, 1))
    }
  })
)

//toggle behavior for door
door.addComponent(
  new utils.ToggleComponent(utils.ToggleState.Off, value => {
    if (value == utils.ToggleState.On) {
      doorPivot.addComponentOrReplace(
        new utils.RotateTransformComponent(
          doorPivot.getComponent(Transform).rotation,
          openPos,
          0.5
        )
      )
    } else {
      doorPivot.addComponentOrReplace(
        new utils.RotateTransformComponent(
          doorPivot.getComponent(Transform).rotation,
          closedPos,
          0.5
        )
      )
    }
  })
)

// Set the click behavior for the doors
door.addComponent(
  new OnPointerDown(
    e => {
      door.getComponent(utils.ToggleComponent).toggle()
    },
    { button: ActionButton.POINTER, hoverText: 'Open/Close' }
  )
)

sliding_door.addComponent(
  new OnPointerDown(
    e => {
      sliding_door.getComponent(utils.ToggleComponent).toggle()
    },
    { button: ActionButton.POINTER, hoverText: 'Open/Close' }
  )
)