<template>
  <div class="app-container">
    <perf-search ref="searchForm"/>

    <el-row class="btn-group">
      <el-col :span="2">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
      </el-col>
      <el-col :span="2">
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-col>
    </el-row>

    <div class="dashboard-editor-container">
      <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
        <perf-line :chartData="executeData" />
      </el-row>
      <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
        <perf-line :chartData="expRatioData" />
      </el-row>
      <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
        <perf-line :chartData="sysExpRatioData" />
      </el-row>
      <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
        <perf-line :chartData="bizExpRatioData" />
      </el-row>
      <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
        <perf-line :chartData="avgTimeData" />
      </el-row>
      <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
        <perf-line :chartData="maxTimeData" />
      </el-row>
      <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
        <perf-line :chartData="minTimeData" />
      </el-row>
    </div>
  </div>
</template>

<script>
import { getMetaLog, getMetaLogCount } from '@/api/monitor/perflog';
import PerfLine from './PerfLine.vue';
import PerfSearch from './PerfSearch.vue';
// 折线图数据模型
class LineData {
  constructor() {
    this.title = '';
    this.xAxis = [];
    this.yAxis = [];
    this.yUnit = '';
    this.yFormat = '{value}';
  }
}

export default {
  name: 'SysperfLogCount',
  components: {
    PerfLine,
    PerfSearch
  },
  data() {
    return {
      formParams: {
        pageNum: 1,
        pageSize: 10
      },
      executeData: new LineData(),
      expRatioData: new LineData(),
      sysExpRatioData: new LineData(),
      bizExpRatioData: new LineData(),
      avgTimeData: new LineData(),
      maxTimeData: new LineData(),
      minTimeData: new LineData()
    };
  },
  computed: {
    
  },
  //页面加载时候，在mounted中进行赋值
  mounted() {
  },
  created() {
    
  },
  methods: {
    /** 查询系统接口日志列表 */
    getList() {
      this.loading = true;
      this.resetGraph();
      let mergeParams = Object.assign(this.formParams,this.$refs.searchForm.queryParams);
      getMetaLogCount(this.addDateRange(mergeParams, this.$refs.searchForm.dateRange)).then(response => {
        this.loading = false;
        // 标题
        for (let item in response.rows) {
          let row = response.rows[item];
          let prefix = this.buildPrefixTitle(row);
          this.executeData.title = prefix + "执行次数";
          this.executeData.yUnit = '';
          
          this.expRatioData.title = prefix + "异常率";
          this.expRatioData.yUnit = '%';
          this.expRatioData.yFormat='{value}%'
          
          this.sysExpRatioData.title = prefix + "系统异常率";
          this.sysExpRatioData.yUnit = '%';
          this.sysExpRatioData.yFormat='{value}'
          
          this.bizExpRatioData.title = prefix + "业务异常率";
          this.bizExpRatioData.yUnit = '%';
          this.bizExpRatioData.yFormat='{value}'
          
          this.avgTimeData.title = prefix + "平均执行时间";
          this.avgTimeData.yUnit = 'ms';
          
          this.maxTimeData.title = prefix + "最大执行时间";
          this.maxTimeData.yUnit = 'ms';
          
          this.minTimeData.title = prefix + "最小执行时间";
          this.minTimeData.yUnit = 'ms';
          break;
        }
        // x,y轴坐标数据实体
        for (let item in response.rows) {
          let row = response.rows[item];

          this.executeData.xAxis.push(row.countDuration);
          this.executeData.yAxis.push(row.executeTotal);

          this.expRatioData.xAxis.push(row.countDuration);
          this.expRatioData.yAxis.push((row.exceptionRatio*100).toFixed(2));

          this.sysExpRatioData.xAxis.push(row.countDuration);
          this.sysExpRatioData.yAxis.push((row.sysExceptionRatio*100).toFixed(2));

          this.bizExpRatioData.xAxis.push(row.countDuration);
          this.bizExpRatioData.yAxis.push((row.bizExceptionRatio*100).toFixed(2));

          this.avgTimeData.xAxis.push(row.countDuration);
          this.avgTimeData.yAxis.push(row.executeTimeAvg);

          this.maxTimeData.xAxis.push(row.countDuration);
          this.maxTimeData.yAxis.push(row.executeTimeMax);

          this.minTimeData.xAxis.push(row.countDuration);
          this.minTimeData.yAxis.push(row.executeTimeMin);
        }
      });
    },
    buildPrefixTitle(row) {
      let prefix = '';
      if (row.product && row.product != '') {
        prefix += row.product + '_';
      }
      if (row.groupName && row.groupName != '') {
        prefix += row.groupName + '_';
      }
      if (row.app && row.app != '') {
        prefix += row.app + '_';
      }
      if (row.clazz && row.clazz != '') {
        prefix += row.clazz + '_';
      }
      if (row.method && row.method != '') {
        prefix += row.method + '_';
      }
      if (row.operatorIp && row.operatorIp != '') {
        prefix += row.operatorIp + '_';
      }
      return prefix;
    },
    resetGraph() {
      let graphs = [this.executeData, this.expRatioData, this.sysExpRatioData, this.bizExpRatioData, this.avgTimeData, this.maxTimeData, this.minTimeData];
      for (let item in graphs) {
        let graph = graphs[item];
        graph.title = '';
        graph.xAxis = [];
        graph.yAxis = [];
        graph.yUnit = '';
      }
    },
    
    /** 搜索按钮操作 */
    handleQuery() {
      this.formParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
       this.$refs.searchForm.resetQueryForm('queryForm');
    }
  }
};
</script>


<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}

.btn-group{
  padding:0 0 10px 0px;
}
</style>
