<template>
  <div class="page-container">
    <section class="flex offset-fotm-item">
      <div>
        <el-form @submit.native.prevent="search" inline>
          <el-form-item label="搜索">
            <el-input clearable
                      placeholder="宿舍号、门牌号"
                      prefix-icon="el-icon-search"
                      size="medium"
                      v-model="searchForm.keyword"/>
          </el-form-item>
          <el-form-item label="楼栋号">
            <el-select placeholder="全部" size="medium" style="width:100px;" v-model="searchForm.building_num">
              <el-option :key="item._id"
                         :label="item.text"
                         :value="item.building_num"
                         v-for="item in options.buildings"/>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button native-type="submit" size="medium" type="primary">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="margin-left-auto">
        <transition name="el-fade-in">
          <el-button @click="deleteManyDorm" size="medium" type="danger" v-if="selectedDorms.length">批量删除宿舍
          </el-button>
        </transition>
        <el-button @click="showAddDormDialog" size="medium" type="primary">新增宿舍</el-button>
      </div>
    </section>
    <!-- 宿舍表格 -->
    <el-table :data="DormData"
              :default-sort="{prop: 'building_num', order: 'ascending'}"
              border
              class="margin-top-20"
              stripe>
      <el-table-column align="center" label="宿舍号" prop="dorm_num" sortable/>
      <el-table-column align="center" label="楼栋号" prop="building_id.building_num" sortable/>
      <el-table-column align="center" label="已住人数" prop="reside_count" sortable/>
      <el-table-column align="center" label="容纳人数" prop="contain_count" sortable/>
      <el-table-column align="center" label="操作">
        <template #default="scope">
          <el-tooltip content="查看/编辑信息">
            <el-button @click="editDetail(scope.row)" circle icon="el-icon-edit font-size-16" plain size="mini"/>
          </el-tooltip>
          <el-tooltip content="删除">
            <el-button @click="deleteDorm(scope.row)"
                       circle
                       icon="el-icon-delete font-size-16"
                       plain
                       size="mini"
                       type="danger"/>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="paging.current"
      :total="paging.total"
      @current-change="curPageChange"
      background
      class="margin-top-20"
      layout="total, prev, pager, next"
      style="text-align: right">
    </el-pagination>
    <!-- 添加宿舍 -->
    <add-dorm :visible.sync="isShowAddDorm" @update="getData"/>
    <!-- 修改宿舍信息 -->
    <edit-dorm :visible.sync="isShowEditDorm" :curDorm="curDorm"  @update="getData"/>
  </div>
</template>

<script>
  import AddDorm from "@/components/dorm/add-dorm";
  import {getAllBuildings} from "@/api/building";
  import request from "@/api";
  import EditDorm from "@/components/dorm/edit-dorm";
  import _ from "lodash"

  export default {
    name: "dorm-manage",
    components: {EditDorm, AddDorm},
    data() {
      return {
        searchForm: {
          keyword: "",
          building_num: 0
        },
        paging: {
          current: 1,
          total: 1,
          pageCount: 1
        },
        DormData: [],
        selectedDorms: [],
        isShowAddDorm: false,
        options: {
          buildings: []
        },
        isShowEditDorm: false,
        curDorm: {}
      }
    },
    methods: {
      search() {
        this.paging.current = 1;
        this.getData();
      },
      getData() {
        const form = {...this.searchForm};
        form.page = this.paging.current;
        request.post('/api/dorm/search', form).then(res => {
          this.DormData = res.data.data.list;
          this.paging = Object.assign(this.paging, res.data.data.paging);
          if (this.paging.current > this.paging.pageCount) {
            this.paging.current = this.paging.pageCount;
            this.getData();
          }
        })
      },
      curPageChange(page) {
        this.paging.current = page;
        this.getData();
      },
      deleteManyDorm() {

      },
      showAddDormDialog() {
        this.isShowAddDorm = true;
      },
      editDetail(row) {
        this.curDorm = _.cloneDeep(row);
        this.isShowEditDorm = true;
      },
      deleteDorm(row) {
        this.$confirm('此操作将永久删除该宿舍且无法恢复，是否继续？', '提示', {
          type: "warning"
        }).then(()=>{
          this.request.post('/api/dorm/removeOne',{id:row._id}).then(res=>{
            if (!res.data.errcode) {
              this.$alert('删除成功！', '提示', {type: "success"});
              this.getData();
            }else{
              this.$alert(res.data.errors.join(','), '错误', {type: "error"});
            }
          })
        })
      }
    },
    async mounted() {
      this.getData();
      this.options.buildings = (await getAllBuildings()).data.data;
      this.options.buildings.forEach(item => item.text = item.building_num + '号楼');
      this.options.buildings.unshift({building_num: 0, text: "全部"})
    }
  }
</script>

<style lang="scss" scoped>

</style>
