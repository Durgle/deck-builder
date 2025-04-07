export const rulesMapping = {
    yugioh: {
        deckRules: () => import('@/rules/yugioh/deckRules'),
        distributionRules: () => import('@/rules/yugioh/distributionRules')
    },
    pokemon: {
        //deckRules: () => import('@/rules/pokemon/deckRules'),
        //distributionRules: () => import('@/rules/pokemon/distributionRules')
    }
};