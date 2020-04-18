<template>
  <FlexboxLayout class="WalletProfitsChartView darkMode">
    <LoadingMessage
      v-if="isLoading"
      sub-title="Please wait, we are fetching the chart."
      title="Processing"
      class="loading-message"
    />
    <ErrorMessage v-else-if="isFailedToLoad" data-test="error-message" />
    <StackLayout v-show="!isLoading && !isFailedToLoad">
      <RadCartesianChart>
        <CategoricalAxis
          v-tkCartesianHorizontalAxis
          labelRotationAngle="200"
          labelFitMode="Rotate"
        />
        <LinearAxis v-tkCartesianVerticalAxis labelFormat="%.0f" />

        <SplineAreaSeries
          v-tkCartesianSeries
          :items="charts"
          selectionMode="DataPoint"
          categoryProperty="date"
          valueProperty="profit"
        />
      </RadCartesianChart>
    </StackLayout>
  </FlexboxLayout>
</template>

<script>
import { fetchMarketChart } from '@/Api'
import moment from 'moment'
import groupBy from 'lodash.groupby'
import LoadingMessage from '@/components/LoadingMessage'
import ErrorMessage from '@/components/ErrorMessage'

export default {
  name: 'WalletProfitsChartView',
  components: {
    LoadingMessage,
    ErrorMessage
  },
  props: {
    wallets: {
      type: Array,
      required: true
    },
    currency: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      charts: [],
      isLoading: true,
      isFailedToLoad: false,
      number_of_days_before_today: 365
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    getMaxValue(points, prop) {
      return points[prop].reduce((prev, current) => {
        return prev.value > current.value ? prev : current
      })
    },
    async fetchAllWalletCharts() {
      return Promise.all(
        this.wallets.map(wallet =>
          fetchMarketChart(
            wallet,
            this.currency,
            this.number_of_days_before_today
          )
        )
      )
    },
    formatChart(charts) {
      return charts.map((chart, index) =>
        chart.map(points => {
          return {
            month: moment(points[0]).format('MMM-YY'),
            value: parseInt(
              this.wallets[index].balance * points[1] -
                this.wallets[index].investment
            )
          }
        })
      )
    },
    getMaxValueByMonth(formattedChartGroupedByMonth) {
      return formattedChartGroupedByMonth.reduce((maxValues, monthPoints) => {
        for (let month in monthPoints) {
          if (Object.prototype.hasOwnProperty.call(monthPoints, month)) {
            const max = this.getMaxValue(monthPoints, month)

            if (maxValues[month]) {
              maxValues[month] = max.value + maxValues[month]
            } else {
              maxValues[month] = max.value
            }
          }
        }
        return maxValues
      }, {})
    },
    async fetchData() {
      /*
      This algorithm computes the maximum wallet profits each month between today and 12 months before
       */
      this.isLoading = true
      this.isFailedToLoad = false
      try {
        const charts = await this.fetchAllWalletCharts()
        const formattedCharts = this.formatChart(charts)
        const formattedChartGroupedByMonth = formattedCharts.map(points =>
          groupBy(points, 'month')
        )

        const maxValuesByMonth = this.getMaxValueByMonth(
          formattedChartGroupedByMonth
        )

        this.charts = Object.keys(maxValuesByMonth).map(date => {
          return { date, profit: maxValuesByMonth[date] }
        })
      } catch (e) {
        this.isFailedToLoad = true
        console.log('when fetching wallet charts', e)
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.WalletProfitsChartView {
  width: 100%;
  flex-direction: column;
  align-items: center;

  .loading-message {
    height: 100%;
    justify-content: center;
  }

  SplineAreaSeries {
    fill-color: rgba(187, 134, 252, 0.15);
    stroke-color: $primary;
  }
}
</style>
