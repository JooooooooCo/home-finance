<template>
  <v-main class="main-container">
    <v-container class="fill-height" fluid>
      <v-row justify="center" align="center" class="fill-height">
        <v-col cols="12" sm="8" md="6" lg="4">
          <v-card class="elevation-12" v-if="!loading">
            <v-card-text>
              <v-form v-if="!enableAddCostCenter">
                <v-row class="text-center">
                  <v-col cols="12">
                    <v-icon size="128" color="teal darken-2">mdi-login</v-icon>
                  </v-col>
                </v-row>
                
                <v-row class="text-center">
                  <v-col cols="12">
                    <h4 class="teal--text text--darken-2" >Choose a cost center</h4>
                  </v-col>
                </v-row>
  
                <v-row justify="center">
                  <v-col cols="12">
                    <v-chip
                      v-for="costCenter in costCenters"
                      :key="costCenter.id"
                      class="ma-2"
                      color="teal darken-2"
                      text-color="white"
                      @click="setCostCenter(costCenter)"
                    >
                      <b>{{ costCenter.name }}</b>
                    </v-chip>  
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12" class="text-center">
                    <v-btn @click="toogleAddCostCenter" variant="tonal" large block>New</v-btn>
                  </v-col>
                </v-row>
              </v-form>
  
              <v-form v-else>
                <v-row class="text-center">
                  <v-col cols="12">
                    <v-icon size="128" color="teal darken-2">mdi-plus-box-multiple</v-icon>
                  </v-col>
                </v-row>
                
                <v-row class="text-center">
                  <v-col cols="12">
                    <h4 class="teal--text text--darken-2" >Add new cost center</h4>
                  </v-col>
                </v-row>
  
                <v-row>
                  <v-col cols="12">
                    <v-text-field v-model="costCenterName" label="Name" variant="solo-filled" flat rounded-sm required></v-text-field>
                  </v-col>
                </v-row>
  
                <v-row>
                  <v-col cols="6" v-if="hasCostCenters">
                    <v-btn @click="toogleAddCostCenter" variant="text" large block>Cancel</v-btn>
                  </v-col>
                  <v-col cols="6" :offset="hasCostCenters ? 0 : 3">
                    <v-btn block color="teal darken-2" class="white--text" @click="createCostCenter">Create</v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCostCenterStore } from '@/store/cost_center.store'
import { axiosHelper } from '@/helper/axios.helper'
import { useSnackbarStore } from '@/store/snackbar.store';

const costCenterStore = useCostCenterStore()
const snackbarStore = useSnackbarStore()

const costCenters = ref([])
const costCenterName = ref('')
const loading = ref(true)
const showAddCostCenter = ref(false)

const hasCostCenters = computed(() => costCenters.value.length > 0)
const enableAddCostCenter = computed(() => !hasCostCenters.value || showAddCostCenter.value)

const getAllCostCenter = async () => {
  loading.value = true
  const url = '/cost-center'

  const res = await axiosHelper.get(url)

  if (res.error) {
    snackbarStore.showSnackbar(res.message)
    return;
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
  costCenterStore.createCostCenter(costCenterName.value)
}

const toogleAddCostCenter = () => {
  showAddCostCenter.value = !showAddCostCenter.value
}

onMounted(() => {
  getAllCostCenter()
})
</script>

<style lang="css" scoped>
.main-container {
  background-image: linear-gradient( 135deg, #009688 10%, #002661 100%);
}
</style>
