<template>
  <FlexboxLayout class="WalletTotalValueChart darkMode">
    <StackLayout v-show="!loading">
      <RadCartesianChart>
        <CategoricalAxis v-tkCartesianHorizontalAxis />
        <LinearAxis v-tkCartesianVerticalAxis />

        <SplineAreaSeries
          v-tkCartesianSeries
          :items="charts"
          categoryProperty="date"
          valueProperty="value"
          showLabels="true"
        />
      </RadCartesianChart>
    </StackLayout>
  </FlexboxLayout>
</template>

<script>
import { WalletMixin } from '@/mixins/WalletMixin'
import { fetchMarketChart } from '@/Api'
import moment from 'moment'
import groupBy from 'lodash.groupby'

export default {
  name: 'WalletTotalValueChart',
  mixins: [WalletMixin],
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
      loading: true,
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
    async fetchData() {
      this.loading = true
      try {
        const charts = await this.fetchAllWalletCharts()
        const formattedCharts = charts.map((chart, index) =>
          chart.map(values => {
            return {
              month: moment(values[0]).format('MMM-YY'),
              value: parseInt(this.wallets[index].balance * values[1])
            }
          })
        )
        const formattedChartGroupedByMonth = formattedCharts.map(points =>
          groupBy(points, 'month')
        )

        const groupedMaxPoints = {}
        formattedChartGroupedByMonth.map(monthPoints => {
          for (let month in monthPoints) {
            if (Object.prototype.hasOwnProperty.call(monthPoints, month)) {
              const max = this.getMaxValue(monthPoints, month)

              if (groupedMaxPoints[month]) {
                groupedMaxPoints[month] = max.value + groupedMaxPoints[month]
              } else {
                groupedMaxPoints[month] = max.value
              }
            }
          }
        })

        this.charts = Object.keys(groupedMaxPoints).map(date => {
          return { date, value: groupedMaxPoints[date] }
        })
      } catch (e) {
        console.log('when fetching wallet charts', e)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.WalletTotalValueChart {
  width: 100%;
  flex-direction: column;
  align-items: center;
}
</style>
