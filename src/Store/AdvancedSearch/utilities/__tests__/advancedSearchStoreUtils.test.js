import * as u from 'Store/AdvancedSearch/utilities/advancedSearchStoreUtils'
import { Boundary } from 'shared/classes/Boundary'
import { Filter } from 'shared/classes/Filter'
import { filterMocks } from 'shared/models/__mocks__/filterMocks'
import { Condition } from 'shared/classes/Condition'
import moment from 'moment'

const todayminus1year = moment(moment.now())
  .subtract(1, 'Y')
  .format('YYYY-MM-DD')

const todayplus1year = moment(moment.now())
  .add(1, 'Y')
  .format('YYYY-MM-DD')

describe('transformStateIntoParamObject', () => {
  it('transforms the state to a params object', () => {
    let condition0Filters = [filterMocks('HPD_VIOLATION')]

    const conditions = {
      '0': new Condition({ type: 'AND', filters: condition0Filters }),
    }

    const boundary1 = new Boundary('COUNCIL', '1')
    const boundary2 = new Boundary('COMMUNITY', '1')

    const housingType1 = new Filter({
      modelConstant: 'SMALL_HOMES',
    })

    housingType1.paramsObject['unitsres'].create()

    const advancedSearch = {
      conditions: conditions,
      boundaries: [boundary1, boundary2],
      housingTypes: [housingType1],
    }

    const datasetsConfig = []
    const result = u.transformStateIntoParamObject(datasetsConfig, advancedSearch)
    const expected = {
      q: `*condition_0=AND filter_0=hpdviolations__count__gte=5,hpdviolations__approveddate__gte=${todayminus1year},hpdviolations__approveddate__lte=${todayplus1year}`,
      council: '1',
      cd: '1',
      housingtype: 'sh',
      unitsres__lte: '6',
    }
    expect(result).toEqual(expected)
  })
})
