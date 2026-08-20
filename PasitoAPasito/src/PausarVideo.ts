import * as ecs from "@8thwall/ecs"

ecs.registerComponent({
  name: "pausar-video",
  schema: {
    videoEntity: ecs.eid,
    modelEntity: ecs.eid,
    backgroundEntity: ecs.eid,
    isPlaying: ecs.boolean,
  },
  schemaDefaults: {
    isPlaying: true,
  },
  stateMachine: ({world, eid, schemaAttribute}) => {
    const {videoEntity, modelEntity, backgroundEntity} = schemaAttribute.get(eid)

    const toggle = () => {
      const {isPlaying} = schemaAttribute.get(eid)
      const nextIsPlaying = !isPlaying

      schemaAttribute.set(eid, {isPlaying: nextIsPlaying})

      if (videoEntity) {
        ecs.VideoControls.mutate(world, videoEntity, (cursor) => {
          cursor.paused = !nextIsPlaying
          return false
        })
      }

      if (modelEntity) {
        ecs.GltfModel.mutate(world, modelEntity, (cursor) => {
          cursor.animationClip = nextIsPlaying ? "Dance" : "Idle"
          cursor.paused = false
          cursor.crossFadeDuration = 0.3
          return false
        })
      }
    }

    const state = ecs.defineState("initial-state").initial()

    if (modelEntity) {
      state.listen(modelEntity, ecs.input.SCREEN_TOUCH_START, toggle)
    }
    if (backgroundEntity) {
      state.listen(backgroundEntity, ecs.input.SCREEN_TOUCH_START, toggle)
    }
  }
})