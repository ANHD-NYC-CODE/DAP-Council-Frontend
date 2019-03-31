import React from 'react'
import PropTypes from 'prop-types'
import { StandardizedInput } from 'shared/classes/StandardizedInput'
import { Form, InputGroup, Col } from 'react-bootstrap'
import NewFilterSelect from 'AdvancedSearch/FilterComponent/NewFilterSelect'
import classnames from 'classnames'
const ComparisonFieldSet = props => {
  return (
    <Form.Row className="comparison-fieldset" key={props.key}>
      <InputGroup as={Col} xs={props.filter ? 4 : 6}>
        <InputGroup.Prepend>
          {props.paramMap.languageModule.propertyAdjective && (
            <InputGroup.Text>{props.paramMap.languageModule.propertyAdjective}</InputGroup.Text>
          )}
        </InputGroup.Prepend>
        <Form.Control
          name="comparison"
          as="select"
          className={classnames({ valued: !!props.paramMap.comparison })}
          data-range-key={props.paramMap.rangeKey}
          onChange={e =>
            props.paramMap.rangeKey
              ? props.rangeChange(props.paramMap, e)
              : props.paramMap.update({ dispatchAction: props.dispatchAction, e: new StandardizedInput(e) })
          }
          value={props.paramMap.comparison}
        >
          {props.options.map((option, index) => {
            return (
              <option
                key={`paramMap-${props.paramMapIndex}-comparison-option-${index}`}
                name={option.name}
                value={option.value}
              >
                {option.label}
              </option>
            )
          })}
        </Form.Control>
      </InputGroup>
      <InputGroup
        as={Col}
        // xs={12}
        xs={{
          '3': props.filter && !props.paramMap.rangeKey,
          '6': !props.filter,
          '8': props.filter && props.paramMap.rangeKey,
        }}
      >
        {props.paramMap.languageModule.valuePrefix && (
          <InputGroup.Prepend>
            <InputGroup.Text>{props.paramMap.languageModule.valuePrefix}</InputGroup.Text>
          </InputGroup.Prepend>
        )}
        {props.paramMap.baseComponent({
          dispatchAction: props.dispatchAction,
          paramMap: props.paramMap,
          onChange: e => props.paramMap.update({ dispatchAction: props.dispatchAction, e: new StandardizedInput(e) }),
          type: props.paramMap.props.type,
        })}
        <InputGroup.Append>
          {props.paramMap.languageModule.valueSuffix && (
            <InputGroup.Text>{props.paramMap.languageModule.valueSuffix}</InputGroup.Text>
          )}
          {props.paramMap.languageModule.shortNoun && (
            <InputGroup.Text>{props.paramMap.languageModule.shortNoun}</InputGroup.Text>
          )}
        </InputGroup.Append>
      </InputGroup>
      {props.filter && props.paramMap.type === 'AMOUNT' && (
        <InputGroup as={Col} xs={5}>
          <NewFilterSelect
            filter={props.filter}
            filterIndex={props.filterIndex}
            onChange={props.replaceFilter}
            value={props.filter.resourceModel.resourceConstant}
          />
        </InputGroup>
      )}
    </Form.Row>
  )
}

ComparisonFieldSet.propTypes = {
  replaceFilter: PropTypes.func,
  dispatchAction: PropTypes.func,
  filterIndex: PropTypes.number,
  filter: PropTypes.object,
  key: PropTypes.string,
  options: PropTypes.array,
  paramMap: PropTypes.object,
  paramMapIndex: PropTypes.number,
  rangeChange: PropTypes.func,
}

export default ComparisonFieldSet
