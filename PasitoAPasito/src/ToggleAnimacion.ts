import * as ecs from '@8thwall/ecs'

ecs.registerComponent({
  name: 'toggle-animation',
  schema: {
    idleClip: ecs.string,   // Nombre exacto del clip IDLE
    danceClip: ecs.string,  // Nombre exacto del clip Salsa
  },
  schemaDefaults: {
    idleClip: 'IDLE',
    danceClip: 'SATSA',
  },
  data: {
    isDancing: ecs.boolean,
  },
  stateMachine: ({world, eid, schemaAttribute, dataAttribute}) => {
    ecs.defineState('default')
      .initial()
      .onEnter(() => {
        const data = dataAttribute.cursor(eid)
        data.isDancing = true // Empieza en Salsa
      })
      .listen(eid, ecs.input.SCREEN_TOUCH_START, () => {
        const schema = schemaAttribute.cursor(eid)
        const data = dataAttribute.cursor(eid)

        data.isDancing = !data.isDancing
        const clip = data.isDancing ? schema.danceClip : schema.idleClip

        ecs.GltfModel.mutate(world, eid, (cursor) => {
          cursor.animationClip = clip
          cursor.loop = true
          cursor.paused = false
          return false
        })
      })
  },
})