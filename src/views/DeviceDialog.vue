<template>
    <el-dialog
        v-model="dialogVisible"
        width="50%"
        :before-close="handleClose"
        :title="$t('devicelist.add_device')">
        
        <div class="dialog-content">
            <h3>{{ $t('devicelist.basic_info') }}</h3>
            <el-form label-position="right" label-width="100px">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item :label="$t('devicelist.usage')" required>
                            <el-select v-model="usage" :placeholder="$t('devicelist.usage')" style="width: 100%">
                                <el-option
                                    v-for="item in usage_options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                    />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('devicelist.name')" required>
                            <el-input v-model="name" :placeholder="$t('devicelist.name')" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item :label="$t('devicelist.supplier')" required>
                            <el-select v-model="supplier" :placeholder="$t('devicelist.supplier')" style="width: 100%">
                                <el-option
                                    v-for="item in supplier_options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                    />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('devicelist.type')" required>
                            <el-select v-model="type" :disabled="isEmpty(supplier)" :placeholder="isEmpty(supplier) ? $t('devicelist.supplier') : $t('devicelist.type')" style="width: 100%">
                                <el-option
                                    v-for="item in type_options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                    />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item :label="$t('devicelist.department')" required>
                            <el-select v-model="department" :placeholder="$t('devicelist.department')" style="width: 100%">
                                <el-option
                                    v-for="item in department_options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                    />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('devicelist.serial_number')">
                            <el-input v-model="serial_number" :placeholder="$t('devicelist.serial_number')" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item :label="$t('devicelist.deploy_time')" required>
                            <el-date-picker
                                v-model="deploy_time"
                                type="date"
                                :placeholder="$t('devicelist.deploy_time')"
                                style="width: 100%"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('devicelist.place')">
                            <el-input v-model="place" :placeholder="$t('devicelist.place')" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-form-item :label="$t('devicelist.is_enable')" required>
                    <el-radio-group v-model="enable">
                        <el-radio :label="1">{{ $t('devicelist.enable') }}</el-radio>
                        <el-radio :label="0">{{ $t('devicelist.disable') }}</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>

            <h3>{{ $t('devicelist.connection_info') }}</h3>
            <!-- Placeholder for connection info as per requirement/screenshot implication -->
        </div>

        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确认</el-button>
            </span>
        </template>
    </el-dialog>
</template>


<script lang="ts">
import { defineComponent, ref } from 'vue'
import { isEmpty } from '@/utils/validate'

interface TypeOption {
    value: number
    label: string
}

export default defineComponent({
    name: 'DeviceDialog',
    props: {
        type_options: {
            type: Array as () => TypeOption[],
            default: () => []
        },
        usage_options: {
            type: Array as () => TypeOption[],
            default: () => []
        },
        department_options: {
            type: Array as () => TypeOption[],
            default: () => []
        },
        enable_options: {
            type: Array as () => TypeOption[],
            default: () => []
        },
        online_options: {
            type: Array as () => TypeOption[],
            default: () => []
        },
        supplier_options: {
            type: Array as () => TypeOption[],
            default: () => []
        }
    },
    
    data() {
        return {
            dialogVisible: ref(false),
            name: '',
            type: '',
            usage: '',
            department: '',
            serial_number: '',
            enable: 1, // Default to Enable
            online: '',
            supplier: '',
            deploy_time: '',
            place: ''
        }
    },
    methods: {
        isEmpty,
        handleClose(done: any) {
            done()
        },
    }
})
</script>

<style scoped>
.dialog-content {
    padding: 0 20px;
}
h3 {
    margin-bottom: 20px;
    font-size: 16px;
    font-weight: bold;
    color: #303133;
}
</style>

