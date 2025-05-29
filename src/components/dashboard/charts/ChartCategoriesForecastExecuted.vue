<template>
  <v-chart class="chart" :option="option" />
</template>

<script setup>
import VChart from 'vue-echarts';
import { ref, provide } from 'vue';
import { use } from 'echarts/core';
import { BarChart } from 'echarts/charts';
import { DatasetComponent, GridComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

use([DatasetComponent, GridComponent, BarChart, CanvasRenderer]);

const option = ref({
  dataset: {
    source: [
      ['score', 'amount', 'product'],
      [89.3, 58212, 'Matcha Latte'],
      [57.1, 78254, 'Milk Tea'],
      [74.4, 41032, 'Cheese Cocoa'],
      [50.1, 12755, 'Cheese Brownie'],
      [89.7, 20145, 'Matcha Cocoa'],
      [68.1, 79146, 'Tea'],
      [19.6, 91852, 'Orange Juice'],
      [10.6, 101852, 'Lemon Juice'],
      [32.7, 20112, 'Walnut Brownie'],
    ],
  },
  xAxis: {},
  yAxis: { type: 'category' },
  series: [
    {
      type: 'bar',
      encode: {
        // Map "amount" column to x-axis.
        x: 'amount',
        // Map "product" row to y-axis.
        y: 'product',
      },
    },
  ],
});
</script>

<style scoped>
.chart {
  height: 400px;
}
</style>
