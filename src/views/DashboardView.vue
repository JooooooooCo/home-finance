<template>
  <v-container>
    <v-row class="mt-2">
      <v-col cols="6" class="pt-0">
        <YearPicker v-model="year" @update:modelValue="loadDashboard" />
      </v-col>
      <v-col cols="6" class="pt-0">
        <MonthPicker v-model="month" @update:modelValue="loadDashboard" />
      </v-col>
      <v-col cols="12" class="pt-0 pb-0">
        <v-divider />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card elevation="0" class="pb-2">
          <v-row>
            <v-col cols="6" class="pt-0 pb-0">
              <v-card elevation="0" color="grey-lighten-4 pt-4">
                <v-card-title class="text-subtitle-2 text-medium-emphasis font-weight-regular">Saldo
                  Inicial</v-card-title>
                <v-card-text class="text-h6 font-weight-bold" :class="true ? 'text-red' : ''">
                  {{ userMonetaryValueFormatter(-9878.09) }}
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="6" class="pt-0 pb-0">
              <v-card elevation="0" color="grey-lighten-4 pt-4 mb-2">
                <v-card-title class="text-subtitle-2 text-medium-emphasis font-weight-regular">Saldo
                  Atual</v-card-title>
                <v-card-text class="text-h6 font-weight-bold" :class="false ? 'text-red' : ''">
                  {{ userMonetaryValueFormatter(7786.46) }}
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="6" class="pt-0 pb-0">
              <v-card elevation="0" color="grey-lighten-4">
                <v-card-title class="text-subtitle-2 text-medium-emphasis font-weight-regular">Contas a
                  Pagar</v-card-title>
                <v-card-text class="text-h6 font-weight-bold text-red">
                  {{ userMonetaryValueFormatter(239.09) }}
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="6" class="pt-0 pb-0">
              <v-card elevation="0" color="grey-lighten-4 mb-2">
                <v-card-title class="text-subtitle-2 text-medium-emphasis font-weight-regular">Contas a
                  Receber</v-card-title>
                <v-card-text class="text-h6 font-weight-bold" :class="false ? 'text-red' : ''">
                  {{ userMonetaryValueFormatter(122.46) }}
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="6" class="pt-0 pb-0">
              <v-card elevation="0" color="grey-lighten-4 mb-2">
                <v-card-title class="text-subtitle-2 text-medium-emphasis font-weight-regular">Saldo
                  Final</v-card-title>
                <v-card-text class="text-h6 font-weight-bold" :class="false < 0 ? 'text-red' : ''">
                  {{ userMonetaryValueFormatter(7657.45) }}
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="6" class="pt-0 pb-0">
              <v-row>
                <v-col>
                  <v-card elevation="0" color="grey-lighten-4 mb-2">

                    <v-card-text class="pt-0 pb-4">
                      <v-row class="mt-0">
                        <v-col cols="12">
                          <v-icon icon="mdi-arrow-up-circle-outline" class="mr-1" color="teal darken-2" />
                          {{ userMonetaryValueFormatter(78687.56) }}
                        </v-col>
                      </v-row>
                      <v-row class="mt-0">
                        <v-col>
                          <v-icon icon="mdi-arrow-down-circle-outline" class="mr-1" color="red" />
                          {{ userMonetaryValueFormatter(23398.67) }}
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-divider class="mt-4" />
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <ChartCategoriesForecastExecuted />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from "vue"
import { useMonetaryValueHandler } from '@/composables/useMonetaryValueHandler'
import MonthPicker from '@/components/generics/MonthPicker.vue'
import YearPicker from '@/components/generics/YearPicker.vue'
import ChartCategoriesForecastExecuted from "@/components/dashboard/charts/ChartCategoriesForecastExecuted.vue"

const { userMonetaryValueFormatter } = useMonetaryValueHandler();

const year = ref(2025);
const month = ref(4);

const loadDashboard = () => {
}
</script>
