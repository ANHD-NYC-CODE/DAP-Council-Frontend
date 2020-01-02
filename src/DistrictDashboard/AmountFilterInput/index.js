import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Form, Button } from 'react-bootstrap'
import StandardizedInput from 'shared/classes/StandardizedInput'
import { spaceEnterKeyDownHandler } from 'shared/utilities/accessibilityUtils'

const AmountFilterInput = props => {
  const [value, setValue] = useState(props.value)
  const [isChanging, setChanging] = useState(false)

  const handleOnChange = e => {
    e.preventDefault()
    setChanging(true)
    e = new StandardizedInput(e)

    setValue(e.value)
  }

  const handleSubmit = (e, value) => {
    e.preventDefault()
    setChanging(false)
    e = new StandardizedInput()
    e.value = value
    if (e.value === props.value) return
    props.onSubmit(e)
  }

  return (
    <Form className="amount-filter-input" onSubmit={e => handleSubmit(e, value)}>
      <Form.Group>
        <Form.Control
          type="number"
          min={0}
          max={999}
          onChange={handleOnChange}
          onBlur={e => handleSubmit(e, value)}
          onKeyDown={e => spaceEnterKeyDownHandler(e, e => handleSubmit(e, value))}
          value={isChanging ? value : props.value}
        />

        {value !== props.value && (
          <Button variant="dark" type="submit" size="sm">
            Go
          </Button>
        )}
        {value !== props.value && <Form.Text className="text-muted">(not saved)</Form.Text>}
      </Form.Group>
    </Form>
  )
}

AmountFilterInput.propTypes = {}
AmountFilterInput.defaultProps = {}

export default AmountFilterInput
