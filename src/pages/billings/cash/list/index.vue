<script setup lang="ts">
import type { ICash } from '@/views/billings/cash/types'
import { useBillingStore } from '@/views/billings/cash/useBillingStore'
import { avatarText } from '@core/utils/formatters'
import { formatDate, getMonetaryValue } from '@layouts/utils'

// 👉 Store
const billingListStore = useBillingStore()

const searchQuery = ref('')
const selectedStatus = ref()
const rowPerPage = ref(10)
const currentPage = ref(1)
const totalPage = ref(1)
const totalItems = ref(0)
const cash = ref<ICash[]>([])
const selectedRows = ref<string[]>([])

// 👉 Fetch Cash
watchEffect(() => {
  billingListStore.fetchCash(
    {
      q: searchQuery.value,
      status: selectedStatus.value,
      perPage: rowPerPage.value,
      currentPage: currentPage.value,
    },
  ).then(response => {
    cash.value = response.data.data
    totalPage.value = response.data.totalPage
    totalItems.value = response.data.total
  }).catch(error => {
    console.log(error)
  })
})

// 👉 watching current page
watchEffect(() => {
  if (currentPage.value > totalPage.value)
    currentPage.value = totalPage.value
})

// 👉 Computing pagination data
const paginationData = computed(() => {
  const firstIndex = cash.value.length ? ((currentPage.value - 1) * rowPerPage.value) + 1 : 0
  const lastIndex = cash.value.length + ((currentPage.value - 1) * rowPerPage.value)

  return `Showing ${firstIndex} to ${lastIndex} of ${totalItems.value} entries`
})

// 👉 Cash value variant resolver
const resolveBalanceVariant = (value: number, dailyAvarage: number) => {
  
  const text = getMonetaryValue(value);
  if (value === dailyAvarage)
    return { status: text, chip: { color: 'secondary' } }

  if (value < dailyAvarage)
    return { status: text, chip: { color: 'error' } }

  return { status: text, chip: { color: 'success' } }
}

// 👉 Status variant resolver
const resolveStatusVariantAndIcon = (status: string) => {
  if (status === 'Aberto')
    return { variant: 'warning', icon: 'mdi-network-pos' }

  return { variant: 'secondary', icon: 'mdi-network-pos' }
}
</script>

