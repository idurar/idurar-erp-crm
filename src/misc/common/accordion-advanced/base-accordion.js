import React from 'react'

class Accordion extends React.Component {
  static defaultProps = {
    stateReducer: (state, changes) => changes,
    onStateChange: () => {},
  }
  state = {openIndexes: [0]}
  getState(state = this.state) {
    return {
      openIndexes:
        this.props.openIndexes === undefined
          ? state.openIndexes
          : this.props.openIndexes,
    }
  }
  internalSetState(changes, callback = () => {}) {
    let allChanges
    this.setState(
      state => {
        const actualState = this.getState(state)
        const changesObject =
          typeof changes === 'function' ? changes(actualState) : changes
        allChanges = this.props.stateReducer(actualState, changesObject)
        return allChanges
      },
      () => {
        this.props.onStateChange(allChanges)
        callback()
      },
    )
  }
  handleItemClick = index => {
    this.internalSetState(state => {
      const closing = state.openIndexes.includes(index)
      return {
        type: closing ? 'closing' : 'opening',
        openIndexes: closing
          ? state.openIndexes.filter(i => i !== index)
          : [...state.openIndexes, index],
      }
    })
  }
  render() {
    return this.props.children({
      openIndexes: this.getState().openIndexes,
      handleItemClick: this.handleItemClick,
    })
  }
}

export {Accordion}
