import mock from '@/@fake-db/mock'
import type { ICash } from '@/@fake-db/types'
import { paginateArray } from '@/@fake-db/utlis'
import { faker } from '@faker-js/faker'
import avatar1 from '@images/avatars/avatar-1.png'
import avatar2 from '@images/avatars/avatar-2.png'
import avatar3 from '@images/avatars/avatar-3.png'
import avatar4 from '@images/avatars/avatar-4.png'
import avatar5 from '@images/avatars/avatar-5.png'
import avatar6 from '@images/avatars/avatar-6.png'
import avatar7 from '@images/avatars/avatar-7.png'
import avatar8 from '@images/avatars/avatar-8.png'

const avatars = [
  avatar1,
  avatar2,
  avatar3,
  avatar4,
  avatar5,
  avatar6,
  avatar7,
  avatar8,
]

const database: ICash[] = []

for (let index = 0; index < 50; index++) {
  let date = "";

  const isDate = (strDate: string) => {
    try {
      new Intl.DateTimeFormat('pt-BR', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      }).format(new Date(strDate))

      return true;
    } catch(e) {
      return false;
    }
  }

  do {
    const openingDate = faker.date.anytime()
    const month = openingDate.getMonth() < 10 ? `0${openingDate.getMonth()}` : openingDate.getMonth();
    const day = openingDate.getDay() < 10 ? `0${openingDate.getDay()}` : openingDate.getDay();

    date = `${openingDate.getFullYear()}-${month}-${day}`
  } while(!isDate(date));

  database.push({
    id: (index + 10) * 2,
    openingDate: date,
    operator: {
      email: faker.internet.email(),
      name: faker.person.fullName(),
      avatar: avatars[Math.floor(Math.random() * avatars.length)],
    },
    total: faker.number.int({ min: 0, max: 650 }),
    averageOfDay: faker.number.int({ min: 0, max: 500 }),
    status: faker.number.int({ min: 0, max: 1 }) ? 'Aberto' : 'Fechado',
  })
}

mock.onGet('/billings/cash').reply(config => {
  const { q = '', status = null, perPage = 0, currentPage = 1, startDate = '', endDate = '' } = config.params ?? {}

  const queryLowered = q.toLowerCase()

  let filteredCash = database.filter(
    cash => (
      (
        cash.operator.name.toLowerCase().includes(queryLowered)
        || cash.operator.email.toLowerCase().includes(queryLowered)
        || cash.total.toString().includes(queryLowered)
        || cash.openingDate.toString().includes(queryLowered)
        || cash.id.toString().includes(queryLowered))
        && cash.status === (status || cash.status)
    ),
  ).reverse()

  if (startDate && endDate) {
    filteredCash = filteredCash.filter(cashObj => {
      const start = new Date(startDate).getTime()
      const end = new Date(endDate).getTime()
      const openingDate = new Date(cashObj.openingDate).getTime()

      return openingDate >= start && openingDate <= end
    })
  }

  const totalPage = Math.ceil(filteredCash.length / perPage) ? Math.ceil(filteredCash.length / perPage) : 1
  const total = filteredCash.length

  return [200, { data: paginateArray(filteredCash, perPage, currentPage), totalPage, total }]
})
