import { cls, createComponent, div, newEventEmitter, signal } from './core';
import { when } from './core/render';
import './style.css';

export * from './core';

const TestComponent = createComponent({
  selector: 'my-component2',
  props: {
    testProp: signal(12)
  },
  events: {
    testEvent: newEventEmitter<number>()
  }
}, (props, events) => {
  setTimeout(() => {
    events.testEvent(12)
  }, 1000);
  return div('my-component2:', () => props.testProp().toString())
});

createComponent({
  selector: 'my-component',
  props: {
    name: signal('test')
  },
  events: {
    testClick: newEventEmitter<string>()
  }
}, (props, events) => {
  console.log(props, events)
  const test = signal(false)
  setTimeout(() => {
    events.testClick('12')
    events.testClick(signal('jksdf'))
    test.set(true)
  }, 2000);
  return div(
    cls`flex ${() => props.name()}`, 'props: ', props.name, () => props.name() + 1,
    when(true, div('true-content')),
    when(test, TestComponent({
      '.testProp': 11,
      '@testEvent': (self, e) => {
        console.log('testEvent', self, e)
      }
    }, div('test-div')), div('false-content'))
  )
})

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    веб-компоненты
    <div>
      <my-component></my-component>
    </div>
  </div>
`

const el = document.querySelector('my-component')
console.log('el', el)
setTimeout(() => {
  el?.setAttribute('name', 'test2')
}, 1000);
el!.addEventListener('testClick', (e) => {
  console.log('testClick', e)
})