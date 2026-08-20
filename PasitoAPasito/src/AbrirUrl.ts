import * as ecs from '@8thwall/ecs'

ecs.registerComponent({
  name: 'abrir-url',
  schema: {
    url: ecs.string,
  },
  stateMachine: ({world, eid, schemaAttribute}) => {
    ecs.defineState('default')
      .initial()
      .listen(eid, ecs.input.UI_CLICK, () => {
        const schema = schemaAttribute.cursor(eid)
        if (schema.url) {
          window.open(schema.url, '_blank')
        } else {
          console.warn('abrir-url: no se definió una URL en el inspector')
        }
      })
  },
})