<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="产品线" prop="product">
        <el-select
          filterable
          v-model="queryParams.product"
          placeholder="请选择"
          @change="handleProductChange"
        >
          <el-option v-for="item in option.products" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>

      <el-form-item label="分组" prop="group">
        <el-select
          filterable
          v-model="queryParams.group"
          placeholder="请选择"
          @change="handleGroupChange"
        >
          <el-option v-for="item in option.groups" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>

      <el-form-item label="应用" prop="app">
        <el-select filterable v-model="queryParams.app" placeholder="请选择" @change="handleAppChange">
          <el-option v-for="item in option.apps" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>

      <el-form-item label="类名" prop="clazz">
        <el-select
          filterable
          v-model="queryParams.clazz"
          placeholder="请选择"
          @change="handleClazzChange"
        >
          <el-option v-for="item in option.clazzs" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>

      <el-form-item label="方法名" prop="method">
        <el-select
          filterable
          v-model="queryParams.method"
          placeholder="请选择"
        >
          <el-option v-for="item in option.methods" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>

      <el-form-item label="时间" prop="createTime">
        <el-date-picker
          v-model="dateRange"
          size="small"
          style="width: 320px"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>

      <el-form-item label="日志ID" prop="id">
        <el-input
          v-model="queryParams.id"
          placeholder="请输入日志ID"
          clearable
          size="small"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getMetaLog } from '@/api/monitor/perflog';

export default {
  name: 'PerfSearch',
  data() {
    return {
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 下拉列表数据
      option: {
        // 产品线
        products: [],
        // 分组
        groups: [],
        // 应用
        apps: [],
        // 类名
        clazzs: [],
        // 方法名
        methods: []
      },
      // 时间筛选
      dateRange: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        id: undefined,
        product: undefined,
        group: undefined,
        app: undefined,
        clazz: undefined,
        method: undefined,
        level: undefined
      },
      // 表单参数
      form: {},
      // 明细日志
      detailMsg: '',
      // 表单校验
      rules: {
      }
    };
  },
  computed: {
    timeDefault() {
      let date = new Date();
      // 通过时间戳计算
      let defalutStartTime = date.getTime() - 1 * 24 * 3600 * 1000;// 转化为时间戳
      let defalutEndTime = date.getTime();
      let startDateNs = new Date(defalutStartTime);
      let endDateNs = new Date(defalutEndTime);
      // 月，日 不够10补0
      defalutStartTime = startDateNs.getFullYear() + '-' + ((startDateNs.getMonth() + 1) >= 10 ? (startDateNs.getMonth() + 1) : '0' + (startDateNs.getMonth() + 1)) + '-' + (startDateNs.getDate() >= 10 ? startDateNs.getDate() : '0' + startDateNs.getDate()) + " 00:00:00";
      defalutEndTime = endDateNs.getFullYear() + '-' + ((endDateNs.getMonth() + 1) >= 10 ? (endDateNs.getMonth() + 1) : '0' + (endDateNs.getMonth() + 1)) + '-' + (endDateNs.getDate() >= 10 ? endDateNs.getDate() : '0' + endDateNs.getDate()) + " 00:00:00";
      return [defalutStartTime, defalutEndTime];
    }
  },
  //页面加载时候，在mounted中进行赋值
  mounted() {
    // 初始化查询，默认为前一天
    this.dateRange = this.timeDefault;
  },
  created() {
    this.dateRange = this.timeDefault;
    this.getProducts();
  },
  methods: {
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        metaId: undefined,
        executeTimespan: undefined,
        paramsIn: undefined,
        paramsOut: undefined,
        code: undefined,
        errmsg: undefined,
        createTime: undefined,
        timestamp: undefined
      };
      this.resetForm('form');
    },

    // 获取产品线
    getProducts() {
      const query = {
        level: 1
      };
      getMetaLog(query).then(response => {
        this.option.products = response.data;
        this.option.products.push('*');
      });
    },

    // 产品线
    handleProductChange() {
      const query = {
        level: 2,
        product: this.queryParams.product
      };
      getMetaLog(query).then(response => {
        this.option.groups = response.data;
        this.option.groups.push('*');
      });
    },

    // 服务组
    handleGroupChange() {
      const query = {
        level: 3,
        product: this.queryParams.product,
        group: this.queryParams.group
      };
      getMetaLog(query).then(response => {
        this.option.apps = response.data;
        this.option.apps.push('*');
      });
    },

    // 应用
    handleAppChange() {
      const query = {
        level: 4,
        product: this.queryParams.product,
        group: this.queryParams.group,
        app: this.queryParams.app
      };
      getMetaLog(query).then(response => {
        this.option.clazzs = response.data;
        this.option.clazzs.push('*');
      });
    },

    // 方法
    handleClazzChange() {
      this.queryParams.level = 5;
      const query = {
        level: 5,
        product: this.queryParams.product,
        group: this.queryParams.group,
        app: this.queryParams.app,
        clazz: this.queryParams.clazz
      };
      getMetaLog(query).then(response => {
        this.option.methods = response.data;
        this.option.methods.push('*');
      });
    }
  }
};
</script>