<template>
  <VCard
    v-if="cash"
    id="list"
  >
    <VCardText class="d-flex align-center flex-wrap gap-4">
      <!-- 👉 Rows per page -->
      <div
        class="d-flex align-center"
        style="width: 135px;"
      >
        <span class="text-no-wrap me-3">Show:</span>
        <VSelect
          v-model="rowPerPage"
          density="compact"
          :items="[10, 20, 30, 50]"
        />
      </div>

      <div class="me-3">
        <!-- 👉 Open Cash -->
        <VBtn
          prepend-icon="tabler-plus"
          :to="{ name: 'apps-invoice-add' }"
        >
          Abrir Cash
        </VBtn>
      </div>

      <VSpacer />

      <div class="d-flex align-center flex-wrap gap-4">
        <!-- 👉 Search  -->
        <div class="list-filter">
          <VTextField
            v-model="searchQuery"
            placeholder="Buscar"
            density="compact"
          />
        </div>

        <!-- 👉 Select status -->
        <div class="list-filter">
          <VSelect
            v-model="selectedStatus"
            label="Status"
            clearable
            clear-icon="tabler-x"
            single-line
            :items="['Aberto', 'Fechado']"
          />
        </div>
      </div>
    </VCardText>

    <VDivider />

    <!-- SECTION Table -->
    <VTable class="text-no-wrap cash-list-table">
      <!-- 👉 Table head -->
      <thead class="text-uppercase">
        <tr>
          <th scope="col">
            #ID
          </th>
          <th
            scope="col"
            class="text-center"
          >
            <VIcon icon="tabler-trending-up" />
          </th>

          <th scope="col">
            VENDEDOR
          </th>

          <th
            scope="col"
            class="text-center"
          >
            TOTAL
          </th>

          <th scope="col">
            DATA DE LANÇAMENTO
          </th>

          <th
            scope="col"
            class="text-center"
          >
            VARIAÇÃO (Média do dia)
          </th>

          <th scope="col">
            AÇÕES
          </th>
        </tr>
      </thead>

      <!-- 👉 Table Body -->
      <tbody>
        <tr
          v-for="it in cash"
          :key="it.id"
          style="height: 3.75rem;"
        >
          <!-- 👉 Id -->
          <td>
            <RouterLink :to="{ name: 'apps-invoice-preview-id', params: { id: it.id } }">
              #{{ it.id }}
            </RouterLink>
          </td>

          <!-- 👉 Status -->
          <td class="text-center">
            <VTooltip>
              <template #activator="{ props }">
                <VAvatar
                  :size="30"
                  v-bind="props"
                  :color="resolveStatusVariantAndIcon(it.status).variant"
                  variant="tonal"
                >
                  <VIcon
                    :size="20"
                    :icon="resolveStatusVariantAndIcon(it.status).icon"
                  />
                </VAvatar>
              </template>

              <p class="mb-0">
                Situação: {{ it.status }}
              </p>
              <p class="mb-0">
                Acumulado: {{ getMonetaryValue(it.total) }}
              </p>
              <p class="mb-0">
                Data: {{ formatDate(new Date(it.openingDate), false, "billings/cash/column:Status") }}
              </p>
            </VTooltip>
          </td>

          <!-- 👉 Client Avatar and Email -->
          <td>
            <div class="d-flex align-center">
              <VAvatar
                size="34"
                :color="resolveStatusVariantAndIcon(it.status).variant"
                variant="tonal"
                class="me-3"
              >
                <VImg
                  v-if="it.operator.avatar.length"
                  :src="it.operator.avatar"
                />
                <span v-else>{{ avatarText(it.operator.name) }}</span>
              </VAvatar>

              <div class="d-flex flex-column">
                <a href="#" class="text-base font-weight-medium mb-0">
                  {{ it.operator.name }}
                </a>
                <span class="text-disabled text-sm">{{ it.operator.email }}</span>
              </div>
            </div>
          </td>

          <!-- 👉 total -->
          <td class="text-center">
            {{ getMonetaryValue(it.total) }}
          </td>

          <!-- 👉 Date -->
          <td>{{ formatDate(new Date(it.openingDate), false, "billings/cash/column:Date") }}</td>

          <!-- 👉 Balance -->
          <td class="text-center">
            <VChip
              label
              v-bind="resolveBalanceVariant(it.averageOfDay, it.total).chip"
              size="small"
            >
              {{ resolveBalanceVariant(it.averageOfDay, it.total).status }}
            </VChip>
          </td>

          <!-- 👉 Actions -->
          <td style="width: 8rem;">
            <VBtn
              icon
              variant="text"
              color="default"
              size="x-small"
            >
              <VIcon
                icon="tabler-mail"
                :size="22"
              />
            </VBtn>

            <VBtn
              icon
              variant="text"
              color="default"
              size="x-small"
              :to="{ name: 'apps-invoice-preview-id', params: { id: it.id } }"
            >
              <VIcon
                :size="22"
                icon="tabler-eye"
              />
            </VBtn>

            <VBtn
              icon
              variant="text"
              color="default"
              size="x-small"
            >
              <VIcon
                :size="22"
                icon="tabler-dots-vertical"
              />

              <VMenu activator="parent">
                <VList>
                  <VListItem value="download">
                    <template #prepend>
                      <VIcon
                        size="24"
                        class="me-3"
                        icon="tabler-download"
                      />
                    </template>

                    <VListItemTitle>Download</VListItemTitle>
                  </VListItem>

                  <VListItem :to="{ name: 'apps-invoice-edit-id', params: { id: it.id } }">
                    <template #prepend>
                      <VIcon
                        size="24"
                        class="me-3"
                        icon="tabler-pencil"
                      />
                    </template>

                    <VListItemTitle>Edit</VListItemTitle>
                  </VListItem>
                  <VListItem value="duplicate">
                    <template #prepend>
                      <VIcon
                        size="24"
                        class="me-3"
                        icon="tabler-stack"
                      />
                    </template>

                    <VListItemTitle>Duplicate</VListItemTitle>
                  </VListItem>
                </VList>
              </VMenu>
            </VBtn>
          </td>
        </tr>
      </tbody>

      <!-- 👉 table footer  -->
      <tfoot v-show="!cash.length">
        <tr>
          <td
            colspan="8"
            class="text-center text-body-1"
          >
            No data available
          </td>
        </tr>
      </tfoot>
    </VTable>
    <!-- !SECTION -->

    <VDivider />

    <!-- SECTION Pagination -->
    <VCardText class="d-flex align-center flex-wrap gap-4 py-3">
      <!-- 👉 Pagination meta -->
      <span class="text-sm text-disabled">
        {{ paginationData }}
      </span>

      <VSpacer />

      <!-- 👉 Pagination -->
      <VPagination
        v-model="currentPage"
        size="small"
        :total-visible="5"
        :length="totalPage"
        @next="selectedRows = []"
        @prev="selectedRows = []"
      />
    </VCardText>
    <!-- !SECTION -->
  </VCard>
</template>

<style lang="scss">
#list {
  .list-actions {
    inline-size: 8rem;
  }

  .list-filter {
    inline-size: 12rem;
  }
}
</style>
