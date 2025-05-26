<template>
    <div class="grid grid-cols-2 gap-4 w-full">

        <CardInfoItem
            v-if="card.readableType"
            :value="card.readableType"
            :hideLabel="true"
            colSpan="full"
            class="font-bold justify-center"
        />

        <CardInfoItem
            v-if="card.attribute !== null"
            :value="card.attribute"
            :icon="getAttributeImage(card.attribute)"
            alt="Attribute icon"
            label="Attribute"
        />

        <CardInfoItem
            v-if="card.level !== null"
            :value="'Level '+card.level"
            :icon="iconLevel"
            alt="Level icon"
            label="Level"
        />

        <CardInfoItem
            v-if="card.rank_level !== null"
            :value="'Rank '+card.rank_level"
            :icon="iconRank"
            alt="Rank icon"
            label="Rank"
        />

        <CardInfoItem
            v-if="card.link_level !== null"
            :value="'Link-'+card.link_level">
            <template #label>
                <div class="relative w-6 h-6 m-auto">
                    <img src="@/assets/img/yugioh/link/icon_link_base.png" alt="Link Arrows" class="absolute"/>

                    <img
                        v-for="dir in card.link_markers"
                        :key="dir"
                        :src="`/src/assets/img/yugioh/link/icon_link_${dir.toLowerCase().replace('-','_')}.png`"
                        :alt="`Arrow ${dir} red`"
                        class="absolute pointer-events-none"
                    />
                </div>
            </template>
        </CardInfoItem>

        <CardInfoItem
            v-if="card.att !== null"
            :value="(card.att !== -1) ? card.att : '?'"
            label="ATK"
        />

        <CardInfoItem
            v-if="card.att !== null"
            :value="card.def ? ((card.def !== -1) ? card.def : '?') : '-'"
            label="DEF"
        />

        <CardInfoItem
            v-if="tagListFormatted"
            :value="'[ '+tagListFormatted+' ]'"
            :hideLabel="true"
            colSpan="full"
            class="font-bold justify-center"
        />

        <CardInfoItem
            v-if="card.pendulum_description"
            :hideLabel="true"
            colSpan="full"
            class="whitespace-pre-wrap">
            <template #value>
                <div class="border-b-2 mb-2 font-bold">Pendulum Effect</div>
                {{ card.pendulum_description }}
            </template>
        </CardInfoItem>

        <CardInfoItem
            v-if="card.description"
            :hideLabel="true"
            colSpan="full"
            class="whitespace-pre-wrap">
            <template #value>
                <div class="border-b-2 mb-2 font-bold">Card Text</div>
                {{ card.description }}
            </template>
        </CardInfoItem>

    </div>
</template>

<script setup lang="ts">
import {YugiohAppCard} from "@/types/card";
import {computed} from "vue";
import {getAttributeImage} from "@/utils/yugioh";
import CardInfoItem from "@/components/cardTemplates/CardInfoItem.vue";
import iconRank from '@/assets/img/yugioh/icon_rank.png'
import iconLevel from '@/assets/img/yugioh/icon_level.png'

/**
 * Props definition.
 *
 * @prop {YugiohAppCard} card - The card to be rendered in the viewer
 */
const props = defineProps<{
    card: YugiohAppCard
}>()

const tagListFormatted = computed(() => props.card.tagList?.join(' / '))
</script>