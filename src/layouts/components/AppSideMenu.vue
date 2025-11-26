<template>
    <el-menu :default-active="$route.path"
             :collapse="collapse"
             background-color="transparent"
             text-color="#a0aec0"
             active-text-color="#fff"
             class="sidebar-menu"
             :collapse-transition="false"
             router>
        <side-menu-item v-for="item in sideMenuData" :key="item.url" :item="item" />
    </el-menu>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useI18n } from 'vue-i18n'

import SideMenuItem, { type MenuItem } from '@/layouts/components/AppSideMenuItem.vue'

export default defineComponent({
    name: 'AppSideMenu',
    components: {
        SideMenuItem,
    },
    props: {
        collapse: {
            type: Boolean,
            default: false,
        },
    },
    setup() {
        const { t } = useI18n()

        const sideMenuData = computed<MenuItem[]>(() => [
            {
                name: t('layout.menu.home'),
                url: '/',
                icon: 'House'
            },
            {
                name: t('layout.menu.about'),
                url: '/about',
                icon: 'InfoFilled',
            },
        ])

        return {
            t,
            sideMenuData,
        }
    },
})
</script>
