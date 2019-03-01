import moment from 'moment'

export const standardUrlAmountParser = (dataset, comparison, value) => {
  return `${dataset.queryName}__${dataset.amountField()}__${comparison}=${value}`
}

const constructAmountFilter = (dataset, comparison, value) => {
  return dataset.amountUrlParser(dataset, comparison, value)
}

export const standardUrlDateParser = (dataset, startDate, endDate) => {
  let filters = []
  if (startDate) {
    filters.push(`${dataset.queryName}__${dataset.dateField(startDate)}__gte=${startDate}`)
  }
  if (endDate) {
    filters.push(`${dataset.queryName}__${dataset.dateField(endDate)}__lte=${endDate}`)
  }

  return filters.join(',')
}

export const rsunitsUrlDateParser = (dataset, startDate, endDate) => {
  let filters = []
  if (startDate) {
    filters.push(`${dataset.queryName}__${dataset.dateField(startDate)}__gt=0`)
  }
  if (endDate) {
    filters.push(`${dataset.queryName}__${dataset.dateField(endDate)}__lt=0`)
  }

  return filters.join(',')
}

const constructDateFilter = (dataset, startDate = null, endDate = null) => {
  return dataset.dateUrlParser(dataset, startDate, endDate)
}

export const convertFilterToParams = object => {
  // converts an objects like:
  // const object = { dataset: ds, comparison: 'gte', value: '10', startDate '2017-01-01', endDate: '2018-01-01' }
  // into:
  // "hpdviolation__approveddate__gte=2017-01-01,hpdviolation__approveddate__lte=2018-01-01,hpdviolation__count__gte=10"

  let filters = []
  let { dataset, comparison, value, startDate, endDate } = object
  if (startDate || endDate) {
    filters.push(constructDateFilter(dataset, startDate, endDate))
  }

  filters.push(constructAmountFilter(dataset, comparison, value))
  return filters.join(',')
}

const convertConditionGroupToString = filters => {
  return filters
    .map((filterObject, index) => {
      const groupLabel = `filter_${index}`

      if (filterObject.conditionGroup) {
        return `${groupLabel}=condition_${filterObject.conditionGroup}`
      } else {
        return `${groupLabel}=${convertFilterToParams(filterObject)}`
      }
    })
    .join(' ')
}

export const convertConditionMappingToQ = conditions => {
  return Object.keys(conditions)
    .map(key => `*condition_${key}=${conditions[key].type} ${convertConditionGroupToString(conditions[key].filters)}`)
    .join(' ')
}

//////////////////
// Sentence

export const standardDateSentenceParser = (startDate, endDate) => {
  if (startDate && endDate) {
    return `from ${moment(startDate).format('MM/DD/YYYY')} to ${moment(endDate).format('MM/DD/YYYY')}`
  } else if (startDate) {
    return `since ${moment(startDate).format('MM/DD/YYYY')}`
  } else if (endDate) {
    return `before ${moment(endDate).format('MM/DD/YYYY')}`
  }
}

export const rsunitsDateSentenceParser = (startDate, endDate) => {
  if (startDate && endDate) {
    return `from ${moment(startDate).format('YYYY')} to ${moment(endDate).format('YYYY')}`
  } else if (startDate) {
    return `since ${moment(startDate).format('YYYY')}`
  } else if (endDate) {
    return `before ${moment(endDate).format('YYYY')}`
  }
}

const constructDateSentence = (dataset, startDate = null, endDate = null) => {
  return dataset.dateSentenceParser(startDate, endDate)
}

const constructComparisonString = comparison => {
  switch (comparison) {
    case 'gte':
      return 'at least'
    case 'exact':
      return 'exactly'
    case 'lte':
      return 'at most'
  }
}

export const standardAmountSentence = (dataset, comparison, value) => {
  return `${constructComparisonString(comparison)} ${value} ${dataset.name}`
}

export const rsunitsAmountSentence = (dataset, comparison, value) => {
  return `lost ${constructComparisonString(comparison)} ${value}% of their ${dataset.name}`
}

const constructAmountSentence = (dataset, comparison, value) => {
  return dataset.amountSentenceParser(dataset, comparison, value)
}

export const convertFilterToSentence = object => {
  // converts an objects like:
  // const object = { dataset: ds, comparison: 'gte', value: '10', startDate '2017-01-01', endDate: '2018-01-01' }
  // into:
  // at least 10 HPD Violations between 01/01/2017 and 01/01/2018

  let filters = []
  let { dataset, comparison, value, startDate, endDate } = object
  filters.push(constructAmountSentence(dataset, comparison, value))
  if (startDate || endDate) {
    filters.push(constructDateSentence(dataset, startDate, endDate))
  }

  return filters.join(' ')
}

export const convertConditionGroupToSentence = conditionGroup => {
  return conditionGroup.filters
    .filter(filterObject => !filterObject.conditionGroup)
    .map(filterObject => {
      return `${convertFilterToSentence(filterObject)}`
    })
    .join(conditionGroup.type === 'AND' ? ' and ' : ' or ')
}

const constructConditionFill = conditionGroup => {
  return conditionGroup.type === 'AND' ? ' and that either have' : ' or that have'
}

export const convertConditionMappingToSentence = q => {
  const conditions = Object.keys(q)
  if (!(conditions.length && q['0'].filters.length)) return 'Show me properties that have...'
  return `Show me properties that have ${conditions
    .map((key, index) => {
      return `${convertConditionGroupToSentence(q[key])}${
        conditions.length > 1 && index !== conditions.length - 1 ? constructConditionFill(q[key]) : ''
      }`
    })
    .join(' ')}.`
}
