export default {
    addVariantOption: `
        INSERT INTO variant_options (text, price, itemVariantsId) VALUES ?
    `,
    getItemIdOfOption: `
        SELECT vo.id, text, price, itemVariantsId FROM variant_options vo JOIN item_variants_mapping mp ON vo.itemVariantsId= mp.variantId WHERE vo.id = ? AND mp.itemId = ? ; 
    `,
}  