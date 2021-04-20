import React from 'react'
import ReactDOM from 'react-dom'
import {Accordion as BaseAccordion} from './base-accordion'
import {
  AccordionButton,
  AccordionItem,
  AccordionContents,
  single,
  preventClose,
  combineReducers,
  TabButton,
  TabItem,
  TabItems,
  TabButtons,
} from './shared'

function Accordion({items, ...props}) {
  return (
    <BaseAccordion {...props}>
      {({openIndexes, handleItemClick}) => (
        <div>
          {items.map((item, index) => (
            <AccordionItem key={item.title} direction="vertical">
              <AccordionButton
                isOpen={openIndexes.includes(index)}
                onClick={() => handleItemClick(index)}
              >
                {item.title}{' '}
                <span>{openIndexes.includes(index) ? '👇' : '👈'}</span>
              </AccordionButton>
              <AccordionContents isOpen={openIndexes.includes(index)}>
                {item.contents}
              </AccordionContents>
            </AccordionItem>
          ))}
        </div>
      )}
    </BaseAccordion>
  )
}

function BaseTabs({stateReducer = (state, changes) => changes, ...props}) {
  return (
    <BaseAccordion
      stateReducer={combineReducers(single, preventClose, stateReducer)}
      {...props}
    />
  )
}

function Tabs({items}) {
  return (
    <BaseTabs>
      {({openIndexes, handleItemClick}) => (
        <div>
          <TabItems>
            {items.map((item, index) => (
              <TabItem
                key={index}
                position="above"
                isOpen={openIndexes.includes(index)}
              >
                {items[index].contents}
              </TabItem>
            ))}
          </TabItems>
          <TabButtons>
            {items.map((item, index) => (
              <TabButton
                key={item.title}
                isOpen={openIndexes.includes(index)}
                onClick={() => handleItemClick(index)}
              >
                {item.title}
              </TabButton>
            ))}
          </TabButtons>
        </div>
      )}
    </BaseTabs>
  )
}

const items = [
  {
    title: '🐴',
    contents: (
      <div>
        Horses can sleep both lying down and standing up. Domestic horses have a
        lifespan of around 25 years. A 19th century horse named 'Old Billy' is
        said to have lived 62 years.
      </div>
    ),
  },
  {
    title: '🦏',
    contents: (
      <div>
        Rhino skin maybe thick but it can be quite sensitive to sunburns and
        insect bites which is why they like wallow so much – when the mud dries
        it acts as protection from the sunburns and insects.
      </div>
    ),
  },
  {
    title: '🦄',
    contents: (
      <div>
        If you’re looking to hunt a unicorn, but don’t know where to begin, try
        Lake Superior State University in Sault Ste. Marie, Michigan. Since
        1971, the university has issued permits to unicorn questers.
      </div>
    ),
  },
]

function App() {
  return (
    <div
      style={{
        maxWidth: 400,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 60,
      }}
    >
      <Accordion items={items} />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
