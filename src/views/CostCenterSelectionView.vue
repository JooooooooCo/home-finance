<template>
  <div class="row mar-bottom-0">
    <div class="col s12" style="min-height: 100vh">
      <div class="col s10 m6 l4 login-card">
        <div class="z-depth-1 row card-default" v-if="!loading">
          <form v-if="!enableAddCostCenter">
            <div class="row center-align">
              <i class="material-icons teal-text text-darken-2 large mar-top-20">input</i>
            </div>

            <div class="row mar-top-0 center-align">
              <h5 class="teal-text text-darken-2">Choose a cost center</h5>
            </div>

            <div class="row center-align">
              <div
                class="chip teal darken-2"
                v-for="costCenter in costCenters"
                :key="costCenter.id"
                @click.prevent="setCostCenter(costCenter)"
              >
                <span class="white-text">{{ costCenter.name }}</span>
              </div>
              <div class="chip grey darken-2" @click.prevent="toogleAddCostCenter">
                <span class="white-text">+NEW</span>
              </div>
            </div>
          </form>

          <form v-else>
            <div class="row center-align">
              <i class="material-icons teal-text text-darken-2 large mar-top-20">library_add</i>
            </div>

            <div class="row mar-top-0 center-align">
              <h5 class="teal-text text-darken-2">Add new cost center</h5>
            </div>

            <div class="row mar-bottom-0">
              <div class="input-field col s12">
                <input
                  type="text"
                  name="cost_center_name"
                  id="cost_center_name"
                  v-model="costCenterName"
                />
                <label for="cost_center_name" class="active mar-top-minus5">Name</label>
              </div>
            </div>

            <div class="row mar-bottom-20">
              <div class="col s6" v-if="hasCostCenters">
                <input
                  type="button"
                  value="Cancel"
                  class="col s12 btn waves-effect grey lighten-1 grey-text text-darken-4"
                  @click.prevent="toogleAddCostCenter"
                />
              </div>
              <div :class="hasCostCenters ? 'col s6' : 'col s8 offset-s2'">
                <input
                  type="submit"
                  value="Create"
                  class="col s12 btn bold waves-effect teal darken-2"
                  @click.prevent="createCostCenter"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCostCenterStore } from '@/store/cost_center.store'
import { axiosHelper } from '@/helper/axios.helper'
import M from 'materialize-css'

const costCenterStore = useCostCenterStore()

const costCenters = ref([])
const costCenterName = ref('')
const loading = ref(true)
const showAddCostCenter = ref(false)

const hasCostCenters = computed(() => costCenters.value.length > 0)
const enableAddCostCenter = computed(() => !hasCostCenters.value || showAddCostCenter.value)

const getAllCostCenter = async () => {
  loading.value = true
  const url = '/settings/cost-center'

  const res = await axiosHelper.get(url)

  if (res.error) {
    M.toast({ html: res.message, classes: 'red' })
    console.error(res.message)
  } else {
    costCenters.value = res.data
  }

  loading.value = false
}

const setCostCenter = (costCenter) => {
  if (!costCenter) return
  costCenterStore.setCostCenter(costCenter)
}

const createCostCenter = () => {
  if (!costCenterName.value) return
  costCenterStore.createCostCenter(costCenterName.value)
}

const toogleAddCostCenter = () => {
  showAddCostCenter.value = !showAddCostCenter.value
}

onMounted(() => {
  getAllCostCenter()
})
</script>

<style lang="scss" scoped></style>
