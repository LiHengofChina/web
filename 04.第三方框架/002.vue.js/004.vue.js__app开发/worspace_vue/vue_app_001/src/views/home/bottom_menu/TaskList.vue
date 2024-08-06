<template>
  <div class="task-list">
    <div class="main-tab-bar">
      <button 
        :class="{ active: currentMainTab === 'pending' }" 
        @click="currentMainTab = 'pending'">
        待处理
      </button>
      <button 
        :class="{ active: currentMainTab === 'processed' }" 
        @click="currentMainTab = 'processed'">
        已处理
      </button>
    </div>

    <div class="content">
      <div v-if="currentMainTab === 'pending'" class="tab-content">
        <div class="accordion">
          <div class="accordion-item">
            <button class="accordion-header" @click="toggleAccordion('A')">
              A选项卡
            </button>
            <div v-if="currentAccordion === 'A'" class="accordion-body">
              <h2>A选项卡内容</h2>
              <table class="data-table">
                <thead>
                  <tr>
                    <th>客户名称</th>
                    <th>申请时间</th>
                    <th>状态</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in tasksA" :key="item.id">
                    <td>{{ item.name }}</td>
                    <td>{{ item.date }}</td>
                    <td>{{ item.status }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="accordion-item">
            <button class="accordion-header" @click="toggleAccordion('B')">
              B选项卡
            </button>
            <div v-if="currentAccordion === 'B'" class="accordion-body">
              <h2>B选项卡内容</h2>
              <table class="data-table">
                <thead>
                  <tr>
                    <th>客户名称</th>
                    <th>申请时间</th>
                    <th>状态</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in tasksB" :key="item.id">
                    <td>{{ item.name }}</td>
                    <td>{{ item.date }}</td>
                    <td>{{ item.status }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div v-if="currentMainTab === 'processed'" class="tab-content">
        <h2>已处理内容</h2>
        <!-- 类似的已处理任务表格内容 -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TaskList',
  data() {
    return {
      currentMainTab: 'pending', // 默认选择的主标签
      currentAccordion: null, // 当前展开的手风琴项
      tasksA: [
        // 示例数据 A
        { id: 1, name: '客户A', date: '2024-01-01', status: '待处理' },
        { id: 2, name: '客户B', date: '2024-01-02', status: '待处理' },
        // 更多数据...
      ],
      tasksB: [
        // 示例数据 B
        { id: 3, name: '客户C', date: '2024-01-03', status: '待处理' },
        { id: 4, name: '客户D', date: '2024-01-04', status: '待处理' },
        // 更多数据...
      ]
    };
  },
  methods: {
    toggleAccordion(tab) {
      this.currentAccordion = this.currentAccordion === tab ? null : tab;
    }
  }
}
</script>

<style scoped>
.task-list {
  width: 100%;
  padding: 0;
  background-color: #f8f9fa;
}

.main-tab-bar {
  display: flex;
  justify-content: space-around;
  margin-bottom: 1rem;
}

.main-tab-bar button {
  flex: 1;
  padding: 0.5rem;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 1rem;
}

.main-tab-bar button.active {
  border-bottom: 2px solid #007bff;
  font-weight: bold;
}

.content {
  width: 100%;
  padding: 1rem;
  background-color: #fff;
  border-radius: 0;
  box-shadow: none;
}

.accordion {
  display: flex;
  flex-direction: column;
}

.accordion-item {
  margin-bottom: 1rem;
}

.accordion-header {
  width: 100%;
  padding: 0.5rem;
  background: #122c5e;
  color: #fff;
  text-align: left;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

.accordion-body {
  padding: 1rem;
  background: #f1f1f1;
  border: 1px solid #ddd;
  border-top: none;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th, .data-table td {
  padding: 0.5rem;
  text-align: left;
}

.data-table th {
  background-color: #f1f1f1;
}

.data-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.data-table tr:hover {
  background-color: #efefef;
}
</style>
